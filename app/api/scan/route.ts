import { TRACKED_TOPICS, ESCALATION_WINDOW_HOURS } from "@/lib/config";
import { scrapeTopic, insertArticles, getExistingUrls } from "@/lib/scraper";
import { computeTopicStats } from "@/lib/escalation";
import { getSupabaseAdmin } from "@/lib/supabase";

export const maxDuration = 300;

async function getRecentArticles(topic: string) {
  const cutoff = new Date(
    Date.now() - ESCALATION_WINDOW_HOURS * 3600 * 1000
  ).toISOString();

  const { data } = await getSupabaseAdmin()
    .from("articles")
    .select("*")
    .eq("topic", topic)
    .gte("scraped_at", cutoff)
    .order("scraped_at", { ascending: false });

  return data || [];
}

export async function GET() {

  const seenUrls = await getExistingUrls();
  const results: Array<{
    topic: string;
    fetched: number;
    inserted: number;
    trend: string;
  }> = [];

  for (const topicConfig of TRACKED_TOPICS) {
    const articles = await scrapeTopic(topicConfig, seenUrls);
    const inserted = await insertArticles(articles);

    const recentArticles = await getRecentArticles(topicConfig.name);
    const stats = computeTopicStats(recentArticles);

    await getSupabaseAdmin().from("topic_snapshots").insert({
      topic: topicConfig.name,
      avg_compound: stats.avg_compound,
      article_count: stats.article_count,
      positive_pct: stats.positive_pct,
      negative_pct: stats.negative_pct,
      neutral_pct: stats.neutral_pct,
      slope: stats.slope,
      trend: stats.trend,
    });

    results.push({
      topic: topicConfig.name,
      fetched: articles.length,
      inserted,
      trend: stats.trend,
    });
  }

  return Response.json({
    success: true,
    scanned_at: new Date().toISOString(),
    results,
  });
}
