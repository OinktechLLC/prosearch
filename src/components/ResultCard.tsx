import { type SearchResult } from "@/lib/searchApi";
import { ExternalLink, Play, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

const ResultCard = ({ result, index }: { result: SearchResult; index: number }) => {
  const shouldAutoShowVideo = useMemo(
    () => result.type === "videos" && index < 2 && Boolean(result.videoUrl),
    [result.type, result.videoUrl, index]
  );
  const [showVideo, setShowVideo] = useState(shouldAutoShowVideo);
  const isVideo = result.type === "videos";
  const canEmbed = Boolean(result.videoUrl);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="group rounded-2xl border border-border/80 bg-card/90 p-4 transition-colors hover:border-primary/40"
    >
      {isVideo && showVideo && result.videoUrl && (
        <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-muted">
          <iframe
            src={result.videoUrl}
            title={result.title}
            className="h-full w-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
        <span className="truncate text-muted-foreground">{result.source}</span>
        {isVideo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            <Video className="h-3 w-3" />
            Video
          </span>
        )}
        {canEmbed && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary transition-colors hover:bg-primary/20"
          >
            <Play className="h-3 w-3" />
            {showVideo ? "Hide" : "Watch"}
          </button>
        )}
      </div>

      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-start gap-1 text-base font-medium text-foreground transition-colors hover:text-primary"
      >
        <span className="line-clamp-2">{result.title}</span>
        <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
      </a>

      <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">{result.snippet}</p>
    </motion.article>
  );
};

export default ResultCard;
