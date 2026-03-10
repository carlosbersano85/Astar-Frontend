import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string; // "HH:mm" 24h format
  onChange: (value: string) => void;
  className?: string;
}

const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

function to12h(time24: string) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return { hour: String(h12).padStart(2, "0"), minute: String(m).padStart(2, "0"), period };
}

function to24h(hour: string, minute: string, period: string) {
  let h = parseInt(hour);
  if (period === "AM" && h === 12) h = 0;
  else if (period === "PM" && h !== 12) h += 12;
  return `${String(h).padStart(2, "0")}:${minute}`;
}

const ScrollColumn = ({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const idx = items.indexOf(selected);
      if (idx >= 0) {
        const el = ref.current.children[idx] as HTMLElement;
        el?.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [selected, items]);

  return (
    <div ref={ref} className="h-48 overflow-y-auto scrollbar-thin flex flex-col snap-y snap-mandatory">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={cn(
            "snap-center px-4 py-2.5 text-sm font-medium transition-all shrink-0 rounded-lg mx-1",
            selected === item
              ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

const TimePicker = ({ value, onChange, className }: TimePickerProps) => {
  const parsed = to12h(value);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);
  const [period, setPeriod] = useState(parsed.period);

  const handleChange = (h: string, m: string, p: string) => {
    onChange(to24h(h, m, p));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-background/50 border border-border/50 text-sm text-left flex items-center justify-between transition-colors focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-foreground",
            className
          )}
        >
          {`${hour}:${minute} ${period}`}
          <Clock className="w-4 h-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-border/50 bg-card/95 backdrop-blur-xl shadow-[0_8px_32px_hsl(var(--primary)/0.1)] rounded-xl overflow-hidden pointer-events-auto"
        align="start"
      >
        <div className="flex divide-x divide-border/30">
          <ScrollColumn
            items={hours12}
            selected={hour}
            onSelect={(v) => { setHour(v); handleChange(v, minute, period); }}
          />
          <ScrollColumn
            items={minutes}
            selected={minute}
            onSelect={(v) => { setMinute(v); handleChange(hour, v, period); }}
          />
          <div className="flex flex-col justify-center gap-1 p-2">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                onClick={() => { setPeriod(p); handleChange(hour, minute, p); }}
                className={cn(
                  "px-3 py-2 text-xs font-semibold rounded-lg transition-all",
                  period === p
                    ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.3)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimePicker;
