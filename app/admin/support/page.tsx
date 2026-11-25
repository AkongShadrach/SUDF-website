import { createAdminServiceClient } from "../../../utils/supabase/admin";
import SupportEnquiries from "./SupportEnquiries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SupportEnquiriesPage() {
  const supabase = createAdminServiceClient();
  const { data, error } = await supabase
    .from("support_enquiries")
    .select("id,name,email,phone,organisation,support_type,support_area,indicative_amount,message,status,contact_consent,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return <SupportEnquiries initialEnquiries={data ?? []} loadError={error ? "Support enquiries could not be loaded. Please refresh or check the database connection." : null} />;
}
