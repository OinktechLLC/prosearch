import { useEffect, useMemo, useState } from "react";
import { buildJinaMirrorUrl } from "@/lib/searchApi";
import { Loader2, AlertTriangle } from "lucide-react";

interface WebPreviewProps {
  url: string;
  title: string;
}

const WebPreview = ({ url, title }: WebPreviewProps) => {
  const mirrorUrl = useMemo(() => buildJinaMirrorUrl(url), [url]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);

    fetch(mirrorUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Mirror fetch failed");
        return res.text();
      })
      .then((raw) => {
        if (ignore) return;
        const cleaned = raw
          .replace(/\n{3,}/g, "\n\n")
          .replace(/\[(\d+)\]/g, "")
          .trim();
        setText(cleaned);
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
  }, [mirrorUrl]);

  return (
    <div className="mb-3 overflow-hidden rounded-2xl border border-border/70 bg-muted/20 p-3 sm:p-4">
      <p className="mb-2 line-clamp-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Web preview</p>
      <h4 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">{title}</h4>

      {loading && (
        <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Загружаю текстовую версию страницы…
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4" /> Не удалось открыть предпросмотр. Нажмите «Оригинал» или «Статья».
        </div>
      )}

      {!loading && !error && (
        <p className="line-clamp-6 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
          {text.slice(0, 900) || "Пустой ответ от источника."}
        </p>
      )}
    </div>
  );
};

export default WebPreview;
