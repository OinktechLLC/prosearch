import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";

const suggestions = [
  "Сравни лучшие AI-модели для кода",
  "Собери план поездки в Токио на 5 дней",
  "Объясни квантовую запутанность простыми словами",
  "Какие ноутбуки лучше для дизайнера в 2026?",
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-xs sm:text-sm tracking-wide uppercase text-primary font-semibold mb-3">AI Search</p>
          <h1 className="text-3xl sm:text-5xl font-semibold mb-3">Что вы хотите узнать?</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Интерфейс в стиле AI-поиска: короткий ответ, источники и результаты в одном потоке.
          </p>
        </motion.div>

        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.35 }}
        >
          <SearchBar onSearch={handleSearch} variant="hero" autoFocus />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.35 }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSearch(suggestion)}
              className="text-left rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
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
