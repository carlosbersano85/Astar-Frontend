import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

export interface BirthPlaceSelection {
  label: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface OpenMeteoPlace {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
  admin1?: string;
}

interface Props {
  value: string;
  onInputChange: (value: string) => void;
  onSelect: (place: BirthPlaceSelection) => void;
}

const placeLabel = (place: OpenMeteoPlace) =>
  [place.name, place.admin1, place.country].filter(Boolean).join(", ");

export default function BirthPlaceSearch({ value, onInputChange, onSelect }: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<OpenMeteoPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const selectedLabel = useRef<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const currentRequest = ++requestId.current;
    const normalized = query.trim();
    setResults([]);
    setError(false);
    if (normalized.length < 3 || query === selectedLabel.current) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          name: normalized,
          count: "7",
          language: "es",
          format: "json",
        });
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("No se pudo buscar la ciudad");
        const body = (await response.json()) as { results?: OpenMeteoPlace[] };
        if (currentRequest === requestId.current) {
          setResults(body.results ?? []);
          setOpen(true);
        }
      } catch {
        if (currentRequest === requestId.current && !controller.signal.aborted) {
          setResults([]);
          setError(true);
        }
      } finally {
        if (currentRequest === requestId.current) setLoading(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
      ++requestId.current;
    };
  }, [query]);

  return (
    <div className="relative">
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50 z-10" />
      <input
        type="text"
        value={query}
        onChange={(event) => {
          selectedLabel.current = null;
          setQuery(event.target.value);
          onInputChange(event.target.value);
          setOpen(true);
        }}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        placeholder="Busca tu ciudad..."
        required
        autoComplete="off"
        className="w-full pl-11 pr-11 py-3 rounded-xl bg-background/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
      />
      {loading && (
        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
      )}
      {open && query.trim().length >= 3 && !loading && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-2xl backdrop-blur-xl">
          {results.length > 0 ? (
            results.map((place) => (
              <button
                key={place.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const label = placeLabel(place);
                  selectedLabel.current = label;
                  setQuery(label);
                  setOpen(false);
                  onSelect({
                    label,
                    latitude: place.latitude,
                    longitude: place.longitude,
                    timezone: place.timezone,
                  });
                }}
                className="block w-full px-4 py-3 text-left text-sm text-foreground hover:bg-primary/10 border-b border-border/30 last:border-0"
              >
                <span className="font-medium">{place.name}</span>
                <span className="block text-xs text-muted-foreground mt-0.5">
                  {[place.admin1, place.country].filter(Boolean).join(", ")}
                </span>
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {error
                ? "No pudimos conectar con el buscador. Inténtalo de nuevo."
                : "No encontramos esa ciudad. Revisa el nombre e inténtalo de nuevo."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
