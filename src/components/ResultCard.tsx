import { type SearchResult } from "@/lib/searchApi";
import { ExternalLink, Play, Video, Eye, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import WebPreview from "./WebPreview";

const ResultCard = ({ result, index }: { result: SearchResult; index: number }) => {
  const [showEmbedded, setShowEmbedded] = useState((result.type === "videos" && index < 2 && Boolean(result.videoUrl)) || result.type === "images");
  const isVideo = result.type === "videos";
  const isImage = result.type === "images";
  const canEmbedVideo = isVideo && Boolean(result.videoUrl);
  const canEmbedImage = isImage && Boolean(result.thumbnail);
  const canEmbedWebFrame = !isVideo && !isImage;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="group rounded-3xl border border-border/70 bg-card/95 p-4 transition-colors hover:border-primary/35"
    >
      {showEmbedded && canEmbedVideo && result.videoUrl && (
        <div className="mb-3 aspect-video overflow-hidden rounded-2xl bg-muted">
          <iframe
            src={result.videoUrl}
            title={result.title}
            className="h-full w-full"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {showEmbedded && canEmbedImage && result.thumbnail && (
        <div className="mb-3 overflow-hidden rounded-2xl border border-border/70 bg-muted/40">
          <img src={result.thumbnail} alt={result.title} className="max-h-[28rem] w-full object-cover" loading="lazy" />
        </div>
      )}

      {showEmbedded && canEmbedWebFrame && <WebPreview url={result.url} title={result.title} />}

      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="truncate text-muted-foreground">{result.source}</span>
        {isVideo && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            <Video className="h-3 w-3" />
            Видео
          </span>
        )}
        {isImage && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-primary">
            <ImageIcon className="h-3 w-3" />
            Фото
          </span>
        )}
      </div>

      <h3 className="text-base font-medium text-foreground">{result.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm leading-6 text-muted-foreground">{result.snippet}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setShowEmbedded((prev) => !prev)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
            showEmbedded
              ? "border-primary/45 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:border-primary/35 hover:text-foreground"
          )}
        >
          {isVideo ? <Play className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {showEmbedded ? "Скрыть в ProSearch" : "Смотреть в ProSearch"}
        </button>

        <a
          href={result.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground"
        >
          <ExternalLink className="h-3 w-3" />
          Оригинал
        </a>

        {canEmbedWebFrame && (
          <Link
            to={`/article?url=${encodeURIComponent(result.url)}&title=${encodeURIComponent(result.title)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/35 hover:text-foreground"
          >
            Читать статью
          </Link>
        )}
      </div>
    </motion.article>
  );
};

export default ResultCard;
