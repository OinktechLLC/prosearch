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

const isRussianUser = () => {
  const lang = navigator.language || "";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  return lang.startsWith("ru") || tz.includes("Moscow") || tz.includes("Europe/Moscow");
};

const PROXY = "https://api.allorigins.win/raw?url=";

export async function searchDuckDuckGo(
  query: string,
  filter: SearchFilter = "web",
  dateFilter: DateFilter = "any"
): Promise<SearchResult[]> {
  try {
    const isRu = isRussianUser();

    // For videos, handle differently
    if (filter === "videos") {
      return searchVideos(query, isRu);
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

    // Abstract
    if (data.Abstract) {
      results.push({
        title: data.Heading || query,
        url: data.AbstractURL || "",
        snippet: data.Abstract,
        source: data.AbstractSource || "DuckDuckGo",
        type: "web",
      });
    }

    // Related topics
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
        // Subtopics
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

    // If no results from instant answer, use HTML scraping fallback
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
        } catch { finalUrl = href; }
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

function searchVideos(query: string, isRu: boolean): SearchResult[] {
  // Generate video search results pointing to appropriate platforms
  const platforms = isRu
    ? [
        { name: "RuTube", base: "https://rutube.ru/search/?query=", embedBase: "https://rutube.ru/play/embed/" },
        { name: "VK Video", base: "https://vk.com/video?q=", embedBase: "" },
        { name: "Дзен", base: "https://dzen.ru/search?query=", embedBase: "" },
      ]
    : [
        { name: "YouTube", base: "https://www.youtube.com/results?search_query=", embedBase: "https://www.youtube.com/embed/" },
      ];

  return platforms.map((p) => ({
    title: `${query} — ${p.name}`,
    url: `${p.base}${encodeURIComponent(query)}`,
    snippet: `Смотрите видео "${query}" на ${p.name}`,
    source: p.name,
    type: "videos" as SearchFilter,
    videoUrl: p.embedBase ? `${p.embedBase}?search=${encodeURIComponent(query)}` : `${p.base}${encodeURIComponent(query)}`,
  }));
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
