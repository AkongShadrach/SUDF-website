import { createAdminServiceClient } from "../../../utils/supabase/admin";
import ContactInbox from "./ContactInbox";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactInboxPage() {
  const supabase = createAdminServiceClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id,name,email,message,status,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <ContactInbox
      initialMessages={data ?? []}
      loadError={error ? "Messages could not be loaded. Please refresh or check the database connection." : null}
    />
  );
}
