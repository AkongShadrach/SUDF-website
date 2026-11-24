import { NextResponse } from "next/server";
import { getAdminContext } from "../../../../utils/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getAdminContext();
    if (!admin) return NextResponse.json({ authorized: false }, { status: 403 });
    return NextResponse.json({ authorized: true, role: admin.role });
  } catch {
    return NextResponse.json({ authorized: false, error: "Administrator access is not configured." }, { status: 503 });
  }
}
