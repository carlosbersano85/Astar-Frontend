import { useMemo, useState } from "react";
import { Crosshair, RotateCcw } from "lucide-react";

type PlanetPoint = {
  key: string;
  label: string;
  symbol: string;
  sign?: string;
  degree?: number;
  house?: number;
  longitude: number;
};

type AspectLine = {
  from: string;
  to: string;
  type?: string;
};

type HouseCusp = {
  number: number;
  longitude: number;
};

interface InteractiveNatalChartProps {
  data: any;
  focusText?: string;
}

const SIGNS = [
  { key: "aries", label: "Aries", symbol: "♈" },
  { key: "taurus", label: "Tauro", symbol: "♉" },
  { key: "gemini", label: "Géminis", symbol: "♊" },
  { key: "cancer", label: "Cáncer", symbol: "♋" },
  { key: "leo", label: "Leo", symbol: "♌" },
  { key: "virgo", label: "Virgo", symbol: "♍" },
  { key: "libra", label: "Libra", symbol: "♎" },
  { key: "scorpio", label: "Escorpio", symbol: "♏" },
  { key: "sagittarius", label: "Sagitario", symbol: "♐" },
  { key: "capricorn", label: "Capricornio", symbol: "♑" },
  { key: "aquarius", label: "Acuario", symbol: "♒" },
  { key: "pisces", label: "Piscis", symbol: "♓" },
];

const HOUSE_KEYS = [
  "first_house",
  "second_house",
  "third_house",
  "fourth_house",
  "fifth_house",
  "sixth_house",
  "seventh_house",
  "eighth_house",
  "ninth_house",
  "tenth_house",
  "eleventh_house",
  "twelfth_house",
];

