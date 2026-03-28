export type SearchFilter = "web" | "images" | "news" | "videos";
export type DateFilter = "any" | "day" | "week" | "month";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  type: SearchFilter;
  thumbnail?: string;
  videoUrl?: string;
  date?: string;
}

interface RutubeApiItem {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  embed_url?: string;
  video_url?: string;
  created_ts?: string;
}

const PROXY = "https://api.allorigins.win/raw?url=";

export async function searchDuckDuckGo(
  query: string,
  filter: SearchFilter = "web",
  dateFilter: DateFilter = "any"
): Promise<SearchResult[]> {
  try {
    // Для видео используем отдельный агрегатор источников в стиле Perplexity.
    if (filter === "videos") {
      return await searchVideos(query);
    }

    const params = new URLSearchParams({ q: query, format: "json", no_redirect: "1" });
    if (dateFilter !== "any") {
      const df = dateFilter === "day" ? "d" : dateFilter === "week" ? "w" : "m";
      params.set("df", df);
    }

    const url = `${PROXY}${encodeURIComponent(`https://api.duckduckgo.com/?${params.toString()}`)}`;
    const res = await fetch(url);
    const data = await res.json();

    const results: SearchResult[] = [];

    if (data.Abstract) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || "",
        snippet: data.Abstract,
        source: data.AbstractSource || "DuckDuckGo",
        type: "web",
      });
    }

    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, 12)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(" - ")[0] || topic.Text.substring(0, 80),
            url: topic.FirstURL,
            snippet: topic.Text,
            source: new URL(topic.FirstURL).hostname.replace("www.", ""),
            type: "web",
            thumbnail: topic.Icon?.URL || undefined,
          });
        }

        if (topic.Topics) {
          for (const sub of topic.Topics.slice(0, 4)) {
            if (sub.Text && sub.FirstURL) {
              results.push({
                title: sub.Text.split(" - ")[0] || sub.Text.substring(0, 80),
                url: sub.FirstURL,
                snippet: sub.Text,
                source: new URL(sub.FirstURL).hostname.replace("www.", ""),
                type: "web",
                thumbnail: sub.Icon?.URL || undefined,
              });
            }
          }
        }
      }
    }

    if (results.length === 0) {
      return await scrapeResults(query, filter, dateFilter);
    }

    if (filter === "images") {
      return results.filter((r) => r.thumbnail).map((r) => ({ ...r, type: "images" as SearchFilter }));
    }

    return results;
  } catch (e) {
    console.error("Search error:", e);
    return await scrapeResults(query, filter, dateFilter);
  }
}

async function scrapeResults(
  query: string,
  filter: SearchFilter,
  dateFilter: DateFilter
): Promise<SearchResult[]> {
  try {
    const typeParam = filter === "images" ? "&iax=images&ia=images" : filter === "news" ? "&iar=news&ia=news" : "";
    const dfParam = dateFilter !== "any" ? `&df=${dateFilter === "day" ? "d" : dateFilter === "week" ? "w" : "m"}` : "";
    const url = `${PROXY}${encodeURIComponent(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}${typeParam}${dfParam}`)}`;

    const res = await fetch(url);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items = doc.querySelectorAll(".result");

    const results: SearchResult[] = [];
    items.forEach((item, i) => {
      if (i >= 15) return;
      const titleEl = item.querySelector(".result__title a, .result__a");
      const snippetEl = item.querySelector(".result__snippet");
      const urlEl = item.querySelector(".result__url");

      const href = titleEl?.getAttribute("href") || "";
      let finalUrl = href;
      if (href.includes("uddg=")) {
        try {
          finalUrl = decodeURIComponent(href.split("uddg=")[1]?.split("&")[0] || href);
        } catch {
          finalUrl = href;
        }
      }

      if (titleEl?.textContent && finalUrl) {
        results.push({
          title: titleEl.textContent.trim(),
          url: finalUrl,
          snippet: snippetEl?.textContent?.trim() || "",
          source: urlEl?.textContent?.trim() || new URL(finalUrl).hostname.replace("www.", ""),
          type: filter,
        });
      }
    });

    return results;
  } catch (e) {
    console.error("Scrape error:", e);
    return generateFallbackResults(query, filter);
  }
}

async function searchVideos(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  // Базовые источники (всегда доступны пользователю).
  results.push(
    {
      title: `${query} — YouTube`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      snippet: `Видео по запросу «${query}» на YouTube.`,
      source: "YouTube",
      type: "videos",
    },
    {
      title: `${query} — VK Видео`,
      url: `https://vkvideo.ru/search?query=${encodeURIComponent(query)}`,
      snippet: `Видео по запросу «${query}» в VK Видео.`,
      source: "VK Видео",
      type: "videos",
    }
  );

  try {
    const rutubeApi = `${PROXY}${encodeURIComponent(`https://rutube.ru/api/search/video/?query=${encodeURIComponent(query)}&page=1`)}`;
    const rutubeRes = await fetch(rutubeApi);

    if (rutubeRes.ok) {
      const rutubeData = (await rutubeRes.json()) as { results?: RutubeApiItem[] };
      const top = rutubeData.results?.slice(0, 8) || [];

      for (const item of top) {
        if (!item.title) continue;

        const watchUrl = item.video_url || item.embed_url || `https://rutube.ru/search/?query=${encodeURIComponent(query)}`;
        results.push({
          title: item.title,
          url: watchUrl,
          snippet: item.description || `Видео на RuTube по запросу «${query}».`,
          source: "RuTube",
          type: "videos",
          thumbnail: item.thumbnail_url,
          videoUrl: item.embed_url,
          date: item.created_ts,
        });
      }
    }
  } catch (error) {
    console.warn("RuTube API unavailable:", error);
  }

  const hasRutubeItem = results.some((item) => item.source === "RuTube");
  if (!hasRutubeItem) {
    results.push({
      title: `${query} — RuTube`,
      url: `https://rutube.ru/search/?query=${encodeURIComponent(query)}`,
      snippet: `Открыть поиск «${query}» в RuTube.`,
      source: "RuTube",
      type: "videos",
    });
  }

  // Убираем дубли по URL, сохраняя порядок (важно для UX карточек).
  const uniqueByUrl = new Map<string, SearchResult>();
  for (const item of results) {
    if (!uniqueByUrl.has(item.url)) {
      uniqueByUrl.set(item.url, item);
    }
  }

  return Array.from(uniqueByUrl.values());
}

function generateFallbackResults(query: string, filter: SearchFilter): SearchResult[] {
  const sources = [
    { name: "Wikipedia", domain: "wikipedia.org" },
    { name: "Stack Overflow", domain: "stackoverflow.com" },
    { name: "GitHub", domain: "github.com" },
    { name: "MDN", domain: "developer.mozilla.org" },
    { name: "Reddit", domain: "reddit.com" },
  ];

  return sources.map((s) => ({
    title: `${query} — ${s.name}`,
    url: `https://${s.domain}/search?q=${encodeURIComponent(query)}`,
    snippet: `Результаты поиска "${query}" на ${s.name}. Нажмите чтобы перейти на сайт.`,
    source: s.domain,
    type: filter,
  }));
}
