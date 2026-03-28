import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ResultCard from "@/components/ResultCard";
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

    return () => { cancelled = true; };
  }, [query, searchType, dateFilter]);

  const handleSearch = (q: string) => {
    navigate(`/results?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="border-b border-border bg-card/50">
        <div className="container py-4">
          <SearchBar onSearch={handleSearch} defaultValue={query} variant="compact" />
        </div>
      </div>
      <div className="container py-6">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Searching...</span>
              </div>
            ) : results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
              >
                <p className="text-lg">No results found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords or filters</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} results for <span className="font-medium text-foreground">"{query}"</span>
                </p>
                {results.map((r, i) => (
                  <ResultCard key={`${r.url}-${i}`} result={r} index={i} />
                ))}
              </div>
            )}
          </div>
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 glass-surface rounded-xl p-4">
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
    </div>
  );
};

export default Results;
