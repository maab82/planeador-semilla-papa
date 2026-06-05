import { TrendingUp, TrendingDown, History, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import type { MetodoHistorico } from '../../types/results';

interface Props {
  historico: MetodoHistorico;
  hectareasObjetivo: number;
  totalKg: number;
}

export function HistoricoCard({ historico, hectareasObjetivo, totalKg }: Props) {
  const absDiff = Math.abs(historico.diferencia);
  const kgFueraDeRango = historico.kgPorHa < 1000 || historico.kgPorHa > 10000;

  return (
    <Card variant={kgFueraDeRango ? 'red' : historico.alcanza ? 'green' : 'red'}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${kgFueraDeRango ? 'bg-red-200' : historico.alcanza ? 'bg-green-200' : 'bg-red-200'}`}>
          <History size={16} className={kgFueraDeRango ? 'text-red-700' : historico.alcanza ? 'text-green-700' : 'text-red-700'} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Método Histórico</h3>
          <p className="text-xs text-gray-500">{historico.metodoLabel} · {historico.kgPorHa.toLocaleString()} kg/ha</p>
        </div>
      </div>

      {/* Advertencia de kg/ha fuera de rango — visible directamente en resultados */}
      {kgFueraDeRango && (
        <div className="flex items-start gap-2 bg-red-100 border border-red-300 rounded-lg px-3 py-2 mb-3">
          <AlertTriangle size={14} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-xs text-red-800">
            <strong>kg/ha fuera del rango operacional</strong> ({historico.kgPorHa.toLocaleString()} kg/ha).
            El resultado es poco realista. Corrija el valor en la pestaña <strong>Planeación</strong>.
          </p>
        </div>
      )}

      <div className="text-center py-3 border-b border-gray-100 mb-3">
        <p className={`text-5xl font-black ${kgFueraDeRango ? 'text-red-400' : historico.alcanza ? 'text-green-700' : 'text-red-700'}`}>
          {historico.hectareas.toFixed(1)}
        </p>
        <p className="text-sm text-gray-500 font-medium mt-1">hectáreas posibles</p>
        {/* Fórmula visible siempre */}
        <p className="text-xs text-gray-400 font-mono mt-1">
          {totalKg.toLocaleString()} kg ÷ {historico.kgPorHa.toLocaleString()} kg/ha = {historico.hectareas.toFixed(2)} ha
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Meta</p>
          <p className="text-base font-bold text-gray-700">{hectareasObjetivo} ha</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${kgFueraDeRango ? 'bg-red-200' : historico.alcanza ? 'bg-green-200' : 'bg-red-200'}`}>
          {historico.alcanza && !kgFueraDeRango
            ? <TrendingUp size={15} className="text-green-700" />
            : <TrendingDown size={15} className="text-red-700" />}
          <span className={`text-lg font-black ${historico.alcanza && !kgFueraDeRango ? 'text-green-800' : 'text-red-800'}`}>
            {historico.alcanza ? '+' : '-'}{absDiff.toFixed(1)} ha
          </span>
        </div>
      </div>

      {!historico.alcanza && !kgFueraDeRango && (
        <p className="text-xs text-red-600 mt-2 font-medium">
          Faltan {historico.toneladasFaltantes.toFixed(2)} toneladas para cumplir la meta
        </p>
      )}
    </Card>
  );
}
