import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

const ALLOWED_DESTINATIONS = new Set([
  "/admin/accept-invitation",
  "/admin/reset-password",
]);

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requestedNext = requestUrl.searchParams.get("next") || "";
  const safeNext = ALLOWED_DESTINATIONS.has(requestedNext)
    ? requestedNext
    : "/admin/accept-invitation";
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(safeNext, request.url));
    }
  }

  const failurePath = safeNext === "/admin/reset-password"
    ? "/admin/forgot-password?error=invalid_reset_link"
    : "/admin/accept-invitation?error=invalid_invitation";
  return NextResponse.redirect(new URL(failurePath, request.url));
}
