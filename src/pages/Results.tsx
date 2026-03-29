import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ResultCard from "@/components/ResultCard";
import AnswerPanel from "@/components/AnswerPanel";
import { searchDuckDuckGo, type SearchFilter, type DateFilter, type SearchResult } from "@/lib/searchApi";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Loader2, Quote } from "lucide-react";
import { motion } from "framer-motion";

const Results = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") || "";
  const [searchType, setSearchType] = useState<SearchFilter>("web");
  const [dateFilter, setDateFilter] = useState<DateFilter>("any");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToHistory } = useSearchHistory();

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    setLoading(true);
    addToHistory(query, searchType);

    searchDuckDuckGo(query, searchType, dateFilter).then((res) => {
      if (!cancelled) {
        setResults(res);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [query, searchType, dateFilter]);

  const handleSearch = (q: string) => {
    navigate(`/results?q=${encodeURIComponent(q)}`);
  };

  const sourceList = results.slice(0, 8);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background via-background to-muted/30 px-4 pb-12 pt-6 sm:pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-5">
          <SearchBar onSearch={handleSearch} defaultValue={query} variant="compact" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="min-w-0 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Synthesizing answer...</span>
              </div>
            ) : results.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-muted-foreground">
                <p className="text-lg">No results for “{query}”.</p>
                <p className="mt-2 text-sm">Try adding context or changing the search focus.</p>
              </motion.div>
            ) : (
              <>
                <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-2.5 text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{results.length}</span> sources for “{query}”.
                </div>
                <AnswerPanel query={query} results={results} />
                {results.map((r, i) => (
                  <ResultCard key={`${r.url}-${i}`} result={r} index={i} />
                ))}
              </>
            )}
          </section>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-2xl border border-border/80 bg-card/95 p-4">
              <FilterPanel
                searchType={searchType}
                dateFilter={dateFilter}
                onTypeChange={setSearchType}
                onDateChange={setDateFilter}
              />
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/95 p-4">
              <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Quote className="h-3.5 w-3.5" /> Sources
              </h3>
              <ul className="space-y-2">
                {sourceList.map((item, idx) => (
                  <li key={`${item.url}-${idx}`}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 text-sm text-foreground/90 transition-colors hover:text-primary"
                    >
                      [{idx + 1}] {item.title}
                    </a>
                    <p className="truncate text-xs text-muted-foreground">{item.source}</p>
                  </li>
                ))}
                {sourceList.length === 0 && <li className="text-sm text-muted-foreground">Sources will appear here.</li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Results;
