import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface NatalChartData {
  sun?: { sign: string; degree: number };
  moon?: { sign: string; degree: number };
  rising?: { sign: string; degree: number };
  [key: string]: any;
}

interface AstroReportProps {
  type: 'natal' | 'solar-return' | 'synastry' | 'numerology';
}

export function AstroReportDisplay({ type }: AstroReportProps) {
  const { user } = useAuth();
  const [data, setData] = useState<NatalChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user?.birthData) return;

      setLoading(true);
      setError(null);

      try {
        const endpoint = {
          natal: '/astro/natal-chart',
          'solar-return': '/astro/solar-return',
          synastry: '/astro/synastry',
          numerology: '/astro/numerology',
        }[type];

        const response = await api.post(endpoint, {
          birthDate: user.birthData.date,
          birthTime: user.birthData.time,
          birthPlace: user.birthData.place,
        });

        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load astro report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [user, type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-gray-500">
        No data available. Please update your birth information.
      </div>
    );
  }

  const renderNatalChart = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sun */}
        {data.sun && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">☉ Sun</h3>
            <p className="text-lg text-yellow-800">{data.sun.sign}</p>
            <p className="text-sm text-yellow-700">{data.sun.degree.toFixed(2)}°</p>
            <p className="text-xs text-yellow-600 mt-2">Core identity & ego</p>
          </div>
        )}

        {/* Moon */}
        {data.moon && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">☾ Moon</h3>
            <p className="text-lg text-blue-800">{data.moon.sign}</p>
            <p className="text-sm text-blue-700">{data.moon.degree.toFixed(2)}°</p>
            <p className="text-xs text-blue-600 mt-2">Emotions & inner world</p>
          </div>
        )}

        {/* Rising */}
        {data.rising && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2">↑ Rising</h3>
            <p className="text-lg text-purple-800">{data.rising.sign}</p>
            <p className="text-sm text-purple-700">{data.rising.degree.toFixed(2)}°</p>
            <p className="text-xs text-purple-600 mt-2">Public persona & appearance</p>
          </div>
        )}
      </div>

      {/* Houses */}
      {data.houses && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Houses</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.houses.map((house: any, idx: number) => (
              <div key={idx} className="p-2 bg-gray-50 border border-gray-200 rounded">
                <p className="text-xs font-semibold text-gray-600">House {idx + 1}</p>
                <p className="text-sm text-gray-900">{house.sign}</p>
                <p className="text-xs text-gray-500">{house.degree.toFixed(2)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aspects */}
      {data.aspects && data.aspects.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Major Aspects</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {data.aspects.map((aspect: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-900">{aspect.body1} {aspect.type} {aspect.body2}</span>
                <span className={`text-xs px-2 py-1 rounded font-semibold ${
                  aspect.orb < 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {aspect.orb.toFixed(2)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interpretation */}
      {data.interpretation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Interpretation</h3>
          <p className="text-sm text-blue-800 leading-relaxed">{data.interpretation}</p>
        </div>
      )}
    </div>
  );

  const renderNumerology = () => (
    <div className="space-y-4">
      {data.lifePathNumber && (
        <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-orange-900 mb-2">Life Path Number</h3>
          <p className="text-3xl font-bold text-orange-600 mb-2">{data.lifePathNumber}</p>
          <p className="text-sm text-orange-800">{data.lifePathMeaning}</p>
        </div>
      )}

      {data.destinyNumber && (
        <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h3 className="font-semibold text-purple-900 mb-2">Destiny Number</h3>
          <p className="text-3xl font-bold text-purple-600 mb-2">{data.destinyNumber}</p>
          <p className="text-sm text-purple-800">{data.destinyMeaning}</p>
        </div>
      )}

      {data.soulUrgeNumber && (
        <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 border border-pink-200 rounded-lg">
          <h3 className="font-semibold text-pink-900 mb-2">Soul Urge Number</h3>
          <p className="text-3xl font-bold text-pink-600 mb-2">{data.soulUrgeNumber}</p>
          <p className="text-sm text-pink-800">{data.soulUrgeMeaning}</p>
        </div>
      )}
    </div>
  );

  const renderSolarReturn = () => (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-900 mb-2">Solar Return Chart</h3>
        <p className="text-sm text-yellow-800 mb-3">
          Your solar return chart for {data.year || 'this year'} shows the themes and energies active during your birthday year.
        </p>
        
        <div className="space-y-2">
          {data.sun && <p><strong>Sun:</strong> {data.sun.sign} at {data.sun.degree.toFixed(2)}°</p>}
          {data.moon && <p><strong>Moon:</strong> {data.moon.sign} at {data.moon.degree.toFixed(2)}°</p>}
          {data.summary && <p className="text-sm mt-3">{data.summary}</p>}
        </div>
      </div>
    </div>
  );

  const renderers: Record<string, () => React.ReactNode> = {
    natal: renderNatalChart,
    numerology: renderNumerology,
    'solar-return': renderSolarReturn,
    synastry: () => <div className="text-gray-600">Synastry comparison data</div>,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
        {type === 'solar-return' ? 'Solar Return' : type === 'synastry' ? 'Synastry' : type === 'numerology' ? 'Numerology' : 'Natal Chart'}
      </h2>
      {renderers[type]?.()}
    </div>
  );
}
