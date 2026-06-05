import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta, NIVEL_LABEL, NIVEL_DOT } from '../../utils/samplingQuality';
import type { CalidadMuestra } from '../../utils/samplingQuality';
import { MapPin } from 'lucide-react';

function calcAgg(muestras: CalidadMuestra[]) {
  if (muestras.length === 0) return null;
  const avgUtil = muestras.reduce((s, m) => s + m.pctUtil, 0) / muestras.length;
  const avgMerma = muestras.reduce((s, m) => s + m.pctMerma, 0) / muestras.length;
  const niveles: Record<string, number> = { excelente: 0, buena: 0, regular: 0, deficiente: 0 };
  for (const m of muestras) niveles[m.nivel]++;
  const avgQuinta = muestras.filter((m) => m.pctQuinta !== undefined).length > 0
    ? muestras.reduce((s, m) => s + (m.pctQuinta ?? 0), 0) / muestras.length
    : null;
  return { avgUtil, avgMerma, avgQuinta, niveles, n: muestras.length };
}

function OrigenCard({ label, muestras, accentBar, accentText, accentBorder, accentBg }: {
  label: string;
  muestras: CalidadMuestra[];
  accentBar: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
}) {
  const agg = calcAgg(muestras);
  if (!agg) return null;

  const barColor =
    agg.avgUtil >= 90 ? 'bg-emerald-500' :
    agg.avgUtil >= 80 ? 'bg-green-500' :
    agg.avgUtil >= 70 ? 'bg-yellow-500' : 'bg-red-500';

  const barMermaColor =
    agg.avgMerma <= 2 ? 'bg-emerald-400' :
    agg.avgMerma <= 5 ? 'bg-yellow-400' : 'bg-red-400';

  const nivelesFiltrados = Object.entries(agg.niveles).filter(([, v]) => v > 0);

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${accentBorder} ${accentBg}`}>
      {/* Header */}
      <div className={`${accentBar} px-4 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-white opacity-80" />
          <span className="text-white font-bold text-base">{label}</span>
        </div>
        <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {agg.n} muestra{agg.n !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center bg-white rounded-xl py-2.5 px-1 border border-gray-100">
            <p className={`text-2xl font-black ${accentText}`}>{agg.avgUtil.toFixed(0)}<span className="text-xs font-semibold">%</span></p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">Útil prom.</p>
          </div>
          <div className="text-center bg-white rounded-xl py-2.5 px-1 border border-gray-100">
            <p className="text-2xl font-black text-red-500">{agg.avgMerma.toFixed(1)}<span className="text-xs font-semibold">%</span></p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">Merma prom.</p>
          </div>
          <div className="text-center bg-white rounded-xl py-2.5 px-1 border border-gray-100">
            {agg.avgQuinta !== null ? (
              <>
                <p className="text-2xl font-black text-violet-500">{agg.avgQuinta.toFixed(1)}<span className="text-xs font-semibold">%</span></p>
                <p className="text-xs text-gray-500 mt-0.5 leading-tight">Quinta prom.</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-black text-gray-300">—</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">Quinta</p>
              </>
            )}
          </div>
        </div>

        {/* Barras */}
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Semilla útil promedio</span>
              <span className="font-semibold">{agg.avgUtil.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(agg.avgUtil, 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Merma promedio</span>
              <span className="font-semibold">{agg.avgMerma.toFixed(1)}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full ${barMermaColor} transition-all`} style={{ width: `${Math.min(agg.avgMerma * 4, 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Distribución de calidad */}
        {nivelesFiltrados.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Distribución de calidad</p>
            <div className="flex flex-wrap gap-1.5">
              {nivelesFiltrados.map(([nivel, count]) => (
                <span key={nivel} className="inline-flex items-center gap-1 text-xs bg-white border border-gray-200 rounded-full px-2 py-0.5">
                  <span className={`w-2 h-2 rounded-full ${NIVEL_DOT[nivel as keyof typeof NIVEL_DOT]}`} />
                  <span className="text-gray-600">{NIVEL_LABEL[nivel as keyof typeof NIVEL_LABEL]}</span>
                  <span className="font-bold text-gray-700">{count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mejor / peor */}
        {muestras.length > 0 && (() => {
          const sorted = [...muestras].sort((a, b) => b.pctUtil - a.pctUtil);
          const mejor = sorted[0];
          const peor = sorted[sorted.length - 1];
          return (
            <div className="flex gap-2 text-xs">
              <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1.5">
                <p className="text-emerald-600 font-semibold uppercase text-xs">Mejor</p>
                <p className="text-gray-700 font-medium truncate">{mejor.lote?.toUpperCase() || 'Sin id'}</p>
                <p className="text-gray-500">{mejor.pctUtil.toFixed(1)}% útil</p>
              </div>
              {sorted.length > 1 && (
                <div className="flex-1 bg-red-50 border border-red-100 rounded-lg px-2 py-1.5">
                  <p className="text-red-600 font-semibold uppercase text-xs">Menor</p>
                  <p className="text-gray-700 font-medium truncate">{peor.lote?.toUpperCase() || 'Sin id'}</p>
                  <p className="text-gray-500">{peor.pctUtil.toFixed(1)}% útil</p>
                </div>
              )}
            </div>
          );
        })()}
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
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={16} className="text-gray-500" />
        <h3 className="font-semibold text-gray-800">Comparación por Origen</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {navojoa.length > 0 && (
          <OrigenCard
            label="Navojoa"
            muestras={navojoa}
            accentBar="bg-green-600"
            accentText="text-green-700"
            accentBorder="border-green-300"
            accentBg="bg-green-50"
          />
        )}
        {caborca.length > 0 && (
          <OrigenCard
            label="Caborca"
            muestras={caborca}
            accentBar="bg-blue-600"
            accentText="text-blue-700"
            accentBorder="border-blue-300"
            accentBg="bg-blue-50"
          />
        )}
      </div>
    </div>
  );
}
