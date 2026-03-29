import { type SearchFilter, type DateFilter } from "@/lib/searchApi";
import { Globe, Image, Newspaper, Video, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  searchType: SearchFilter;
  dateFilter: DateFilter;
  onTypeChange: (t: SearchFilter) => void;
  onDateChange: (d: DateFilter) => void;
}

const types: { value: SearchFilter; label: string; icon: typeof Globe }[] = [
  { value: "web", label: "Web", icon: Globe },
  { value: "images", label: "Images", icon: Image },
  { value: "news", label: "News", icon: Newspaper },
  { value: "videos", label: "Videos", icon: Video },
];

const dates: { value: DateFilter; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "day", label: "Past 24h" },
  { value: "week", label: "Past week" },
  { value: "month", label: "Past month" },
];

const FilterPanel = ({ searchType, dateFilter, onTypeChange, onDateChange }: FilterPanelProps) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Focus</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors",
                searchType === t.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" /> Time
        </h3>
        <div className="space-y-1">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => onDateChange(d.value)}
              className={cn(
                "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                dateFilter === d.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
