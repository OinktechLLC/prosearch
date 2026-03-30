import { type SearchResult } from "@/lib/searchApi";
import { Sparkles, Link2 } from "lucide-react";

interface AnswerPanelProps {
  query: string;
  results: SearchResult[];
}

const AnswerPanel = ({ query, results }: AnswerPanelProps) => {
  const topResults = results.filter((r) => r.snippet).slice(0, 5);

  if (topResults.length < 2) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-border/80 bg-card/95 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold">Answer</h2>
      </div>

      <p className="break-words text-sm leading-7 text-foreground/95 sm:text-[15px]">
        По запросу <span className="font-semibold">“{query}”</span> собраны релевантные источники. Коротко: 
        {topResults.map((r, idx) => (
          <span key={`${r.url}-${idx}`}>
            {idx === 0 ? " " : " "}
            {r.snippet.replace(/\s+/g, " ").slice(0, 175)}
            {r.snippet.length > 175 ? "…" : ""}
            {` [${idx + 1}]`}
            {idx === topResults.length - 1 ? "." : ";"}
          </span>
        ))}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {topResults.map((r, idx) => (
          <a
            key={`${r.source}-${idx}`}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Link2 className="h-3 w-3" />
            <span className="truncate">[{idx + 1}] {r.source}</span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default AnswerPanel;
