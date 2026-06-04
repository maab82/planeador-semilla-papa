import { TrendingUp, TrendingDown, History } from 'lucide-react';
import { Card } from '../common/Card';
import type { MetodoHistorico } from '../../types/results';

interface Props {
  historico: MetodoHistorico;
  hectareasObjetivo: number;
}

export function HistoricoCard({ historico, hectareasObjetivo }: Props) {
  const absDiff = Math.abs(historico.diferencia);

  return (
    <Card variant={historico.alcanza ? 'green' : 'red'}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${historico.alcanza ? 'bg-green-200' : 'bg-red-200'}`}>
          <History size={16} className={historico.alcanza ? 'text-green-700' : 'text-red-700'} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Método Histórico</h3>
          <p className="text-xs text-gray-500">{historico.metodoLabel} · {historico.kgPorHa.toLocaleString()} kg/ha</p>
        </div>
      </div>

      <div className="text-center py-3 border-b border-gray-100 mb-3">
        <p className={`text-5xl font-black ${historico.alcanza ? 'text-green-700' : 'text-red-700'}`}>
          {historico.hectareas.toFixed(1)}
        </p>
        <p className="text-sm text-gray-500 font-medium mt-1">hectáreas posibles</p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Meta</p>
          <p className="text-base font-bold text-gray-700">{hectareasObjetivo} ha</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${historico.alcanza ? 'bg-green-200' : 'bg-red-200'}`}>
          {historico.alcanza
            ? <TrendingUp size={15} className="text-green-700" />
            : <TrendingDown size={15} className="text-red-700" />}
          <span className={`text-lg font-black ${historico.alcanza ? 'text-green-800' : 'text-red-800'}`}>
            {historico.alcanza ? '+' : '-'}{absDiff.toFixed(1)} ha
          </span>
        </div>
      </div>

      {!historico.alcanza && (
        <p className="text-xs text-red-600 mt-2 font-medium">
          Faltan {historico.toneladasFaltantes.toFixed(2)} toneladas para cumplir la meta
        </p>
      )}
    </Card>
  );
}
