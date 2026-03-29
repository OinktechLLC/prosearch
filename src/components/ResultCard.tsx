import { type SearchResult } from "@/lib/searchApi";
import { ExternalLink, Play, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const ResultCard = ({ result, index }: { result: SearchResult; index: number }) => {
  const shouldAutoShowVideo = useMemo(() => result.type === "videos" && index < 2 && Boolean(result.videoUrl), [result.type, result.videoUrl, index]);
  const [showVideo, setShowVideo] = useState(shouldAutoShowVideo);
  const isVideo = result.type === "videos";
  const canEmbed = Boolean(result.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group rounded-xl border border-border bg-card p-4 card-shadow hover:border-primary/30 transition-all duration-200"
    >
      {isVideo && showVideo && result.videoUrl && (
        <div className="mb-3 rounded-lg overflow-hidden aspect-video bg-muted">
          <iframe
            src={result.videoUrl}
            title={result.title}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}
      <div className="flex items-start gap-3">
        {result.thumbnail && (
          <img
            src={result.thumbnail}
            alt=""
            className="w-16 h-16 rounded-lg object-cover shrink-0 bg-muted"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs text-muted-foreground truncate">{result.source}</span>
            {isVideo && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                <Video className="w-3 h-3" />
                Видео
              </span>
            )}
            {canEmbed && (
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-primary/20 transition-colors"
              >
                <Play className="w-3 h-3" />
                {showVideo ? "Скрыть" : "Смотреть"}
              </button>
            )}
          </div>
          <a
            href={result.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium hover:text-primary transition-colors line-clamp-2 flex items-start gap-1"
          >
            {result.title}
            <ExternalLink className="w-3 h-3 shrink-0 mt-1 opacity-0 group-hover:opacity-50 transition-opacity" />
          </a>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
