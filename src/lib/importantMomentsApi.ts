const API_BASE = import.meta.env.VITE_API_URL;

export type ImportantMoment = {
  id: string;
  title: string;
  theme?: string;
  startDate?: string;
  endDate?: string;
  peakDate?: string;
  intensity?: number;
  summary: string;
  details?: string;
  focus?: string;
  technical?: {
    transitPlanet?: string;
    natalPoint?: string;
    aspect?: string;
    orbit?: number;
    movement?: string | null;
    natalHouse?: number | null;
  };
};

export type ImportantMomentsResponse = {
  success: boolean;
  months: number;
  generatedAt: string;
  moments: ImportantMoment[];
  scan?: {
    from: string;
    to: string;
    intervalDays: number;
    snapshotsRequested: number;
    snapshotsReceived: number;
    scope?: string;
  };
};

export async function astroGetImportantMoments(
  months = 12,
): Promise<ImportantMomentsResponse> {
  const token = localStorage.getItem("astar_token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${API_BASE}/astro/important-moments/user?months=${encodeURIComponent(String(months))}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof body?.message === "string"
        ? body.message
        : "No se pudieron calcular tus próximos momentos.",
    );
  }

  return body as ImportantMomentsResponse;
}
