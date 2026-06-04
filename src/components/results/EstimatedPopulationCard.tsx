import { Sprout } from 'lucide-react';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

export function EstimatedPopulationCard({ results }: { results: ResultsData }) {
  const hasTuberculos = results.totalTuberculos > 0;

  return (
    <Card variant={hasTuberculos ? 'green' : 'default'}>
      <div className="flex items-center gap-2 mb-3">
        <Sprout size={18} className="text-green-600" />
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Población Estimada</h3>
      </div>
      {hasTuberculos ? (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tubérculos de Tercera</span>
            <span className="font-bold text-green-700">{results.tuberculosTercera.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tubérculos de Cuarta</span>
            <span className="font-bold text-blue-700">{results.tuberculosCuarta.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center border-t pt-2 mt-1">
            <span className="text-sm font-semibold text-gray-700">Total Tubérculos</span>
            <span className="text-xl font-bold text-green-800">{results.totalTuberculos.toLocaleString()}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          Agregue muestreos para estimar la población de tubérculos.
        </p>
      )}
    </Card>
  );
}
