"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Activity, BookOpen, CalendarDays, FileText, HandHeart, LayoutDashboard, LogOut, Mail, Menu, Newspaper, Settings, Users, X, ClipboardList, Wallet } from "lucide-react";
import { createClient } from "../../utils/supabase/client";
type SudfAdminContext = { userId: string; email: string; role: "super_admin" | "content_editor" | "admin_email" };

const links = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "content_editor"] },
  { label: "Programmes", href: "/admin/programmes", icon: Activity, roles: ["super_admin", "content_editor"] },
  { label: "Events", href: "/admin/events", icon: CalendarDays, roles: ["super_admin", "content_editor"] },
  { label: "SUDF in Action", href: "/admin/field-stories", icon: ClipboardList, roles: ["super_admin", "content_editor"] },
  { label: "News & Updates", href: "/admin/news", icon: Newspaper, roles: ["super_admin", "content_editor"] },
  { label: "Knowledge Centre", href: "/admin/education", icon: BookOpen, roles: ["super_admin", "content_editor"] },
  { label: "Gallery & Partners", href: "/admin/media", icon: FileText, roles: ["super_admin", "content_editor"] },
  { label: "Impact Metrics", href: "/admin/impact", icon: Activity, roles: ["super_admin", "content_editor"] },
  { label: "Contact Inbox", href: "/admin/contacts", icon: Mail, roles: ["super_admin", "admin_email"] },
  { label: "Support Enquiries", href: "/admin/support", icon: HandHeart, roles: ["super_admin", "admin_email"] },
  { label: "Donations", href: "/admin/donations", icon: Wallet, roles: ["super_admin", "admin_email"] },
  { label: "Volunteer Applications", href: "/admin/volunteers", icon: Users, roles: ["super_admin", "admin_email"] },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail, roles: ["super_admin"] },
  { label: "Administration", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
];

export default function AdminShell({ admin, children }: { admin: SudfAdminContext; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }
  const visibleLinks = links.filter((item) => item.roles.includes(admin.role));
  return (
    <div className="sudf-admin-app">
      <aside className={menuOpen ? "sudf-admin-sidebar is-open" : "sudf-admin-sidebar"}>
        <Link href="/admin" className="sudf-admin-brand" onClick={() => setMenuOpen(false)}><span>SUDF</span><small>ADMINISTRATION</small></Link>
        <div className="sudf-admin-nav-label">WORKSPACE</div>
        <nav aria-label="Administration navigation">
          {visibleLinks.map(({ label, href, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={pathname === href ? "active" : ""}><Icon size={18}/><span>{label}</span></Link>
          ))}
        </nav>
        <div className="sudf-admin-sidebar-bottom">
          <div className="sudf-admin-user"><span className="sudf-admin-avatar">{admin.email.slice(0,1).toUpperCase()}</span><span><strong>{admin.email}</strong><small>{admin.role === "super_admin" ? "Super Admin" : admin.role === "admin_email" ? "Founder & Operations" : "Content Editor"}</small></span></div>
          <button type="button" onClick={signOut}><LogOut size={17}/> Sign out</button>
        </div>
      </aside>
      {menuOpen && <button className="sudf-admin-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <div className="sudf-admin-main">
        <header className="sudf-admin-topbar"><button className="sudf-admin-menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X/> : <Menu/>}</button><div><span>SUDF / Administration</span><strong>{pathname === "/admin" ? "Dashboard overview" : pathname.split("/").filter(Boolean).at(-1)?.replaceAll("-", " ")}</strong></div><span className="sudf-admin-top-role">{admin.role === "super_admin" ? "Super Admin" : admin.role === "admin_email" ? "Founder & Operations" : "Content Editor"}</span></header>
        <main className="sudf-admin-content">{children}</main>
      </div>
    </div>
  );
}
