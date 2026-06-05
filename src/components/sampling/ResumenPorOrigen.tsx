import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta } from '../../utils/samplingQuality';
import type { CalidadMuestra } from '../../utils/samplingQuality';

function calcAgg(muestras: CalidadMuestra[]) {
  if (muestras.length === 0) return null;
  const avgUtil = muestras.reduce((s, m) => s + m.pctUtil, 0) / muestras.length;
  const avgMerma = muestras.reduce((s, m) => s + m.pctMerma, 0) / muestras.length;
  const niveles = { excelente: 0, buena: 0, regular: 0, deficiente: 0 };
  for (const m of muestras) niveles[m.nivel]++;
  return { avgUtil, avgMerma, niveles, n: muestras.length };
}

function OrigenCard({ label, muestras, color }: { label: string; muestras: CalidadMuestra[]; color: string }) {
  const agg = calcAgg(muestras);
  if (!agg) return null;

  const barColor =
    agg.avgUtil >= 90 ? 'bg-emerald-500' :
    agg.avgUtil >= 80 ? 'bg-green-500' :
    agg.avgUtil >= 70 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`border rounded-xl p-4 ${color}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-800">{label}</h4>
        <span className="text-xs text-gray-500">{agg.n} muestra{agg.n !== 1 ? 's' : ''}</span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Semilla útil promedio</span>
          <span className="font-semibold">{agg.avgUtil.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2">
          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${Math.min(agg.avgUtil, 100)}%` }} />
        </div>
      </div>

      <div className="flex justify-between text-xs text-gray-600 mb-3">
        <span>Merma promedio</span>
        <span className="font-semibold text-red-600">{agg.avgMerma.toFixed(1)}%</span>
      </div>

      <div className="grid grid-cols-2 gap-1 text-xs">
        {Object.entries(agg.niveles).filter(([, v]) => v > 0).map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="text-gray-600 capitalize">{k}</span>
            <span className="font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResumenPorOrigen() {
  const { sampling } = useApp();

  const todas = [
    ...sampling.muestreosTercera.map(evaluarTercera),
    ...sampling.muestreosCuarta.map(evaluarCuarta),
  ];

  const conOrigen = todas.filter((m) => m.origen !== undefined);
  if (conOrigen.length === 0) return null;

  const navojoa = conOrigen.filter((m) => m.origen === 'navojoa');
  const caborca = conOrigen.filter((m) => m.origen === 'caborca');

  if (navojoa.length === 0 && caborca.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Resumen por Origen</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navojoa.length > 0 && (
          <OrigenCard label="Navojoa" muestras={navojoa} color="border-green-200 bg-green-50" />
        )}
        {caborca.length > 0 && (
          <OrigenCard label="Caborca" muestras={caborca} color="border-blue-200 bg-blue-50" />
        )}
      </div>
    </div>
  );
}
