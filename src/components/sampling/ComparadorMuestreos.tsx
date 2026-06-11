import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta, NIVEL_LABEL, NIVEL_COLOR, NIVEL_DOT } from '../../utils/samplingQuality';
import { TrendingUp } from 'lucide-react';

export function ComparadorMuestreos() {
  const { sampling } = useApp();

  const terceras = sampling.muestreosTercera.map(evaluarTercera);
  const cuartas = sampling.muestreosCuarta.map(evaluarCuarta);
  const todas = [...terceras, ...cuartas].sort((a, b) => b.pctUtil - a.pctUtil);

  if (todas.length < 2) return null;

  const showQuinta = todas.some((c) => c.pctQuinta !== undefined);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={16} className="text-gray-500" />
        <h3 className="font-semibold text-gray-800">Comparación de Calidad</h3>
        <span className="text-xs text-gray-400">Ordenado mejor → peor</span>
      </div>

      <div className="space-y-2">
        {todas.map((c, rank) => {
          const viajeText = c.viaje || c.lote;
          const loteLabel = viajeText ? `Viaje ${viajeText}` : c.proveedor?.toUpperCase() || `Muestra #${rank + 1}`;
          const origenLabel = c.origen === 'navojoa' ? 'Navojoa' : c.origen === 'caborca' ? 'Caborca' : c.origen === 'otro' ? 'Otro' : '—';
          const variedadLabel = c.variedad ? c.variedad.charAt(0).toUpperCase() + c.variedad.slice(1) : '—';
          const proveedorLabel = c.proveedor || '—';
          const calibreLabel = c.calibre === 'tercera' ? '3ra' : '4ta';

          const barColor =
            c.nivel === 'excelente' ? 'bg-emerald-500' :
            c.nivel === 'buena' ? 'bg-green-500' :
            c.nivel === 'regular' ? 'bg-yellow-500' : 'bg-red-500';

          const rankColor =
            rank === 0 ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
            rank === todas.length - 1 ? 'bg-red-100 text-red-700 border-red-200' :
            'bg-gray-100 text-gray-500 border-gray-200';

          return (
            <div key={c.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 hover:border-gray-300 transition-colors">
              {/* Rank */}
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${rankColor}`}>
                {rank + 1}
              </div>

              {/* Identidad */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="font-semibold text-gray-900 text-sm truncate">{loteLabel}</p>
                  <span className="text-xs text-gray-400 shrink-0">{calibreLabel}</span>
                </div>
                <p className="text-xs text-gray-500">{proveedorLabel} · {variedadLabel} · {origenLabel}</p>
              </div>

              {/* Barra útil */}
              <div className="hidden sm:flex flex-col gap-1 w-28 shrink-0">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Útil</span>
                  <span className="font-semibold text-gray-700">{c.pctUtil.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5 w-full">
                  <div className={`h-1.5 rounded-full ${barColor}`} style={{ width: `${Math.min(c.pctUtil, 100)}%` }} />
                </div>
              </div>

              {/* Métricas */}
              <div className="flex gap-3 items-center shrink-0">
                <div className="text-right hidden md:block">
                  <p className="text-xs text-gray-400">Merma</p>
                  <p className="text-sm font-semibold text-red-500">{c.pctMerma.toFixed(1)}%</p>
                </div>
                {showQuinta && (
                  <div className="text-right hidden md:block">
                    <p className="text-xs text-gray-400">Quinta</p>
                    <p className="text-sm font-semibold text-violet-500">
                      {c.pctQuinta !== undefined ? `${c.pctQuinta.toFixed(1)}%` : '—'}
                    </p>
                  </div>
                )}
                {/* Útil visible en mobile */}
                <div className="text-right sm:hidden">
                  <p className="text-xs text-gray-400">Útil</p>
                  <p className="text-sm font-bold text-gray-800">{c.pctUtil.toFixed(0)}%</p>
                </div>
                {/* Badge */}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border whitespace-nowrap ${NIVEL_COLOR[c.nivel]}`}>
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${NIVEL_DOT[c.nivel]} mr-1`} />
                  {NIVEL_LABEL[c.nivel]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
