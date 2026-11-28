import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const allowedPurposes = new Set([
  "General support",
  "Community diabetes screening",
  "Care and patient support",
  "Health education and awareness",
  "Medical outreach",
  "Other",
]);

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

function clean(value: unknown, max: number): string {
  return typeof value === "string"
    ? value.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max)
    : "";
}

function validUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot: return a generic success without persisting bot submissions.
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many attempts. Please try again shortly." }, { status: 429 });
    }
    recent.push(now);
    requestLog.set(ip, recent);

    const fullName = clean(body.fullName, 120);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 40);
    const organisation = clean(body.organisation, 160);
    const purpose = clean(body.purpose, 80) || "General support";
    const message = clean(body.message, 1000);
    const source = body.source === "quick_donate" ? "quick_donate" : body.source === "support_form" ? "support_form" : "";
    const amountText = typeof body.amount === "string" ? body.amount.trim().replace(/,/g, "") : String(body.amount ?? "");
    const amount = Number(amountText);
    const idempotencyKey = clean(body.idempotencyKey, 36);

    if (!fullName || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide your name and a valid email address." }, { status: 400 });
    }
    if (!source || !allowedPurposes.has(purpose)) {
      return NextResponse.json({ error: "Please choose a valid donation option." }, { status: 400 });
    }
    if (!/^\d{1,12}(\.\d{1,2})?$/.test(amountText) || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000) {
      return NextResponse.json({ error: "Enter a valid donation amount in Naira." }, { status: 400 });
    }
    if (idempotencyKey && !validUuid(idempotencyKey)) {
      return NextResponse.json({ error: "Invalid submission reference. Please refresh and try again." }, { status: 400 });
    }
    if (body.contactConsent !== true) {
      return NextResponse.json({ error: "Please confirm that SUDF may contact you about this donation." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Donation services are not configured yet. Please contact the Foundation." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: donor, error: donorError } = await supabase
      .from("donors")
      .upsert({
        full_name: fullName,
        email,
        phone: phone || null,
        organisation: organisation || null,
        contact_consent: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "email" })
      .select("id")
      .single();

    if (donorError || !donor) {
      console.error("SUDF donor upsert failed:", donorError?.message);
      return NextResponse.json({ error: "We could not save your donor details. Please try again." }, { status: 500 });
    }

    let donationQuery = supabase.from("donations").insert({
      donor_id: donor.id,
      amount: Number(amount.toFixed(2)),
      currency: "NGN",
      purpose,
      message: message || null,
      source,
      status: "pending",
      idempotency_key: idempotencyKey || null,
    }).select("id,status,amount,currency").single();

    // When the browser retries the same submission, return its original donation.
    if (idempotencyKey) {
      const { data: existing } = await supabase
        .from("donations")
        .select("id,status,amount,currency")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ ok: true, donation: existing, nextUrl: `/donate-support/payment/${existing.id}` });
      }
    }

    const { data: donation, error: donationError } = await donationQuery;
    if (donationError || !donation) {
      console.error("SUDF donation insert failed:", donationError?.message);
      return NextResponse.json({ error: "We could not create your donation record. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      donation,
      nextUrl: `/donate-support/payment/${donation.id}`,
    }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
}
