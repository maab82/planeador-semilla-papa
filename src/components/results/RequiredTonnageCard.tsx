import { Truck } from 'lucide-react';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

export function RequiredTonnageCard({ results }: { results: ResultsData }) {
  if (results.alcanza) return null;

  return (
    <Card variant="red">
      <div className="flex items-center gap-2 mb-2">
        <Truck size={18} className="text-red-600" />
        <h3 className="font-semibold text-red-700 text-sm uppercase tracking-wide">Toneladas Requeridas</h3>
      </div>
      <div className="flex items-end gap-2">
        <div>
          <p className="text-3xl font-black text-red-700">{results.toneladasFaltantes.toFixed(2)}</p>
          <p className="text-sm text-red-600 font-medium">toneladas adicionales necesarias</p>
        </div>
      </div>
      <p className="text-xs text-red-500 mt-2">
        Para sembrar {results.hectareasObjetivo} ha al ritmo de {results.kgPorHaUsado.toLocaleString()} kg/ha
      </p>
    </Card>
  );
}
