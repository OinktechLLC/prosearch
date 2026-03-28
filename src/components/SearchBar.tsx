import { useState, useCallback } from "react";
import { Search, Mic, MicOff, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useVoiceSearch } from "@/hooks/useVoiceSearch";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  defaultValue?: string;
  variant?: "hero" | "compact";
  autoFocus?: boolean;
}

const SearchBar = ({ onSearch, defaultValue = "", variant = "hero", autoFocus }: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);

  const handleVoiceResult = useCallback((text: string) => {
    setQuery(text);
    onSearch(text);
  }, [onSearch]);

  const { isListening, startListening, stopListening, supported } = useVoiceSearch(handleVoiceResult);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <motion.div
        className={cn(
          "relative flex items-center rounded-2xl border border-border transition-all duration-300",
          "glass-surface",
          isHero ? "h-14 px-5 search-glow" : "h-11 px-4",
          isListening && "animate-pulse-glow border-primary"
        )}
        whileFocus={{ scale: isHero ? 1.02 : 1 }}
      >
        <Search className={cn("shrink-0 text-muted-foreground", isHero ? "w-5 h-5" : "w-4 h-4")} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          autoFocus={autoFocus}
          className={cn(
            "flex-1 bg-transparent border-none outline-none ml-3 text-foreground placeholder:text-muted-foreground",
            isHero ? "text-lg" : "text-sm"
          )}
        />
        <AnimatePresence>
          {query && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="p-1 mr-1 rounded-full hover:bg-accent text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
        {supported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "p-2 rounded-full transition-colors",
              isListening ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-accent"
            )}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        )}
      </motion.div>
    </form>
  );
};

export default SearchBar;
