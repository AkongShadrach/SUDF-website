import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedSupportTypes = new Set([
  "Donation",
  "Programme sponsorship",
  "In-kind contribution",
  "Volunteering",
  "Partnership",
  "Other support",
]);
const allowedSupportAreas = new Set([
  "General support",
  "Community diabetes screening",
  "Care and patient support",
  "Health education and awareness",
  "Medical outreach",
  "Other",
]);

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Quietly accept bot submissions that fill the hidden honeypot.
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
    }
    recent.push(now);
    requestLog.set(ip, recent);

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const organisation = clean(body.organisation, 160);
    const supportType = clean(body.supportType, 60);
    const supportArea = clean(body.supportArea, 80);
    const indicativeAmount = clean(body.amount, 80);
    const message = clean(body.message, 3000);

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide a valid name and email address." }, { status: 400 });
    }
    if (!allowedSupportTypes.has(supportType) || !allowedSupportAreas.has(supportArea)) {
      return NextResponse.json({ error: "Please choose a valid support type and area." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "The enquiry service is not configured yet. Please contact the Foundation through its official channels." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from("support_enquiries").insert({
      name,
      email,
      phone: phone || null,
      organisation: organisation || null,
      support_type: supportType,
      support_area: supportArea,
      indicative_amount: indicativeAmount || null,
      message: message || null,
    });

    if (error) {
      console.error("SUDF support enquiry insert failed:", error.message);
      return NextResponse.json({ error: "We could not save your enquiry right now. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
}
