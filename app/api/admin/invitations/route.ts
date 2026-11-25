import { NextRequest, NextResponse } from "next/server";
import { createAdminServiceClient, getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && new URL(origin).host !== host) {
      return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
    }

    const admin = await getAdminContext();
    if (!admin || admin.role !== "super_admin") {
      return NextResponse.json({ error: "Only an active super administrator can invite administrators." }, { status: 403 });
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const role = body.role === "content_editor" ? "content_editor" : body.role === "super_admin" ? "super_admin" : null;

    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (!role) {
      return NextResponse.json({ error: "Choose a valid administrator role." }, { status: 400 });
    }
    if (email === admin.email.toLowerCase() && role === "super_admin") {
      return NextResponse.json({ error: "You are already signed in as a super administrator." }, { status: 400 });
    }

    const service = createAdminServiceClient();
    const { data: invited, error: inviteError } = await service.auth.admin.inviteUserByEmail(email, {
      redirectTo: new URL("/admin/accept-invitation", request.url).toString(),
      data: { sudf_admin_invitation: true, sudf_admin_role: role },
    });

    if (inviteError || !invited.user) {
      return NextResponse.json({ error: inviteError?.message ?? "Supabase did not return the invited user." }, { status: 400 });
    }

    const { error: upsertError } = await service
      .from("sudf_admin_users")
      .upsert({
        auth_user_id: invited.user.id,
        email,
        role,
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "auth_user_id" });

    if (upsertError) {
      return NextResponse.json({
        error: "Supabase sent the invitation, but the SUDF administrator record could not be saved. Do not resend yet; contact the super administrator to reconcile this account.",
        invitationSent: true,
      }, { status: 500 });
    }

    await service.from("sudf_admin_audit_logs").insert({
      actor_auth_user_id: admin.userId,
      actor_email: admin.email,
      actor_role: admin.role,
      action: "admin_invitation_sent",
      resource_type: "sudf_admin_users",
      resource_id: invited.user.id,
      details: { invited_email: email, invited_role: role },
    });

    return NextResponse.json({
      success: true,
      email,
      role,
      redirectTo: new URL("/admin/accept-invitation", request.url).toString(),
      message: `Invitation sent to ${email}.`,
    });
  } catch {
    return NextResponse.json({ error: "The invitation could not be processed. Check the server configuration and try again." }, { status: 500 });
  }
}
