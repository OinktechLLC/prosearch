import { useState, useCallback, useEffect } from "react";
import { Search, Mic, MicOff, X, ArrowUp } from "lucide-react";
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

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  const handleVoiceResult = useCallback(
    (text: string) => {
      setQuery(text);
      onSearch(text);
    },
    [onSearch]
  );

  const { isListening, startListening, stopListening, supported } = useVoiceSearch(handleVoiceResult);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const isHero = variant === "hero";

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl">
      <motion.div
        className={cn(
          "relative flex items-center rounded-[30px] border border-border/70 bg-card/95 pr-2 shadow-[0_10px_40px_-24px_hsl(var(--foreground)/0.55)]",
          isHero ? "min-h-[72px] pl-5" : "min-h-[56px] pl-4",
          isListening && "border-primary/60 ring-2 ring-primary/20"
        )}
        whileFocus={{ scale: 1.005 }}
      >
        <Search className={cn("shrink-0 text-muted-foreground", isHero ? "h-5 w-5" : "h-4 w-4")} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Спросите что угодно"
          autoFocus={autoFocus}
          className={cn(
            "ml-3 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground/90",
            isHero ? "text-base" : "text-sm"
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
              className="mr-1 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {supported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={cn(
              "mr-1 rounded-full p-2 transition-colors",
              isListening ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
            aria-label="Голосовой поиск"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}

        <button
          type="submit"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-[1.03]"
          aria-label="Отправить запрос"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </motion.div>
    </form>
  );
};

export default SearchBar;
