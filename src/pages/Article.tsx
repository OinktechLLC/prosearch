import { useMemo, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { buildJinaMirrorUrl } from "@/lib/searchApi";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

const Article = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const url = params.get("url") || "";
  const title = params.get("title") || "Статья";
  const mirrorUrl = useMemo(() => buildJinaMirrorUrl(url), [url]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!url) return;
    let ignore = false;

    setLoading(true);
    setError(false);

    fetch(mirrorUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        return res.text();
      })
      .then((raw) => {
        if (ignore) return;
        setContent(raw.replace(/\n{3,}/g, "\n\n").trim());
      })
      .catch(() => {
        if (!ignore) setError(true);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [mirrorUrl, url]);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-background px-4 pb-10 pt-6 sm:pt-8">
      <article className="mx-auto w-full max-w-3xl rounded-3xl border border-border/70 bg-card/95 p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Назад
          </button>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Оригинал
            </a>
          )}
        </div>

        <h1 className="mb-4 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>

        {loading && (
          <div className="flex items-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Загружаю статью…
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-muted-foreground">Не удалось загрузить текст. Откройте оригинальную страницу.</p>
        )}

        {!loading && !error && (
          <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-7 sm:text-base whitespace-pre-wrap">
            {content || "Контент не найден."}
          </div>
        )}
      </article>
    </main>
  );
};

export default Article;
