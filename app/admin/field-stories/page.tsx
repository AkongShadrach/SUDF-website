import FieldStoriesManager from "./FieldStoriesManager";
import { createAdminServiceClient, requireAdmin } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FieldStoriesAdminPage() {
  await requireAdmin(["super_admin", "content_editor"]);
  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from("field_stories").select("*").order("activity_date", { ascending: false }).order("created_at", { ascending: false });
  return <FieldStoriesManager initialItems={data ?? []} loadError={error?.message ?? null} />;
}
