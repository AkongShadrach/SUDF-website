import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const admin = await getAdminContext();
  if (!admin || admin.role !== "super_admin") return NextResponse.json({ error: "Super administrator access required." }, { status: 403 });

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const id = typeof input.id === "string" ? input.id : "";
  const status = input.status;
  const allowed = ["pending", "under_review", "approved", "declined", "withdrawn"] as const;
  const internalNotes = typeof input.internal_notes === "string" ? input.internal_notes.trim().slice(0, 5000) : "";
  if (!id || typeof status !== "string" || !allowed.includes(status as (typeof allowed)[number])) {
    return NextResponse.json({ error: "A valid application ID and status are required." }, { status: 400 });
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from("volunteer_applications")
    .update({ status, internal_notes: internalNotes || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id,name,email,phone,state,lga,volunteer_area,profession,specialisation,qualifications,registration_number,experience,availability,motivation,contact_consent,status,internal_notes,created_at,updated_at")
    .single();

  if (error) return NextResponse.json({ error: "The application could not be updated." }, { status: 400 });

  await supabase.from("sudf_admin_audit_logs").insert({
    actor_auth_user_id: admin.userId,
    actor_email: admin.email,
    actor_role: admin.role,
    action: "volunteer_application_updated",
    resource_type: "volunteer_applications",
    resource_id: id,
    details: { status },
  });

  revalidatePath("/admin/volunteers");
  return NextResponse.json({ item: data });
}
