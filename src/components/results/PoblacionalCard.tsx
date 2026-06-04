import { TrendingUp, TrendingDown, Sprout, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import type { MetodoPoblacional } from '../../types/results';

interface Props {
  poblacional: MetodoPoblacional;
  hectareasObjetivo: number;
}

export function PoblacionalCard({ poblacional, hectareasObjetivo }: Props) {
  const absDiff = Math.abs(poblacional.diferencia);

  if (!poblacional.disponible) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Sprout size={16} className="text-purple-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Método Poblacional</h3>
            <p className="text-xs text-gray-500">Basado en conteo de tubérculos</p>
          </div>
        </div>
        <div className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <AlertTriangle size={15} className="text-yellow-600 shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-800">
            Agregue muestreos de Tercera o Cuarta para calcular hectáreas por población de tubérculos.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant={poblacional.alcanza ? 'blue' : 'red'}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-2 rounded-lg ${poblacional.alcanza ? 'bg-blue-200' : 'bg-red-200'}`}>
          <Sprout size={16} className={poblacional.alcanza ? 'text-blue-700' : 'text-red-700'} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Método Poblacional</h3>
          <p className="text-xs text-gray-500">
            {poblacional.tuberculosMetro} tub/m · {poblacional.distanciaSurcos} cm entre surcos
          </p>
        </div>
      </div>

      <div className="text-center py-3 border-b border-gray-100 mb-3">
        <p className={`text-5xl font-black ${poblacional.alcanza ? 'text-blue-700' : 'text-red-700'}`}>
          {poblacional.hectareas.toFixed(1)}
        </p>
        <p className="text-sm text-gray-500 font-medium mt-1">hectáreas posibles</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center mb-3 text-xs">
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-gray-500">Total tubérculos</p>
          <p className="font-bold text-blue-700">{poblacional.totalTuberculos.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2">
          <p className="text-gray-500">Tubérculos/ha</p>
          <p className="font-bold text-blue-700">{poblacional.tuberculosPorHa.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Meta</p>
          <p className="text-base font-bold text-gray-700">{hectareasObjetivo} ha</p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${poblacional.alcanza ? 'bg-blue-200' : 'bg-red-200'}`}>
          {poblacional.alcanza
            ? <TrendingUp size={15} className="text-blue-700" />
            : <TrendingDown size={15} className="text-red-700" />}
          <span className={`text-lg font-black ${poblacional.alcanza ? 'text-blue-800' : 'text-red-800'}`}>
            {poblacional.alcanza ? '+' : '-'}{absDiff.toFixed(1)} ha
          </span>
        </div>
      </div>
    </Card>
  );
}
