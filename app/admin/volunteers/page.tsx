import { createAdminServiceClient } from "../../../utils/supabase/admin";
import VolunteerApplications from "./VolunteerApplications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VolunteerApplicationsPage() {
  const supabase = createAdminServiceClient();
  const { data, error } = await supabase.from("volunteer_applications")
    .select("id,name,email,phone,state,lga,volunteer_area,profession,specialisation,qualifications,registration_number,experience,availability,motivation,contact_consent,status,internal_notes,created_at,updated_at")
    .order("created_at", { ascending: false }).limit(200);
  return <VolunteerApplications initialApplications={data ?? []} loadError={error ? "Volunteer applications could not be loaded. Please refresh or check the database connection." : null} />;
}
