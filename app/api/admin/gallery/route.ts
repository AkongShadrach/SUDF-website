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
  const file = form.get("image");
  const title = String(form.get("title") ?? "").trim();
  const caption = String(form.get("caption") ?? "").trim();
  const category = String(form.get("category") ?? "outreach").trim();
  const status = String(form.get("status") ?? "draft");
  const displayOrder = Number(form.get("display_order") ?? 0);
  if (!(file instanceof File) || !title) return NextResponse.json({error:"A title and image file are required."},{status:400});
  const ext = MIME_EXT[file.type];
  if (!ext) return NextResponse.json({error:"Use a JPG, PNG, WebP or AVIF image."},{status:400});
  if (file.size > MAX_BYTES) return NextResponse.json({error:"Image must be 10 MB or smaller."},{status:400});
  if (!["draft","published","archived"].includes(status)) return NextResponse.json({error:"Invalid publishing status."},{status:400});
  const supabase = createAdminServiceClient();
  const id = crypto.randomUUID();
  const path = `gallery/${id}.${ext}`;
  const {error:uploadError} = await supabase.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});
  if (uploadError) return NextResponse.json({error:"Image upload failed: "+uploadError.message},{status:400});
  const {data:{publicUrl}} = supabase.storage.from(BUCKET).getPublicUrl(path);
  const {data,error} = await supabase.from("gallery_items").insert({
    id,title,caption:caption||null,image_url:publicUrl,storage_path:path,category:category||"outreach",
    display_order:Number.isFinite(displayOrder)?displayOrder:0,status
  }).select("*").single();
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    return NextResponse.json({error:"The image uploaded but its gallery record could not be saved: "+error.message},{status:400});
  }
  await supabase.from("sudf_admin_audit_logs").insert({actor_auth_user_id:admin.userId,actor_email:admin.email,actor_role:admin.role,action:"gallery_item_created",resource_type:"gallery_items",resource_id:id,details:{title,status}});
  refresh();
  return NextResponse.json({item:data},{status:201});
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
