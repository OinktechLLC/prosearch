import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ResultCard from "@/components/ResultCard";
import AnswerPanel from "@/components/AnswerPanel";
import { searchDuckDuckGo, type SearchFilter, type DateFilter, type SearchResult } from "@/lib/searchApi";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { Loader2 } from "lucide-react";
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

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} defaultValue={query} variant="compact" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          <section className="min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Готовлю ответ и источники…</span>
              </div>
            ) : results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <p className="text-lg">По запросу "{query}" ничего не найдено</p>
                <p className="text-sm mt-2">Попробуйте уточнить формулировку вопроса.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Найдено {results.length} материалов по запросу <span className="font-medium text-foreground">"{query}"</span>
                </p>
                <AnswerPanel query={query} results={results} />
                {results.map((r, i) => (
                  <ResultCard key={`${r.url}-${i}`} result={r} index={i} />
                ))}
              </div>
            )}
          </section>

          <aside className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
              <FilterPanel
                searchType={searchType}
                dateFilter={dateFilter}
                onTypeChange={setSearchType}
                onDateChange={setDateFilter}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Results;
