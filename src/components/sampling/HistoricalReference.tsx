import { BookOpen } from 'lucide-react';
import { Card } from '../common/Card';
import { HISTORICAL_SEASONS, HISTORICAL_AVERAGE_KG_HA } from '../../utils/constants';

export function HistoricalReference() {
  return (
    <Card variant="yellow">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-yellow-200 p-2 rounded-lg">
          <BookOpen size={16} className="text-yellow-800" />
        </div>
        <h3 className="font-semibold text-yellow-900">Datos Históricos de Referencia</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        {HISTORICAL_SEASONS.map((s) => (
          <div key={s.temporada} className="bg-white rounded-lg p-3 border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide mb-1">Temporada {s.temporada}</p>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Hectáreas</span>
                <span className="font-medium">{s.hectareas} ha</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Toneladas</span>
                <span className="font-medium">{s.toneladas} ton</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">kg/ha</span>
                <span className="font-bold text-yellow-800">{s.kgPorHa.toLocaleString()} kg/ha</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-yellow-200 rounded-lg px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-yellow-900">Promedio Histórico</span>
        <span className="text-lg font-bold text-yellow-900">{HISTORICAL_AVERAGE_KG_HA.toLocaleString()} kg/ha</span>
      </div>
    </Card>
  );
}
