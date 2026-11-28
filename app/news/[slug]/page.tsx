import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type NewsArticle = {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  published_at: string | null;
};

export default async function NewsStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminServiceClient();
  const { data: article } = await supabase
    .from("news")
    .select("title,slug,excerpt,body,published_at,status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!article) notFound();

  const story = article as NewsArticle;

  return (
    <main>
      <SiteHeader />
      <article className="section sudf-news-story">
        <Link href="/events" className="event-no">← Back to News & Stories</Link>
        <p className="eyebrow">NEWS & UPDATES</p>
        <h1>{story.title}</h1>
        {story.published_at ? (
          <p className="event-no">
            {new Date(story.published_at).toLocaleDateString("en-NG", { dateStyle: "long" })}
          </p>
        ) : null}
        {story.excerpt ? <p className="lead">{story.excerpt}</p> : null}
        <div className="sudf-news-story-body" style={{ whiteSpace: "pre-wrap" }}>
          {story.body || story.excerpt || "This story has no additional details yet."}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
