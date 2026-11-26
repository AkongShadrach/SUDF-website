import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const admin = await getAdminContext();
  if (!admin || !["super_admin", "admin_email"].includes(admin.role)) {
    return NextResponse.json({ error: "Super administrator access required." }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof input.id === "string" ? input.id : "";
  const status = input.status;
  const allowedStatuses = ["new", "read", "responded", "closed"] as const;
  if (!id || typeof status !== "string" || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return NextResponse.json({ error: "A valid enquiry ID and status are required." }, { status: 400 });
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase
    .from("support_enquiries")
    .update({ status })
    .eq("id", id)
    .select("id,name,email,phone,organisation,support_type,support_area,indicative_amount,message,status,contact_consent,created_at")
    .single();

  if (error) return NextResponse.json({ error: "The enquiry status could not be updated." }, { status: 400 });

  await supabase.from("sudf_admin_audit_logs").insert({
    actor_auth_user_id: admin.userId,
    actor_email: admin.email,
    actor_role: admin.role,
    action: "support_enquiry_status_updated",
    resource_type: "support_enquiries",
    resource_id: id,
    details: { status },
  });

  revalidatePath("/admin/support");
  return NextResponse.json({ item: data });
}
