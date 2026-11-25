import Link from "next/link";
import { Activity, CalendarDays, FileText, HandHeart, Mail, Newspaper, Users } from "lucide-react";
import { getAdminContext, createAdminServiceClient } from "../../utils/supabase/admin";

export const dynamic = "force-dynamic";

async function countRows(table: string) {
  const client = createAdminServiceClient();
  const { count, error } = await client.from(table).select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const admin = await getAdminContext();
  if (!admin) return null;
  const [programmes, events, news, impact] = await Promise.all([
    countRows("programs"), countRows("events"), countRows("news"), countRows("impact_metrics"),
  ]);
  const privateCounts = admin.role === "super_admin"
    ? await Promise.all([countRows("contact_messages"), countRows("support_enquiries"), countRows("volunteer_applications")])
    : null;
  const cards = [
    { label: "Programmes", value: programmes, icon: Activity, href: "/admin/programmes" },
    { label: "Events", value: events, icon: CalendarDays, href: "/admin/events" },
    { label: "News articles", value: news, icon: Newspaper, href: "/admin/news" },
    { label: "Impact metrics", value: impact, icon: FileText, href: "/admin/impact" },
    ...(privateCounts ? [
      { label: "Contact messages", value: privateCounts[0], icon: Mail, href: "/admin/contacts" },
      { label: "Support enquiries", value: privateCounts[1], icon: HandHeart, href: "/admin/support" },
      { label: "Volunteer applications", value: privateCounts[2], icon: Users, href: "/admin/volunteers" },
    ] : []),
  ];
  return (
    <div className="sudf-admin-dashboard">
      <div className="sudf-admin-page-heading"><div><p className="sudf-admin-eyebrow">FOUNDATION WORKSPACE</p><h1>Good to see you.</h1><p>Here is an overview of the SUDF website and its administration workspace.</p></div><span className="sudf-admin-date">Live database overview</span></div>
      <section className="sudf-admin-stat-grid">
        {cards.map(({ label, value, icon: Icon, href }) => <Link href={href} key={label} className="sudf-admin-stat-card"><span className="sudf-admin-stat-icon"><Icon size={20}/></span><span className="sudf-admin-stat-label">{label}</span><strong>{value === null ? "—" : value}</strong><small>Records in database <span>→</span></small></Link>)}
      </section>
      <section className="sudf-admin-lower-grid">
        <div className="sudf-admin-panel"><p className="sudf-admin-eyebrow">QUICK ACCESS</p><h2>Manage the website</h2><div className="sudf-admin-quick-links"><Link href="/admin/news"><Newspaper/>Publish news and updates</Link><Link href="/admin/events"><CalendarDays/>Manage Foundation events</Link><Link href="/admin/programmes"><Activity/>Review programmes</Link><Link href="/admin/impact"><FileText/>Update impact figures</Link></div></div>
        <div className="sudf-admin-panel sudf-admin-welcome"><span className="sudf-admin-welcome-mark">SUDF</span><p className="sudf-admin-eyebrow">AWARENESS · PREVENTION · EDUCATION · SUPPORT</p><h2>One workspace. One shared purpose.</h2><p>Keep Foundation information accurate, current and responsibly managed.</p></div>
      </section>
      <p className="sudf-admin-notice">Content sections are connected to the live Supabase database. New records, edits and publishing changes are saved from this workspace.</p>
    </div>
  );
}
