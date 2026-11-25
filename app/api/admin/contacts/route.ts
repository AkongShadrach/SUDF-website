import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const admin = await getAdminContext();
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json({ error: "Super administrator access required." }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof input.id === "string" ? input.id : "";
  const status = input.status;
  if (!id || !["new", "read", "resolved"].includes(String(status))) {
    return NextResponse.json({ error: "A valid message ID and status are required." }, { status: 400 });
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
    .select("id,name,email,message,status,created_at")
    .single();

  if (error) return NextResponse.json({ error: "The message status could not be updated." }, { status: 400 });

  await supabase.from("sudf_admin_audit_logs").insert({
    actor_auth_user_id: admin.userId,
    actor_email: admin.email,
    actor_role: admin.role,
    action: "contact_message_status_updated",
    resource_type: "contact_messages",
    resource_id: id,
    details: { status },
  });

  revalidatePath("/admin/contacts");
  return NextResponse.json({ item: data });
}
