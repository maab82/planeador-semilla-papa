import { MapPin } from 'lucide-react';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

export function PlantingCapacityCard({ results }: { results: ResultsData }) {
  return (
    <Card variant={results.alcanza ? 'green' : 'default'}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={18} className="text-green-600" />
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Capacidad de Siembra</h3>
      </div>
      <div className="text-center py-2">
        <p className="text-5xl font-black text-green-700">
          {results.hectareasPostbles.toFixed(1)}
        </p>
        <p className="text-base text-gray-500 font-medium mt-1">hectáreas posibles</p>
        <p className="text-xs text-gray-400 mt-1">
          Con {results.kgPorHaUsado.toLocaleString()} kg/ha
        </p>
      </div>
    </Card>
  );
}
