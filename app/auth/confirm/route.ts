import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  // This endpoint is intentionally restricted to administrator invitations.
  // Never accept an arbitrary redirect destination from an email URL.
  const destination = new URL("/admin/accept-invitation", requestUrl.origin);
  const failure = new URL("/admin/accept-invitation", requestUrl.origin);
  failure.searchParams.set("error", "invalid_invitation");

  if (!tokenHash || type !== "invite") {
    return NextResponse.redirect(failure);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    if (error) {
      return NextResponse.redirect(failure);
    }

    // The SSR client stores the verified session in response cookies.
    return NextResponse.redirect(destination);
  } catch {
    return NextResponse.redirect(failure);
  }
}
