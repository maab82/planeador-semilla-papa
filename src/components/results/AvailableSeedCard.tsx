import { Package, Weight, Truck } from 'lucide-react';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

export function AvailableSeedCard({ results }: { results: ResultsData }) {
  return (
    <Card>
      <h3 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Semilla Disponible</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="flex justify-center mb-1"><Package size={18} className="text-green-600" /></div>
          <p className="text-2xl font-bold text-green-700">{results.arpillasTotales.toLocaleString()}</p>
          <p className="text-xs text-gray-500">arpillas</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="flex justify-center mb-1"><Weight size={18} className="text-blue-600" /></div>
          <p className="text-2xl font-bold text-blue-700">{results.kgTotales.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          <p className="text-xs text-gray-500">kilogramos</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-1"><Truck size={18} className="text-yellow-600" /></div>
          <p className="text-2xl font-bold text-yellow-700">{results.toneladasTotales.toFixed(2)}</p>
          <p className="text-xs text-gray-500">toneladas</p>
        </div>
      </div>
    </Card>
  );
}
