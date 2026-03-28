import { type SearchResult } from "@/lib/searchApi";
import { Sparkles } from "lucide-react";

interface AnswerPanelProps {
  query: string;
  results: SearchResult[];
}

const AnswerPanel = ({ query, results }: AnswerPanelProps) => {
  const topResults = results.filter((r) => r.snippet).slice(0, 4);

  if (topResults.length < 2) {
    return null;
  }

  return (
    <section className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold">AI Answer</h2>
      </div>

      <p className="text-sm leading-6 text-foreground/90">
        По запросу <span className="font-medium">«{query}»</span> чаще всего встречаются следующие факты:
        {topResults.map((r, idx) => (
          <span key={`${r.url}-${idx}`}>
            {" "}
            {idx + 1}) {r.snippet.replace(/\s+/g, " ").slice(0, 160)}
            {r.snippet.length > 160 ? "…" : ""}
            {` [${idx + 1}]`}
            {idx === topResults.length - 1 ? "." : ";"}
          </span>
        ))}
      </p>

      <div className="mt-3 text-xs text-muted-foreground">
        {topResults.map((r, idx) => (
          <a
            key={`${r.source}-${idx}`}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:text-foreground transition-colors"
          >
            [{idx + 1}] {r.source} — {r.title}
          </a>
        ))}
      </div>
    </section>
  );
};

export default AnswerPanel;
