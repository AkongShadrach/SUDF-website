import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const safeNext = next === "/admin/accept-invitation" ? next : "/admin/accept-invitation";
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(safeNext, request.url));
    }
  }

  return NextResponse.redirect(new URL("/admin/accept-invitation?error=invalid_invitation", request.url));
}
