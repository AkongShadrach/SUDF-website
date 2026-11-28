import { createAdminServiceClient, requireAdmin } from "../../../utils/supabase/admin";
import DonationsManager, { type DonationRecord } from "./DonationsManager";

type PaymentRow = { id: string; donation_id: string; provider: string; payment_method: string | null; provider_reference: string | null; amount: number; currency: string; status: string; verified_at: string | null; created_at: string };\n\nexport const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DonationsPage() {
  await requireAdmin(["super_admin"]);
  const supabase = createAdminServiceClient();
  const { data: donations, error } = await supabase
    .from("donations")
    .select("id,donor_id,amount,currency,purpose,message,source,status,created_at,updated_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const donorIds = [...new Set((donations ?? []).map((item) => item.donor_id))];
  const donationIds = (donations ?? []).map((item) => item.id);
  const donorResult = donorIds.length
    ? await supabase.from("donors").select("id,full_name,email,phone,organisation").in("id", donorIds)
    : null;
  const paymentResult = donationIds.length
    ? await supabase.from("donation_payments").select("id,donation_id,provider,payment_method,provider_reference,amount,currency,status,verified_at,created_at").in("donation_id", donationIds).order("created_at", { ascending: false })
    : null;

  const donors = new Map<string, { id: string; full_name: string; email: string; phone: string | null; organisation: string | null }>();
  for (const donor of donorResult?.data ?? []) donors.set(donor.id, donor);
  const latestPayments = new Map<string, PaymentRow>();
  for (const payment of paymentResult?.data ?? []) {
    if (!latestPayments.has(payment.donation_id)) latestPayments.set(payment.donation_id, payment);
  }

  const records: DonationRecord[] = (donations ?? []).map((item) => ({
    ...item,
    donor: donors.get(item.donor_id) ?? null,
    payment: latestPayments.get(item.id) ?? null,
  }));

  return (
    <DonationsManager
      initialDonations={records}
      loadError={error ? "Donation records could not be loaded. Please refresh and check the server database connection." : null}
      relatedError={donorResult?.error || paymentResult?.error ? "Some donor or payment details could not be loaded. Please check the database permissions and server logs." : null}
    />
  );
}
