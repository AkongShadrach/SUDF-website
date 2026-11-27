import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "sudf-media";
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_GALLERY_FILES = 12;
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

type UploadedImage = { url: string; path: string; alt: string };

async function authorised() {
  const admin = await getAdminContext();
  return admin && ["super_admin", "content_editor"].includes(admin.role) ? admin : null;
}

function slugify(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 72) || "field-story";
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/field-stories");
  revalidatePath("/admin/field-stories");
  if (slug) revalidatePath("/field-stories/" + slug);
}

function parseOptionalNumber(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : NaN;
}

async function uploadImage(supabase: ReturnType<typeof createAdminServiceClient>, file: File, folder: string): Promise<UploadedImage> {
  const ext = MIME_EXT[file.type];
  if (!ext) throw new Error("Use JPG, PNG, WebP or AVIF images.");
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) throw new Error("Each image must be 10 MB or smaller.");
  const path = `field-stories/${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed: " + error.message);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path, alt: file.name.replace(/\.[^.]+$/, "") };
}

async function uniqueSlug(supabase: ReturnType<typeof createAdminServiceClient>, title: string, excludeId?: string) {
  const base = slugify(title);
  let candidate = base;
  let attempt = 0;
  while (true) {
    let query = supabase.from("field_stories").select("id").eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error("Could not verify story URL: " + error.message);
    if (!data) return candidate;
    attempt += 1;
    candidate = `${base}-${attempt + 1}`;
  }
}

function audit(supabase: ReturnType<typeof createAdminServiceClient>, admin: NonNullable<Awaited<ReturnType<typeof getAdminContext>>>, action: string, id: string, details: Record<string, unknown>) {
  return supabase.from("sudf_admin_audit_logs").insert({
    actor_auth_user_id: admin.userId, actor_email: admin.email, actor_role: admin.role,
    action, resource_type: "field_stories", resource_id: id, details,
  });
}

export async function POST(request: Request) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const activityDate = String(form.get("activity_date") ?? "").trim();
  const activityType = String(form.get("activity_type") ?? "Community outreach").trim();
  const venue = String(form.get("venue") ?? "").trim();
  const lga = String(form.get("lga") ?? "").trim();
  const state = String(form.get("state") ?? "").trim();
  const peopleReached = parseOptionalNumber(form.get("people_reached"));
  const peopleScreened = parseOptionalNumber(form.get("people_screened"));
  const impactNotes = String(form.get("impact_notes") ?? "").trim();
  const partners = String(form.get("partners") ?? "").split("\n").map(x => x.trim()).filter(Boolean);
  const status = String(form.get("status") ?? "draft");
  const featured = form.get("is_featured") === "true";
  const cover = form.get("cover");
  const galleryFiles = form.getAll("gallery").filter((x): x is File => x instanceof File && x.size > 0);

  if (!title || !excerpt || !body || !activityDate || !(cover instanceof File) || !cover.size) {
    return NextResponse.json({ error: "Title, summary, full report, activity date and cover photograph are required." }, { status: 400 });
  }
  if (Number.isNaN(peopleReached) || Number.isNaN(peopleScreened)) {
    return NextResponse.json({ error: "Impact figures must be whole numbers of zero or greater." }, { status: 400 });
  }
  if (!["draft", "published", "archived"].includes(status)) return NextResponse.json({ error: "Invalid publishing status." }, { status: 400 });
  if (galleryFiles.length > MAX_GALLERY_FILES) return NextResponse.json({ error: `Upload no more than ${MAX_GALLERY_FILES} additional photos at once.` }, { status: 400 });

  const supabase = createAdminServiceClient();
  const id = crypto.randomUUID();
  const uploaded: string[] = [];
  try {
    const slug = await uniqueSlug(supabase, title);
    const coverImage = await uploadImage(supabase, cover, id);
    uploaded.push(coverImage.path);
    const galleryImages: UploadedImage[] = [];
    for (const file of galleryFiles) {
      const image = await uploadImage(supabase, file, id);
      uploaded.push(image.path);
      galleryImages.push(image);
    }
    const now = new Date().toISOString();
    const { data, error } = await supabase.from("field_stories").insert({
      id, title, slug, excerpt, body, activity_date: activityDate, activity_type: activityType,
      venue: venue || null, lga: lga || null, state: state || null,
      cover_image_url: coverImage.url, cover_storage_path: coverImage.path,
      gallery_images: galleryImages, people_reached: peopleReached, people_screened: peopleScreened,
      impact_notes: impactNotes || null, partners, is_featured: featured && status === "published",
      status, published_at: status === "published" ? now : null,
    }).select("*").single();
    if (error) throw new Error("Story could not be saved: " + error.message);
    if (featured && status === "published") {
      await supabase.from("field_stories").update({ is_featured: false }).neq("id", id);
    }
    await audit(supabase, admin, "field_story_created", id, { title, slug, status });
    refresh(slug);
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Field story could not be created." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });

  const form = await request.formData();
  const id = String(form.get("id") ?? "");
  if (!id) return NextResponse.json({ error: "A field story ID is required." }, { status: 400 });

  const supabase = createAdminServiceClient();
  const { data: existing, error: findError } = await supabase.from("field_stories").select("*").eq("id", id).maybeSingle();
  if (findError || !existing) return NextResponse.json({ error: "Field story not found." }, { status: 404 });

  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const activityDate = String(form.get("activity_date") ?? "").trim();
  const status = String(form.get("status") ?? "draft");
  const featured = form.get("is_featured") === "true";
  const peopleReached = parseOptionalNumber(form.get("people_reached"));
  const peopleScreened = parseOptionalNumber(form.get("people_screened"));
  const galleryFiles = form.getAll("gallery").filter((x): x is File => x instanceof File && x.size > 0);
  const cover = form.get("cover");
  if (!title || !excerpt || !body || !activityDate) return NextResponse.json({ error: "Title, summary, full report and activity date are required." }, { status: 400 });
  if (Number.isNaN(peopleReached) || Number.isNaN(peopleScreened)) return NextResponse.json({ error: "Impact figures must be whole numbers of zero or greater." }, { status: 400 });
  if (!["draft", "published", "archived"].includes(status)) return NextResponse.json({ error: "Invalid publishing status." }, { status: 400 });
  if (galleryFiles.length > MAX_GALLERY_FILES) return NextResponse.json({ error: `Upload no more than ${MAX_GALLERY_FILES} additional photos at once.` }, { status: 400 });

  const uploaded: string[] = [];
  let nextSlug = existing.slug as string;
  try {
    if (title !== existing.title) nextSlug = await uniqueSlug(supabase, title, id);
    const updates: Record<string, unknown> = {
      title, slug: nextSlug, excerpt, body, activity_date: activityDate,
      activity_type: String(form.get("activity_type") ?? "Community outreach").trim(),
      venue: String(form.get("venue") ?? "").trim() || null,
      lga: String(form.get("lga") ?? "").trim() || null,
      state: String(form.get("state") ?? "").trim() || null,
      people_reached: peopleReached, people_screened: peopleScreened,
      impact_notes: String(form.get("impact_notes") ?? "").trim() || null,
      partners: String(form.get("partners") ?? "").split("\n").map(x => x.trim()).filter(Boolean),
      status, is_featured: featured && status === "published",
      published_at: status === "published" ? (existing.published_at || new Date().toISOString()) : null,
      updated_at: new Date().toISOString(),
    };
    if (cover instanceof File && cover.size) {
      const image = await uploadImage(supabase, cover, id);
      uploaded.push(image.path);
      updates.cover_image_url = image.url;
      updates.cover_storage_path = image.path;
    }
    const addedImages: UploadedImage[] = [];
    for (const file of galleryFiles) {
      const image = await uploadImage(supabase, file, id);
      uploaded.push(image.path);
      addedImages.push(image);
    }
    updates.gallery_images = [...(Array.isArray(existing.gallery_images) ? existing.gallery_images : []), ...addedImages];
    if (featured && status === "published") await supabase.from("field_stories").update({ is_featured: false }).neq("id", id);
    const { data, error } = await supabase.from("field_stories").update(updates).eq("id", id).select("*").single();
    if (error) throw new Error("Field story could not be updated: " + error.message);
    if (updates.cover_storage_path && existing.cover_storage_path) await supabase.storage.from(BUCKET).remove([existing.cover_storage_path]);
    await audit(supabase, admin, "field_story_updated", id, { title, slug: nextSlug, status });
    refresh(existing.slug);
    refresh(nextSlug);
    return NextResponse.json({ item: data });
  } catch (error) {
    if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Field story could not be updated." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  let input: { id?: string };
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (!input.id) return NextResponse.json({ error: "A field story ID is required." }, { status: 400 });

  const supabase = createAdminServiceClient();
  const { data: story, error: findError } = await supabase.from("field_stories").select("id,title,slug,cover_storage_path,gallery_images").eq("id", input.id).maybeSingle();
  if (findError || !story) return NextResponse.json({ error: "Field story not found." }, { status: 404 });
  const { error } = await supabase.from("field_stories").delete().eq("id", input.id);
  if (error) return NextResponse.json({ error: "Field story could not be deleted: " + error.message }, { status: 400 });
  const paths = [story.cover_storage_path, ...(Array.isArray(story.gallery_images) ? story.gallery_images.map((image: UploadedImage) => image.path) : [])].filter(Boolean);
  if (paths.length) await supabase.storage.from(BUCKET).remove(paths);
  await audit(supabase, admin, "field_story_deleted", input.id, { title: story.title, slug: story.slug });
  refresh(story.slug);
  return NextResponse.json({ success: true });
}
