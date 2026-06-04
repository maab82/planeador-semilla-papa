import { useApp } from '../../context/AppContext';
import { calcularResultados } from '../../utils/calculations';
import { AvailableSeedCard } from '../results/AvailableSeedCard';
import { EstimatedPopulationCard } from '../results/EstimatedPopulationCard';
import { PlantingCapacityCard } from '../results/PlantingCapacityCard';
import { MetaComparisonCard } from '../results/MetaComparisonCard';
import { RequiredTonnageCard } from '../results/RequiredTonnageCard';
import { PlantingComparisonChart } from '../charts/PlantingComparisonChart';
import { AlertTriangle } from 'lucide-react';

export function ResultsTab() {
  const { inventory, sampling, planning } = useApp();
  const results = calcularResultados(inventory, sampling, planning);

  const hasInventory = results.arpillasTotales > 0;

  if (!hasInventory) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="bg-yellow-100 rounded-full p-4">
          <AlertTriangle size={32} className="text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Sin datos de inventario</h3>
        <p className="text-gray-500 max-w-sm text-sm">
          Ingrese el inventario de semilla en la pestaña <strong>Inventario</strong> para ver los resultados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-green-800 text-white rounded-xl p-4 text-center">
        <p className="text-green-200 text-sm font-medium mb-1">Respuesta a su pregunta:</p>
        <p className="text-xl font-bold">
          Con la semilla disponible puede sembrar{' '}
          <span className="text-3xl text-green-300">{results.hectareasPostbles.toFixed(1)} ha</span>
        </p>
        <p className="text-green-300 text-sm mt-1">
          {results.alcanza
            ? `✓ Alcanza para la meta de ${results.hectareasObjetivo} ha (excedente de ${Math.abs(results.diferenciaHectareas).toFixed(1)} ha)`
            : `✗ Faltan ${Math.abs(results.diferenciaHectareas).toFixed(1)} ha para cumplir la meta de ${results.hectareasObjetivo} ha`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AvailableSeedCard results={results} />
        <EstimatedPopulationCard results={results} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlantingCapacityCard results={results} />
        <MetaComparisonCard results={results} />
      </div>

      {!results.alcanza && <RequiredTonnageCard results={results} />}

      <PlantingComparisonChart results={results} />
    </div>
  );
}
