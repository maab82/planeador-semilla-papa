import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { calcularMuestreosTercera, calcularMuestreosCuarta } from '../../utils/calculations';

function PctBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-12 text-right">{value.toFixed(1)}%</span>
    </div>
  );
}

function StatRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-800">
        {value} {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </span>
    </div>
  );
}

export function SamplingResults() {
  const { sampling, inventory } = useApp();
  const resTercera = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCuarta = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  const hasTercera = sampling.muestreosTercera.length > 0;
  const hasCuarta = sampling.muestreosCuarta.length > 0;

  if (!hasTercera && !hasCuarta) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {hasTercera && (
        <Card variant="green">
          <h4 className="font-semibold text-green-800 mb-3">Resultados — Tercera</h4>
          <div className="space-y-2 mb-4">
            <PctBar label="Segunda" value={resTercera.pctSegunda} color="bg-green-400" />
            <PctBar label="Tercera" value={resTercera.pctTercera} color="bg-green-600" />
            <PctBar label="Cuarta" value={resTercera.pctCuarta} color="bg-yellow-400" />
            <PctBar label="Merma" value={resTercera.pctMerma} color="bg-red-400" />
          </div>
          <div className="space-y-0">
            <StatRow label="Promedio tubérculos/muestra" value={resTercera.promedioTuberculosMuestra.toFixed(1)} unit="uds" />
            <StatRow label="Promedio tubérculos/arpilla" value={resTercera.promedioTuberculosArpilla.toFixed(0)} unit="uds" />
            <StatRow label="Peso promedio por tubérculo" value={resTercera.pesoPorTuberculos.toFixed(1)} unit="g" />
            <StatRow label="Tubérculos por kg" value={resTercera.tuberculosPorKg.toFixed(1)} unit="uds/kg" />
          </div>
        </Card>
      )}

      {hasCuarta && (
        <Card variant="blue">
          <h4 className="font-semibold text-blue-800 mb-3">Resultados — Cuarta</h4>
          <div className="space-y-2 mb-4">
            <PctBar label="Tercera" value={resCuarta.pctTercera} color="bg-green-500" />
            <PctBar label="Cuarta" value={resCuarta.pctCuarta} color="bg-blue-500" />
            <PctBar label="Cuarta Chica" value={resCuarta.pctCuartaChica} color="bg-blue-300" />
            <PctBar label="Merma" value={resCuarta.pctMerma} color="bg-red-400" />
          </div>
          <div className="space-y-0">
            <StatRow label="Promedio tubérculos/muestra" value={resCuarta.promedioTuberculosMuestra.toFixed(1)} unit="uds" />
            <StatRow label="Promedio tubérculos/arpilla" value={resCuarta.promedioTuberculosArpilla.toFixed(0)} unit="uds" />
            <StatRow label="Peso promedio por tubérculo" value={resCuarta.pesoPorTuberculos.toFixed(1)} unit="g" />
            <StatRow label="Tubérculos por kg" value={resCuarta.tuberculosPorKg.toFixed(1)} unit="uds/kg" />
          </div>
        </Card>
      )}
    </div>
  );
}
