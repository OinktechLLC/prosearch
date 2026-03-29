import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

const suggestions = [
  "Best AI coding assistant in 2026",
  "Build a 7-day Japan itinerary with budget",
  "Explain quantum entanglement simply",
  "Top LLMs for multilingual search",
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-background via-background to-muted/40 px-4 pb-16 pt-14 sm:pt-20">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Answer engine</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Where knowledge begins</h1>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
            Максимально близкий интерфейс к Perplexity: крупный ввод, быстрые вопросы и ответы со ссылками на источники.
          </p>
        </motion.div>

        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <SearchBar onSearch={handleSearch} variant="hero" autoFocus />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.35 }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="rounded-2xl border border-border/80 bg-card/80 px-4 py-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/40 hover:bg-card"
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      </div>
    </main>
  );
};

export default Home;
