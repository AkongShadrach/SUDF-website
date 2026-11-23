import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedAreas = new Set([
  "Medical and clinical services",
  "Nursing and patient support",
  "Community health education",
  "Outreach and screening assistance",
  "Research and data support",
  "Communications and operations",
  "General community volunteering",
]);
const allowedAvailability = new Set(["Flexible", "Weekdays", "Weekends", "Occasional / event-based", "Remote support"]);
const requestLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 4;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) return NextResponse.json({ error: "Too many applications from this connection. Please try again later." }, { status: 429 });
    recent.push(now);
    requestLog.set(ip, recent);

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const state = clean(body.state, 80);
    const lga = clean(body.lga, 100);
    const volunteerArea = clean(body.volunteerArea, 80);
    const profession = clean(body.profession, 120);
    const specialisation = clean(body.specialisation, 160);
    const qualifications = clean(body.qualifications, 500);
    const registrationNumber = clean(body.registrationNumber, 120);
    const experience = clean(body.experience, 2000);
    const availability = clean(body.availability, 40);
    const motivation = clean(body.motivation, 2000);
    const consent = body.consent === true;

    if (!name || !phone || !state || !profession || !motivation || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please complete the required fields and provide a valid email address." }, { status: 400 });
    }
    if (!allowedAreas.has(volunteerArea) || !allowedAvailability.has(availability)) {
      return NextResponse.json({ error: "Please choose a valid volunteer area and availability." }, { status: 400 });
    }
    if (!consent) return NextResponse.json({ error: "Please provide consent for the Foundation to review and respond to this application." }, { status: 400 });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "The volunteer application service is not configured yet. Please try again later." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { error } = await supabase.from("volunteer_applications").insert({
      name, email, phone, state, lga: lga || null, volunteer_area: volunteerArea,
      profession, specialisation: specialisation || null, qualifications: qualifications || null,
      registration_number: registrationNumber || null, experience: experience || null,
      availability, motivation, contact_consent: consent,
    });
    if (error) {
      console.error("SUDF volunteer application insert failed:", error.message);
      return NextResponse.json({ error: "We could not save your application right now. Please try again later." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Please check your application details and try again." }, { status: 400 });
  }
}
