import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "./server";

export type SudfAdminRole = "super_admin" | "content_editor" | "admin_email";
export type SudfAdminContext = { userId: string; email: string; role: SudfAdminRole };

export function createAdminServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("The server-side Supabase service role key is not configured.");
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function getAdminContext(): Promise<SudfAdminContext | null> {
  const sessionClient = await createClient();
  const { data: { user }, error } = await sessionClient.auth.getUser();
  if (error || !user) return null;

  const serviceClient = createAdminServiceClient();
  const { data, error: roleError } = await serviceClient
    .from("sudf_admin_users")
    .select("auth_user_id,email,role,is_active")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (roleError || !data || !data.is_active || !["super_admin", "content_editor", "admin_email"].includes(data.role)) return null;
  return { userId: user.id, email: data.email, role: data.role as SudfAdminRole };
}

export async function requireAdmin(allowedRoles?: SudfAdminRole[]) {
  const admin = await getAdminContext();
  if (!admin) redirect("/admin-login");
  if (allowedRoles && !allowedRoles.includes(admin.role)) redirect("/admin?access=restricted");
  return admin;
}
