import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

const suggestions = [
  "Сравни GPT, Copilot и Perplexity для разработки",
  "Сделай план поездки в Японию на 7 дней",
  "Объясни квантовую запутанность простыми словами",
  "Топ AI-инструментов для команд в 2026",
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">ProSearch Beta</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">Интерфейс в стиле Copilot / ChatGPT / Perplexity</h1>
          <p className="mx-auto mt-3 max-w-3xl text-pretty text-sm text-muted-foreground sm:text-base">
            Интерфейс в стиле современных AI-ассистентов: чат-подобная выдача, встроенные фото/видео и меньше лишних переходов на внешние сайты.
          </p>
        </motion.div>

        <motion.div
          className="mb-6 rounded-3xl border border-border/70 bg-card p-3 sm:p-4"
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
              className="rounded-2xl border border-border/80 bg-card px-4 py-3 text-left text-sm text-foreground/90 transition-colors hover:border-primary/40 hover:bg-muted/50"
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
