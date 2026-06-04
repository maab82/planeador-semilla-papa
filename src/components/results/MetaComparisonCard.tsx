import { TrendingUp, TrendingDown, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

export function MetaComparisonCard({ results }: { results: ResultsData }) {
  const { alcanza, diferenciaHectareas, hectareasObjetivo } = results;
  const absDiff = Math.abs(diferenciaHectareas);

  return (
    <Card variant={alcanza ? 'green' : 'red'}>
      <div className="flex items-center gap-2 mb-3">
        {alcanza ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <AlertCircle size={20} className="text-red-600" />
        )}
        <h3 className={`font-semibold text-sm uppercase tracking-wide ${alcanza ? 'text-green-700' : 'text-red-700'}`}>
          Comparación con Meta
        </h3>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Meta</p>
          <p className="text-lg font-bold text-gray-700">{hectareasObjetivo} ha</p>
        </div>
        <div className={`text-center px-4 py-2 rounded-xl ${alcanza ? 'bg-green-200' : 'bg-red-200'}`}>
          <div className="flex items-center gap-1 justify-center">
            {alcanza ? (
              <TrendingUp size={18} className="text-green-700" />
            ) : (
              <TrendingDown size={18} className="text-red-700" />
            )}
            <span className={`text-2xl font-black ${alcanza ? 'text-green-800' : 'text-red-800'}`}>
              {alcanza ? '+' : '-'}{absDiff.toFixed(1)} ha
            </span>
          </div>
          <p className={`text-xs font-semibold ${alcanza ? 'text-green-700' : 'text-red-700'}`}>
            {alcanza ? 'Excedente estimado' : 'Faltante estimado'}
          </p>
        </div>
      </div>
    </Card>
  );
}
