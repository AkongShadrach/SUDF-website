import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, Landmark, ShieldCheck } from "lucide-react";
import { createAdminServiceClient } from "../../../../utils/supabase/admin";
import styles from "./PaymentPage.module.css";

export const dynamic = "force-dynamic";

export default async function DonationPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();

  let donation: { id: string; amount: number; currency: string; purpose: string; status: string } | null = null;
  try {
    const supabase = createAdminServiceClient();
    const { data } = await supabase
      .from("donations")
      .select("id,amount,currency,purpose,status")
      .eq("id", id)
      .maybeSingle();
    donation = data;
  } catch {
    donation = null;
  }
  if (!donation) notFound();

  const amount = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 2 }).format(Number(donation.amount));

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/donate-support" className={styles.back}><ArrowLeft size={16}/> Back to Support & Donate</Link>
        <div className={styles.brand}>SUDF <span>DONATION</span></div>
        <section className={styles.card}>
          <div className={styles.headingIcon}><CheckCircle2 size={26}/></div>
          <p className={styles.eyebrow}>DONATION RECORD CREATED</p>
          <h1>Your support makes a difference.</h1>
          <p className={styles.description}>Your donation details have been securely recorded. Choose an available payment method below when the Foundation activates its payment account.</p>
          <div className={styles.summary}>
            <span>Donation amount</span><strong>{amount}</strong>
            <span>Purpose</span><b>{donation.purpose}</b>
            <span>Reference</span><code>{donation.id.slice(0, 8).toUpperCase()}</code>
            <span>Current status</span><b className={styles.pending}><Clock3 size={14}/> {donation.status.replaceAll("_", " ")}</b>
          </div>
          <div className={styles.methods}>
            <div className={styles.method}>
              <CreditCard size={21}/>
              <div><strong>Pay online</strong><p>Secure card and supported online payment options will appear here after SUDF's payment gateway account is approved and connected.</p><span>Not yet activated</span></div>
            </div>
            <div className={styles.method}>
              <Landmark size={21}/>
              <div><strong>Bank transfer</strong><p>SUDF's verified bank details or a transaction-specific transfer account will be displayed here once confirmed.</p><span>Awaiting Foundation bank details</span></div>
            </div>
          </div>
          <div className={styles.notice}><ShieldCheck size={18}/><p><strong>No payment has been taken.</strong> This is a pending donation record, not a payment confirmation. Please do not transfer money to an account unless its details are published through SUDF's verified channels.</p></div>
          <Link href="/donate-support" className={styles.return}>Return to SUDF website</Link>
        </section>
        <p className={styles.footer}>Sylvester Ujong Diabetes Foundation · Awareness · Prevention · Education · Support</p>
      </div>
    </main>
  );
}
