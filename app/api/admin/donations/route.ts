import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const admin = await getAdminContext();
  if (!admin || !["super_admin", "admin_email"].includes(admin.role)) {
    return NextResponse.json({ error: "Authorised donation-management access is required." }, { status: 403 });
  }

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const id = typeof input.id === "string" ? input.id : "";
  const status = input.status;
  const allowedStatuses = ["pledged", "cancelled", "manual_review"] as const;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    || typeof status !== "string" || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return NextResponse.json({ error: "A valid donation ID and permitted status are required." }, { status: 400 });
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase
    .from("donations")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .neq("status", "paid")
    .select("id,status,updated_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: "The donation record could not be updated." }, { status: 400 });
  if (!data) return NextResponse.json({ error: "The donation was not found or is already confirmed as paid." }, { status: 409 });

  await supabase.from("sudf_admin_audit_logs").insert({
    actor_auth_user_id: admin.userId,
    actor_email: admin.email,
    actor_role: admin.role,
    action: "donation_status_updated",
    resource_type: "donations",
    resource_id: id,
    details: { status },
  });

  revalidatePath("/admin/donations");
  return NextResponse.json({ item: data });
}
