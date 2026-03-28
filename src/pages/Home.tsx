import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import { Sparkles, Zap, Shield } from "lucide-react";

const features = [
  { icon: Zap, title: "Fast Search", desc: "Instant results powered by DuckDuckGo" },
  { icon: Sparkles, title: "Voice Search", desc: "Speak to search hands-free" },
  { icon: Shield, title: "Private", desc: "No tracking, no ads, no profiling" },
];

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/results?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4">
          <span className="gradient-text">Pro Search</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Private, fast, and intelligent search at your fingertips.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <SearchBar onSearch={handleSearch} variant="hero" autoFocus />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {features.map((f) => (
          <div key={f.title} className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Home;
