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
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Type</h3>
        <div className="space-y-1">
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => onTypeChange(t.value)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all",
                searchType === t.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" /> Date
        </h3>
        <div className="space-y-1">
          {dates.map((d) => (
            <button
              key={d.value}
              onClick={() => onDateChange(d.value)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                dateFilter === d.value
                  ? "bg-primary/10 text-primary font-medium"
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
