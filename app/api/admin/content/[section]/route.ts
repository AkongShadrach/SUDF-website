import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminServiceClient, getAdminContext } from "../../../../../utils/supabase/admin";

const definitions = {
  programmes: { table: "programs", fields: ["title", "slug", "summary", "description", "status"], required: ["title", "slug"] },
  events: { table: "events", fields: ["title", "slug", "description", "starts_at", "ends_at", "location", "registration_url", "status"], required: ["title", "slug"] },
  news: { table: "news", fields: ["title", "slug", "excerpt", "body", "status", "published_at"], required: ["title", "slug"] },
  impact: { table: "impact_metrics", fields: ["metric_name", "metric_value", "unit", "period_start", "period_end", "source_note", "verified"], required: ["metric_name"] },
} as const;

type Section = keyof typeof definitions;

async function getDefinition(params: Promise<{ section: string }>) {
  const { section } = await params;
  if (!Object.prototype.hasOwnProperty.call(definitions, section)) return null;
  return definitions[section as Section];
}

async function authorised() {
  const admin = await getAdminContext();
  if (!admin) return null;
  return admin;
}

function pickFields(input: Record<string, unknown>, allowed: readonly string[]) {
  const output: Record<string, unknown> = {};
  for (const field of allowed) {
    if (Object.prototype.hasOwnProperty.call(input, field)) output[field] = input[field];
  }
  return output;
}

function refreshContent(section: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/${section}`);
  if (section === "programmes") revalidatePath("/programmes", "layout");
  if (section === "events") revalidatePath("/events", "page");
  if (section === "news") revalidatePath("/", "page");
}

export async function POST(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const definition = await getDefinition(params);
  if (!definition) return NextResponse.json({ error: "Unknown content section." }, { status: 404 });

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  const values = pickFields(input, definition.fields);
  for (const field of definition.required) {
    if (typeof values[field] !== "string" || !(values[field] as string).trim()) {
      return NextResponse.json({ error: `${field.replaceAll("_", " ")} is required.` }, { status: 400 });
    }
  }
  if (definition.table === "news" && values.status === "published" && !values.published_at) {
    values.published_at = new Date().toISOString();
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from(definition.table).insert(values).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  refreshContent((await params).section);
  return NextResponse.json({ item: data }, { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const definition = await getDefinition(params);
  if (!definition) return NextResponse.json({ error: "Unknown content section." }, { status: 404 });

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (typeof input.id !== "string" || !input.id) return NextResponse.json({ error: "A record ID is required." }, { status: 400 });
  const values = pickFields(input, definition.fields);
  if (definition.table === "news" && values.status === "published" && !values.published_at) {
    values.published_at = new Date().toISOString();
  }

  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from(definition.table).update(values).eq("id", input.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  refreshContent((await params).section);
  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ section: string }> }) {
  const admin = await authorised();
  if (!admin) return NextResponse.json({ error: "Administrator access required." }, { status: 403 });
  const definition = await getDefinition(params);
  if (!definition) return NextResponse.json({ error: "Unknown content section." }, { status: 404 });

  let input: Record<string, unknown>;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (typeof input.id !== "string" || !input.id) return NextResponse.json({ error: "A record ID is required." }, { status: 400 });

  const supabase = createAdminServiceClient();
  const { error } = await supabase.from(definition.table).delete().eq("id", input.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  refreshContent((await params).section);
  return NextResponse.json({ success: true });
}
