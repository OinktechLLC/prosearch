import { type SearchResult } from "@/lib/searchApi";
import { Sparkles, Link2 } from "lucide-react";

interface AnswerPanelProps {
  query: string;
  results: SearchResult[];
}

const AnswerPanel = ({ query, results }: AnswerPanelProps) => {
  const topResults = results.filter((r) => r.snippet).slice(0, 4);

  if (topResults.length < 2) {
    return null;
  }

  const isVideoMode = results[0]?.type === "videos";

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">{isVideoMode ? "AI Video Summary" : "AI Summary"}</h2>
      </div>

      <p className="text-sm leading-6 text-foreground/90">
        {isVideoMode ? (
          <>
            По запросу <span className="font-medium">«{query}»</span> найдено несколько релевантных видео.
            Ниже вы можете открыть материалы по источникам и сравнить точки зрения.
          </>
        ) : (
          <>
            Короткий вывод по запросу <span className="font-medium">«{query}»</span>: 
            {topResults.map((r, idx) => (
              <span key={`${r.url}-${idx}`}>
                {idx === 0 ? " " : " "}
                {r.snippet.replace(/\s+/g, " ").slice(0, 150)}
                {r.snippet.length > 150 ? "…" : ""}
                {` [${idx + 1}]`}
                {idx === topResults.length - 1 ? "." : ";"}
              </span>
            ))}
          </>
        )}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {topResults.map((r, idx) => (
          <a
            key={`${r.source}-${idx}`}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
          >
            <Link2 className="w-3 h-3" />
            [{idx + 1}] {r.source}
          </a>
        ))}
      </div>
    </section>
  );
};

export default AnswerPanel;