const PLANET_DEFS = [
  { key: "sun", label: "Sol", symbol: "☉", aliases: ["sun", "sol"] },
  { key: "moon", label: "Luna", symbol: "☽", aliases: ["moon", "luna"] },
  { key: "mercury", label: "Mercurio", symbol: "☿", aliases: ["mercury", "mercurio"] },
  { key: "venus", label: "Venus", symbol: "♀", aliases: ["venus"] },
  { key: "mars", label: "Marte", symbol: "♂", aliases: ["mars", "marte"] },
  { key: "jupiter", label: "Júpiter", symbol: "♃", aliases: ["jupiter", "júpiter"] },
  { key: "saturn", label: "Saturno", symbol: "♄", aliases: ["saturn", "saturno"] },
  { key: "uranus", label: "Urano", symbol: "♅", aliases: ["uranus", "urano"] },
  { key: "neptune", label: "Neptuno", symbol: "♆", aliases: ["neptune", "neptuno"] },
  { key: "pluto", label: "Plutón", symbol: "♇", aliases: ["pluto", "plutón", "pluton"] },
  { key: "chiron", label: "Quirón", symbol: "⚷", aliases: ["chiron", "quirón", "quiron"] },
  { key: "north_node", label: "Nodo Norte", symbol: "☊", aliases: ["north node", "north_node", "true_north_lunar_node", "nodo norte"] },
  { key: "ascendant", label: "Ascendente", symbol: "ASC", aliases: ["ascendant", "ascendente", "asc", "first_house"] },
  { key: "medium_coeli", label: "Medio Cielo", symbol: "MC", aliases: ["medium_coeli", "medium coeli", "midheaven", "medio cielo", "mc", "tenth_house"] },
];

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function numeric(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function signIndex(sign: unknown): number | undefined {
  const normalized = normalizeText(sign);
  const aliases: Record<string, string> = {
    aries: "aries",
    ari: "aries",
    taurus: "taurus",
    tau: "taurus",
    tauro: "taurus",
    gemini: "gemini",
    gem: "gemini",
    geminis: "gemini",
    cancer: "cancer",
    can: "cancer",
    leo: "leo",
    virgo: "virgo",
    vir: "virgo",
    libra: "libra",
    lib: "libra",
    scorpio: "scorpio",
    sco: "scorpio",
    escorpio: "scorpio",
    sagittarius: "sagittarius",
    sag: "sagittarius",
    sagitario: "sagittarius",
    capricorn: "capricorn",
    cap: "capricorn",
    capricornio: "capricorn",
    aquarius: "aquarius",
    aqu: "aquarius",
    acuario: "aquarius",
    pisces: "pisces",
    pis: "pisces",
    piscis: "pisces",
  };
  const key = aliases[normalized];
  if (!key) return undefined;
  const index = SIGNS.findIndex((item) => item.key === key);
  return index >= 0 ? index : undefined;
}

function candidateForPlanet(source: any, aliases: string[]): any {
  const containers = [
    source,
    source?.planets,
    source?.subject,
    source?.subject?.planets,
    source?.chart_data,
    source?.chart_data?.subject,
    source?.chart_data?.subject?.planets,
    source?.chart,
    source?.chart?.planets,
  ].filter(Boolean);

  for (const container of containers) {
    if (Array.isArray(container)) {
      const match = container.find((item) => {
        const name = normalizeText(item?.name ?? item?.planet ?? item?.id ?? item?.key);
        return aliases.some((alias) => name === normalizeText(alias));
      });
      if (match) return match;
      continue;
    }

    if (typeof container === "object") {
      for (const [key, value] of Object.entries(container)) {
        const normalizedKey = normalizeText(key);
        const namedValue = normalizeText((value as any)?.name ?? (value as any)?.planet);
        if (aliases.some((alias) => {
          const normalizedAlias = normalizeText(alias);
          return normalizedKey === normalizedAlias || namedValue === normalizedAlias;
        })) {
          return value;
        }
      }
    }
  }

  return undefined;
}

function houseNumber(value: unknown): number | undefined {
  const direct = numeric(value);
  if (direct != null) return Math.round(direct);

  const normalized = normalizeText(value).replace(/_/g, " ");
  const names: Record<string, number> = {
    "first house": 1,
    "second house": 2,
    "third house": 3,
    "fourth house": 4,
    "fifth house": 5,
    "sixth house": 6,
    "seventh house": 7,
    "eighth house": 8,
    "ninth house": 9,
    "tenth house": 10,
    "eleventh house": 11,
    "twelfth house": 12,
  };

  return names[normalized];
}

function signDisplay(sign: unknown): string | undefined {
  const index = signIndex(sign);
  return index == null ? (typeof sign === "string" ? sign : undefined) : SIGNS[index].label;
}

function normalizePlanetPoints(rawData: any): PlanetPoint[] {
  const source = rawData?.data ?? rawData;

  return PLANET_DEFS.flatMap((def) => {
    const candidate = candidateForPlanet(source, def.aliases);
    if (!candidate) return [];

    const sign = candidate?.sign ?? candidate?.sign_name ?? candidate?.zodiac_sign;
    const absolute =
      numeric(candidate?.abs_pos) ??
      numeric(candidate?.absolute_position) ??
      numeric(candidate?.absolute_degree) ??
      numeric(candidate?.longitude);

    const rawDegree =
      numeric(candidate?.degree) ??
      numeric(candidate?.position) ??
      numeric(candidate?.position_in_sign) ??
      numeric(candidate?.sign_degree);

    let longitude = absolute;
    const index = signIndex(sign);

    if (longitude == null && rawDegree != null) {
      if (rawDegree > 30) {
        longitude = rawDegree;
      } else if (index != null) {
        longitude = index * 30 + rawDegree;
      }
    }

    if (longitude == null || !Number.isFinite(longitude)) return [];

    const house =
      houseNumber(candidate?.house) ??
      houseNumber(candidate?.house_number) ??
      houseNumber(candidate?.house_num);

    const degree = index != null ? ((longitude % 30) + 30) % 30 : rawDegree;

    return [{
      key: def.key,
      label: def.label,
      symbol: def.symbol,
      sign: signDisplay(sign),
      degree,
      house,
      longitude: ((longitude % 360) + 360) % 360,
    }];
  });
}

function normalizeHouseCusps(rawData: any): HouseCusp[] {
  const source = rawData?.data ?? rawData;
  const subject =
    source?.subject ??
    source?.chart_data?.subject ??
    source?.chart?.subject ??
    source;

  const direct = HOUSE_KEYS.flatMap((key, index) => {
    const cusp = subject?.[key];
    const longitude =
      numeric(cusp?.abs_pos) ??
      numeric(cusp?.absolute_position) ??
      numeric(cusp?.longitude);

    return longitude == null
      ? []
      : [{ number: index + 1, longitude: ((longitude % 360) + 360) % 360 }];
  });

  if (direct.length === 12) return direct;

  if (Array.isArray(subject?.houses)) {
    return subject.houses.flatMap((house: any, index: number) => {
      const longitude =
        numeric(house?.abs_pos) ??
        numeric(house?.absolute_position) ??
        numeric(house?.longitude) ??
        numeric(house?.degree);
      return longitude == null
        ? []
        : [{
            number: Number(house?.number ?? house?.house ?? index + 1),
            longitude: ((longitude % 360) + 360) % 360,
          }];
    });
  }

  return direct;
}

function normalizeAspects(rawData: any): AspectLine[] {
  const source = rawData?.data ?? rawData;
  const raw =
    source?.aspects ??
    source?.subject?.aspects ??
    source?.chart_data?.aspects ??
    source?.chart?.aspects ??
    [];

  if (!Array.isArray(raw)) return [];

  return raw.flatMap((aspect: any) => {
    const fromName = normalizeText(
      aspect?.body1 ?? aspect?.p1_name ?? aspect?.planet1 ?? aspect?.first ?? aspect?.p1
    );
    const toName = normalizeText(
      aspect?.body2 ?? aspect?.p2_name ?? aspect?.planet2 ?? aspect?.second ?? aspect?.p2
    );

    const fromDef = PLANET_DEFS.find((def) =>
      def.aliases.some((alias) => normalizeText(alias) === fromName)
    );
    const toDef = PLANET_DEFS.find((def) =>
      def.aliases.some((alias) => normalizeText(alias) === toName)
    );

    if (!fromDef || !toDef) return [];

    return [{
      from: fromDef.key,
      to: toDef.key,
      type: aspect?.type ?? aspect?.aspect ?? aspect?.aspect_name,
    }];
  });
}

function pointOnCircle(longitude: number, radius: number) {
  const angle = ((longitude - 90) * Math.PI) / 180;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function midpointLongitude(start: number, end: number) {
  const adjustedEnd = end <= start ? end + 360 : end;
  return ((start + (adjustedEnd - start) / 2) % 360 + 360) % 360;
}

function donutSectorPath(start: number, end: number, innerRadius: number, outerRadius: number) {
  const adjustedEnd = end <= start ? end + 360 : end;
  const delta = adjustedEnd - start;
  const largeArc = delta > 180 ? 1 : 0;
  const outerStart = pointOnCircle(start, outerRadius);
  const outerEnd = pointOnCircle(adjustedEnd, outerRadius);
  const innerEnd = pointOnCircle(adjustedEnd, innerRadius);
  const innerStart = pointOnCircle(start, innerRadius);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

function activeHouseFromText(text: string): number | null {
  const match = normalizeText(text).match(/(?:casa|house)\s*(\d{1,2})/);
  if (!match) return null;
  const value = Number(match[1]);
  return value >= 1 && value <= 12 ? value : null;
}

function focusFromText(text: string, planets: PlanetPoint[]) {
  const normalized = normalizeText(text);
  const keys = new Set<string>();

  PLANET_DEFS.forEach((def) => {
    if (def.aliases.some((alias) => normalized.includes(normalizeText(alias)))) {
      keys.add(def.key);
    }
  });

  const houseMatch = normalized.match(/(?:casa|house)\s*(\d{1,2})/);
  if (houseMatch) {
    const house = Number(houseMatch[1]);
    planets
      .filter((planet) => planet.house === house)
      .forEach((planet) => keys.add(planet.key));
  }

  return keys;
}

export default function InteractiveNatalChart({ data, focusText = "" }: InteractiveNatalChartProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const planets = useMemo(() => normalizePlanetPoints(data), [data]);
  const houses = useMemo(() => normalizeHouseCusps(data), [data]);
  const aspects = useMemo(() => normalizeAspects(data), [data]);
  const textFocus = useMemo(() => focusFromText(focusText, planets), [focusText, planets]);
  const activeHouse = useMemo(() => activeHouseFromText(focusText), [focusText]);

  const activeKeys = useMemo(() => {
    const keys = new Set(textFocus);
    if (selectedKey) keys.add(selectedKey);
    return keys;
  }, [textFocus, selectedKey]);

  const hasFocus = activeKeys.size > 0;
  const selectedPlanet = planets.find((planet) => planet.key === selectedKey);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-background/35 p-3 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.08),transparent_62%)] pointer-events-none" />
        <svg viewBox="-180 -180 360 360" className="relative mx-auto aspect-square w-full max-w-[620px]" role="img" aria-label="Carta natal interactiva">
          <circle r="158" fill="none" className="stroke-primary/35" strokeWidth="1.4" />
          <circle r="128" fill="none" className="stroke-border/70" strokeWidth="1" />
          <circle r="82" fill="none" className="stroke-border/45" strokeWidth="1" />

          {Array.from({ length: 12 }).map((_, index) => {
            const angle = ((index * 30 - 90) * Math.PI) / 180;
            return (
              <line
                key={`zodiac-${index}`}
                x1={Math.cos(angle) * 128}
                y1={Math.sin(angle) * 128}
                x2={Math.cos(angle) * 158}
                y2={Math.sin(angle) * 158}
                className="stroke-border/30"
                strokeWidth="0.7"
              />
            );
          })}

          {activeHouse && houses.length === 12 && (() => {
            const index = activeHouse - 1;
            const current = houses[index];
            const next = houses[(index + 1) % 12];
            if (!current || !next) return null;
            return (
              <path
                d={donutSectorPath(current.longitude, next.longitude, 82, 127)}
                className="fill-primary/10 stroke-primary/25"
                strokeWidth="0.7"
              />
            );
          })()}

          {houses.map((house) => {
            const cuspPoint = pointOnCircle(house.longitude, 158);
            const innerPoint = pointOnCircle(house.longitude, 82);
            const next = houses[house.number % houses.length];
            const labelLongitude = next
              ? midpointLongitude(house.longitude, next.longitude)
              : house.longitude;
            const labelPoint = pointOnCircle(labelLongitude, 69);
            const highlighted = activeHouse === house.number;

            return (
              <g key={`house-${house.number}`}>
                <line
                  x1={innerPoint.x}
                  y1={innerPoint.y}
                  x2={cuspPoint.x}
                  y2={cuspPoint.y}
                  className={highlighted ? "stroke-primary/80" : "stroke-primary/25"}
                  strokeWidth={highlighted ? 1.6 : 0.8}
                />
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={highlighted ? "fill-primary text-[8px]" : "fill-muted-foreground/65 text-[8px]"}
                >
                  {house.number}
                </text>
              </g>
            );
          })}

          {SIGNS.map((sign, index) => {
            const point = pointOnCircle(index * 30 + 15, 144);
            return (
              <text
                key={sign.key}
                x={point.x}
                y={point.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[13px]"
              >
                {sign.symbol}
              </text>
            );
          })}

          {aspects.map((aspect, index) => {
            const from = planets.find((planet) => planet.key === aspect.from);
            const to = planets.find((planet) => planet.key === aspect.to);
            if (!from || !to) return null;

            const a = pointOnCircle(from.longitude, 108);
            const b = pointOnCircle(to.longitude, 108);
            const highlighted =
              !hasFocus ||
              activeKeys.has(from.key) ||
              activeKeys.has(to.key);

            return (
              <line
                key={`${aspect.from}-${aspect.to}-${index}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={highlighted ? "stroke-primary/45" : "stroke-border/15"}
                strokeWidth={highlighted ? 1.1 : 0.55}
              />
            );
          })}

          {planets.map((planet) => {
            const point = pointOnCircle(planet.longitude, 108);
            const highlighted = !hasFocus || activeKeys.has(planet.key);

            return (
              <g
                key={planet.key}
                role="button"
                tabIndex={0}
                className="cursor-pointer"
                onClick={() => setSelectedKey((current) => current === planet.key ? null : planet.key)}
              >
                {activeKeys.has(planet.key) && (
                  <circle cx={point.x} cy={point.y} r="15" className="fill-primary/15 stroke-primary/70" strokeWidth="1" />
                )}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  className={highlighted ? "fill-card stroke-primary/80" : "fill-card/70 stroke-border/30"}
                  strokeWidth="1"
                />
                <text
                  x={point.x}
                  y={point.y + 0.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={highlighted ? "fill-primary text-[12px]" : "fill-muted-foreground/45 text-[12px]"}
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}

          <circle r="36" className="fill-background/70 stroke-primary/20" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" className="fill-primary text-[10px] tracking-[0.18em]">
            ASTAR
          </text>
          <text x="0" y="12" textAnchor="middle" className="fill-muted-foreground text-[7px]">
            CARTA INTERACTIVA
          </text>
        </svg>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl border border-border/40 bg-card/45 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-primary">Ver en mi carta</p>
              <p className="mt-1 text-xs text-muted-foreground">Toca un planeta para aislarlo.</p>
            </div>
            {selectedKey && (
              <button
                type="button"
                onClick={() => setSelectedKey(null)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                aria-label="Restablecer selección"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {focusText && (
            <div className="mb-4 rounded-xl border border-primary/15 bg-primary/5 p-3">
              <div className="flex items-start gap-2">
                <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">Interpretación en foco</p>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{focusText}</p>
                </div>
              </div>
            </div>
          )}

          {planets.length === 0 ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              La rueda está lista para iluminar planetas y aspectos cuando la carta calculada esté disponible.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {planets.map((planet) => {
                const active = activeKeys.has(planet.key);
                return (
                  <button
                    key={planet.key}
                    type="button"
                    onClick={() => setSelectedKey((current) => current === planet.key ? null : planet.key)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                      active
                        ? "border-primary/40 bg-primary/10"
                        : "border-border/35 bg-background/30 hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={active ? "text-primary" : "text-muted-foreground"}>{planet.symbol}</span>
                      <span className="text-xs font-medium text-foreground">{planet.label}</span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {planet.sign ?? "—"}
                      {planet.degree != null ? ` · ${planet.degree.toFixed(1)}°` : ""}
                      {planet.house ? ` · Casa ${planet.house}` : ""}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedPlanet && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Elemento seleccionado</p>
            <p className="mt-2 font-serif text-lg text-foreground">
              {selectedPlanet.symbol} {selectedPlanet.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedPlanet.sign ?? "Signo sin dato"}
              {selectedPlanet.house ? ` · Casa ${selectedPlanet.house}` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
