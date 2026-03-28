import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useNavigate } from "react-router-dom";
import { Clock, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const RecentSearches = () => {
  const { history, clearHistory, removeItem } = useSearchHistory();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] container py-10 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Recent Searches</h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>No recent searches yet</p>
          <p className="text-sm mt-1">Your search history will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.query + item.timestamp}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="group flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/20 transition-all cursor-pointer"
                onClick={() => navigate(`/results?q=${encodeURIComponent(item.query)}`)}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{item.query}</span>
                  {item.filter && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      {item.filter}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.query);
                    }}
                    className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-accent transition-all"
                  >
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default RecentSearches;
