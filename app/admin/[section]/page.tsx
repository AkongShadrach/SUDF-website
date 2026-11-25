import { notFound } from "next/navigation";
import AdminContentManager from "../AdminContentManager";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";

const sections = {
  programmes: { table: "programs", title: "Programmes", description: "Create and maintain the Foundation's programmes.", order: "created_at" },
  events: { table: "events", title: "Events", description: "Publish upcoming events and maintain the Foundation's event history.", order: "starts_at" },
  news: { table: "news", title: "News & Updates", description: "Write, edit and publish Foundation news and updates.", order: "created_at" },
  impact: { table: "impact_metrics", title: "Impact Metrics", description: "Keep the Foundation's reported impact figures accurate and verified.", order: "created_at" },
} as const;

type Section = keyof typeof sections;

export default async function AdminContentPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in sections)) notFound();
  const key = section as Section;
  const config = sections[key];
  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from(config.table).select("*").order(config.order, { ascending: false });

  return (
    <AdminContentManager
      section={key}
      title={config.title}
      description={config.description}
      initialItems={data ?? []}
      loadError={error?.message ?? null}
    />
  );
}
