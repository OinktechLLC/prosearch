import { useTheme } from "@/hooks/useTheme";
import { Link, useLocation } from "react-router-dom";
import { Sun, Moon, Search, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home", icon: Search },
  { to: "/recent", label: "Recent", icon: Clock },
  { to: "/about", label: "About", icon: Info },
];

const Header = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 glass-surface border-b border-border">
      <div className="container flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Search className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg gradient-text">Pro Search</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                location.pathname === item.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={toggle}
            className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
