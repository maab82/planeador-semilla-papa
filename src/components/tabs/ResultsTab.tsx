import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calcularResultados, calcularMuestreosTercera, calcularMuestreosCuarta } from '../../utils/calculations';
import { AvailableSeedCard } from '../results/AvailableSeedCard';
import { EstimatedPopulationCard } from '../results/EstimatedPopulationCard';
import { HistoricoCard } from '../results/HistoricoCard';
import { PoblacionalCard } from '../results/PoblacionalCard';
import { MethodDifferenceCard } from '../results/MethodDifferenceCard';
import { PlantingComparisonChart } from '../charts/PlantingComparisonChart';
import { ProyeccionPostCriba } from '../results/ProyeccionPostCriba';
import { EscenariosCalidad } from '../results/EscenariosCalidad';

export function ResultsTab() {
  const { inventory, sampling, planning } = useApp();
  const results = calcularResultados(inventory, sampling, planning);
  const resTercera = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCuarta = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  if (results.arpillasTotales === 0) {
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

  const { historico, poblacional, hectareasObjetivo } = results;

  return (
    <div className="space-y-4">

      {/* Banner de respuesta rápida */}
      <div className="bg-green-800 text-white rounded-xl p-4">
        <p className="text-green-200 text-sm font-medium mb-2 text-center">¿Para cuántas hectáreas alcanza la semilla disponible?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-green-700 rounded-xl p-3 text-center">
            <p className="text-green-300 text-xs font-medium mb-1">Método Histórico</p>
            <p className="text-3xl font-black text-white">{historico.hectareas.toFixed(1)} ha</p>
            <p className={`text-xs mt-1 font-medium ${historico.alcanza ? 'text-green-300' : 'text-red-300'}`}>
              {historico.alcanza
                ? `✓ Excedente ${Math.abs(historico.diferencia).toFixed(1)} ha`
                : `✗ Déficit ${Math.abs(historico.diferencia).toFixed(1)} ha`}
            </p>
          </div>
          <div className={`rounded-xl p-3 text-center ${poblacional.disponible ? 'bg-blue-700' : 'bg-green-700/50'}`}>
            <p className="text-blue-200 text-xs font-medium mb-1">Método Poblacional</p>
            {poblacional.disponible ? (
              <>
                <p className="text-3xl font-black text-white">{poblacional.hectareas.toFixed(1)} ha</p>
                <p className={`text-xs mt-1 font-medium ${poblacional.alcanza ? 'text-blue-200' : 'text-red-300'}`}>
                  {poblacional.alcanza
                    ? `✓ Excedente ${Math.abs(poblacional.diferencia).toFixed(1)} ha`
                    : `✗ Déficit ${Math.abs(poblacional.diferencia).toFixed(1)} ha`}
                </p>
              </>
            ) : (
              <p className="text-green-300 text-xs mt-2">Sin muestreos registrados</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventario + Población */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AvailableSeedCard results={results} />
        <EstimatedPopulationCard results={results} />
      </div>

      {/* Dos métodos lado a lado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <HistoricoCard historico={historico} hectareasObjetivo={hectareasObjetivo} totalKg={results.kgTotales} />
        <PoblacionalCard poblacional={poblacional} hectareasObjetivo={hectareasObjetivo} />
      </div>

      {/* Diferencia entre métodos */}
      <MethodDifferenceCard historico={historico} poblacional={poblacional} />

      {/* Proyección Post-Criba */}
      <ProyeccionPostCriba
        arpillasTercera={results.arpillasTercera}
        arpillasCuarta={results.arpillasCuarta}
        resTercera={resTercera}
        resCuarta={resCuarta}
      />

      {/* Escenarios de calidad */}
      <EscenariosCalidad
        arpillasTercera={results.arpillasTercera}
        arpillasCuarta={results.arpillasCuarta}
        weightPerBag={inventory.weightPerBag}
        resTercera={resTercera}
        resCuarta={resCuarta}
        kgPorHa={historico.kgPorHa}
        hectareasObjetivo={hectareasObjetivo}
      />

      {/* Gráfica */}
      <PlantingComparisonChart results={results} />
    </div>
  );
}
