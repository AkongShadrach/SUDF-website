import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const BUCKET = "sudf-media";
const MAX_BYTES = 10 * 1024 * 1024;
const MIME_EXT: Record<string,string> = { "image/jpeg":"jpg", "image/png":"png", "image/webp":"webp", "image/avif":"avif" };

async function authorised() {
  const admin = await getAdminContext();
  return admin?.role === "super_admin" ? admin : null;
}
function refresh() { revalidatePath("/admin/media"); revalidatePath("/", "page"); }

export async function POST(request: Request) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({error:"Super administrator access required."},{status:403});
  const form = await request.formData();
  const files = form.getAll("images").filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const legacyFile = form.get("image");
  if (!files.length && legacyFile instanceof File) files.push(legacyFile);
  const title = String(form.get("title") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();
  const category = String(form.get("category") ?? "outreach").trim();
  const status = String(form.get("status") ?? "draft");
  const displayOrder = Number(form.get("display_order") ?? 0);
  if (!title || !files.length) return NextResponse.json({error:"A title and at least one image are required."},{status:400});
  if (files.length > 12) return NextResponse.json({error:"You can upload a maximum of 12 photographs at once."},{status:400});
  if (![ "draft", "published", "archived" ].includes(status)) return NextResponse.json({error:"Invalid publishing status."},{status:400});
  const supabase = createAdminServiceClient();
  const uploadedPaths: string[] = [];
  const rows: Record<string, unknown>[] = [];
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const ext = MIME_EXT[file.type];
    if (!ext) { if (uploadedPaths.length) await supabase.storage.from(BUCKET).remove(uploadedPaths); return NextResponse.json({error:"Use JPG, PNG, WebP or AVIF images."},{status:400}); }
    if (file.size > MAX_BYTES) { if (uploadedPaths.length) await supabase.storage.from(BUCKET).remove(uploadedPaths); return NextResponse.json({error:"Each image must be 10 MB or smaller."},{status:400}); }
    const id = crypto.randomUUID();
    const storagePath = `gallery/${id}.${ext}`;
    const {error:uploadError} = await supabase.storage.from(BUCKET).upload(storagePath,file,{contentType:file.type,upsert:false});
    if (uploadError) { if (uploadedPaths.length) await supabase.storage.from(BUCKET).remove(uploadedPaths); return NextResponse.json({error:"Image upload failed: "+uploadError.message},{status:400}); }
    uploadedPaths.push(storagePath);
    const {data:{publicUrl}} = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    rows.push({id,title,caption:caption||null,image_url:publicUrl,storage_path:storagePath,category:category||"outreach",display_order:(Number.isFinite(displayOrder)?displayOrder:0)+index,status});
  }
  const {data,error} = await supabase.from("gallery_items").insert(rows).select("*");
  if (error) { await supabase.storage.from(BUCKET).remove(uploadedPaths); return NextResponse.json({error:"Images uploaded but gallery records could not be saved: "+error.message},{status:400}); }
  await supabase.from("sudf_admin_audit_logs").insert({actor_auth_user_id:admin.userId,actor_email:admin.email,actor_role:admin.role,action:"gallery_items_created",resource_type:"gallery_items",details:{title,status,count:rows.length}});
  refresh();
  return NextResponse.json({items:data},{status:201});
}
export async function PATCH(request: Request) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({error:"Super administrator access required."},{status:403});
  let input: Record<string,unknown>;
  try { input=await request.json(); } catch { return NextResponse.json({error:"Invalid request body."},{status:400}); }
  if (typeof input.id!=="string" || !input.id) return NextResponse.json({error:"A gallery item ID is required."},{status:400});
  const values: Record<string,unknown> = {};
  for (const key of ["title","caption","category","display_order","status"] as const) if (key in input) values[key]=input[key];
  if (typeof values.title==="string") values.title=values.title.trim();
  if (!values.title && "title" in values) return NextResponse.json({error:"Title is required."},{status:400});
  if (values.status!==undefined && !["draft","published","archived"].includes(String(values.status))) return NextResponse.json({error:"Invalid publishing status."},{status:400});
  if (values.caption==="") values.caption=null;
  const supabase=createAdminServiceClient();
  const {data,error}=await supabase.from("gallery_items").update({...values,updated_at:new Date().toISOString()}).eq("id",input.id).select("*").single();
  if(error) return NextResponse.json({error:"Gallery item could not be updated: "+error.message},{status:400});
  await supabase.from("sudf_admin_audit_logs").insert({actor_auth_user_id:admin.userId,actor_email:admin.email,actor_role:admin.role,action:"gallery_item_updated",resource_type:"gallery_items",resource_id:input.id,details:values});
  refresh();
  return NextResponse.json({item:data});
}

export async function DELETE(request: Request) {
  const admin=await authorised();
  if(!admin) return NextResponse.json({error:"Super administrator access required."},{status:403});
  let input: Record<string,unknown>;
  try { input=await request.json(); } catch { return NextResponse.json({error:"Invalid request body."},{status:400}); }
  if(typeof input.id!=="string" || !input.id) return NextResponse.json({error:"A gallery item ID is required."},{status:400});
  const supabase=createAdminServiceClient();
  const {data,error}=await supabase.from("gallery_items").select("id,title,storage_path").eq("id",input.id).single();
  if(error || !data) return NextResponse.json({error:"Gallery item not found."},{status:404});
  const {error:deleteError}=await supabase.from("gallery_items").delete().eq("id",input.id);
  if(deleteError) return NextResponse.json({error:"Gallery item could not be deleted."},{status:400});
  if(data.storage_path) await supabase.storage.from(BUCKET).remove([data.storage_path]);
  await supabase.from("sudf_admin_audit_logs").insert({actor_auth_user_id:admin.userId,actor_email:admin.email,actor_role:admin.role,action:"gallery_item_deleted",resource_type:"gallery_items",resource_id:input.id,details:{title:data.title}});
  refresh();
  return NextResponse.json({success:true});
}
