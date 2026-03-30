import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ResultCard from "@/components/ResultCard";
import AnswerPanel from "@/components/AnswerPanel";
import { searchDuckDuckGo, type SearchFilter, type DateFilter, type SearchResult } from "@/lib/searchApi";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Loader2, Quote, Compass, Sparkles } from "lucide-react";
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
    <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 pb-12 pt-6 sm:pt-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-3xl border border-border/70 bg-card p-3 sm:p-4">
          <SearchBar onSearch={handleSearch} defaultValue={query} variant="compact" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_260px]">
          <aside className="order-2 space-y-4 lg:order-1 lg:sticky lg:top-20 lg:h-fit">
            <div className="rounded-3xl border border-border/70 bg-card/95 p-4">
              <h3 className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Compass className="h-3.5 w-3.5" /> Режим поиска
              </h3>
              <FilterPanel
                searchType={searchType}
                dateFilter={dateFilter}
                onTypeChange={setSearchType}
                onDateChange={setDateFilter}
              />
            </div>
          </aside>

          <section className="order-1 min-w-0 space-y-4 lg:order-2">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Собираю ответ и медиа в интерфейсе…</span>
              </div>
            ) : results.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-muted-foreground">
                <p className="text-lg">Нет результатов для “{query}”.</p>
                <p className="mt-2 text-sm">Попробуйте уточнить запрос или сменить режим поиска.</p>
              </motion.div>
            ) : (
              <>
                <div className="rounded-3xl border border-border/70 bg-card/95 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <p className="text-muted-foreground">
                      Найдено <span className="font-semibold text-foreground">{results.length}</span> источников по запросу “{query}”.
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      <Sparkles className="h-3 w-3" /> Встроенный просмотр
                    </span>
                  </div>
                </div>

                <AnswerPanel query={query} results={results} />
                {results.map((r, i) => (
                  <ResultCard key={`${r.url}-${i}`} result={r} index={i} />
                ))}
              </>
            )}
          </section>

          <aside className="order-3 hidden space-y-4 lg:sticky lg:top-20 lg:block lg:h-fit">
            <div className="rounded-3xl border border-border/70 bg-card/95 p-4">
              <h3 className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Quote className="h-3.5 w-3.5" /> Источники
              </h3>
              <ul className="space-y-2">
                {sourceList.map((item, idx) => (
                  <li key={`${item.url}-${idx}`}>
                    <p className="line-clamp-2 break-words text-sm text-foreground/90">
                      [{idx + 1}] {item.title}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{item.source}</p>
                  </li>
                ))}
                {sourceList.length === 0 && <li className="text-sm text-muted-foreground">Источники появятся после поиска.</li>}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Results;
