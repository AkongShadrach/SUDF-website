import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const requestLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().replace(/[\u0000-\u001F\u007F]/g, "").slice(0, max) : "";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (clean(body.website, 200)) return NextResponse.json({ ok: true });

    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((time) => now - time < WINDOW_MS);
    if (recent.length >= MAX_REQUESTS) {
      return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
    }
    recent.push(now);
    requestLog.set(ip, recent);

    const name = clean(body.name, 120);
    const email = clean(body.email, 254).toLowerCase();
    const message = clean(body.message, 3000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Please provide your name, a valid email address and a message." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "The contact service is not configured yet. Please try again later." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from("contact_messages").insert({ name, email, message });
    if (error) {
      console.error("SUDF contact message insert failed:", error.message);
      return NextResponse.json({ error: "We could not save your message right now. Please try again later." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
}
