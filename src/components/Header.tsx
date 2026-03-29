import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="group inline-flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
            <Search className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">PerSearch</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground">
            clone
          </span>
        </Link>

        <div className="flex items-center gap-1.5">
          {!isHome && (
            <Link
              to="/"
              className={cn(
                "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                "hover:border-primary/40 hover:text-foreground"
              )}
            >
              Новый поиск
            </Link>
          )}
          <button
            onClick={toggle}
            className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            aria-label="Сменить тему"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
