import { ArrowLeftRight } from 'lucide-react';
import { Card } from '../common/Card';
import type { MetodoHistorico, MetodoPoblacional } from '../../types/results';

interface Props {
  historico: MetodoHistorico;
  poblacional: MetodoPoblacional;
}

export function MethodDifferenceCard({ historico, poblacional }: Props) {
  if (!poblacional.disponible) return null;

  const diff = historico.hectareas - poblacional.hectareas;
  const absDiff = Math.abs(diff);
  const mayor = diff >= 0 ? 'Histórico' : 'Poblacional';

  return (
    <Card variant="yellow">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-yellow-200 p-2 rounded-lg">
          <ArrowLeftRight size={16} className="text-yellow-800" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Diferencia entre Métodos</h3>
          <p className="text-xs text-gray-500">Comparación Histórico vs Poblacional</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-green-100 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Histórico</p>
          <p className="text-xl font-bold text-green-700">{historico.hectareas.toFixed(1)}</p>
          <p className="text-xs text-gray-400">ha</p>
        </div>
        <div className="bg-yellow-100 rounded-lg p-3 flex flex-col items-center justify-center">
          <p className="text-xs text-yellow-700 font-semibold">Diferencia</p>
          <p className="text-lg font-black text-yellow-800">{absDiff.toFixed(1)} ha</p>
          <p className="text-xs text-yellow-600">más en {mayor}</p>
        </div>
        <div className="bg-blue-100 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Poblacional</p>
          <p className="text-xl font-bold text-blue-700">{poblacional.hectareas.toFixed(1)}</p>
          <p className="text-xs text-gray-400">ha</p>
        </div>
      </div>
    </Card>
  );
}
