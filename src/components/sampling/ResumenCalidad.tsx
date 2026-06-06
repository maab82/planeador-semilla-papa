import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta, NIVEL_LABEL, NIVEL_COLOR, NIVEL_DOT } from '../../utils/samplingQuality';
import type { CalidadMuestra } from '../../utils/samplingQuality';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function AlertIcon({ tipo }: { tipo: 'warning' | 'danger' | 'success' }) {
  if (tipo === 'success') return <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />;
  if (tipo === 'danger') return <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />;
  return <AlertTriangle size={13} className="text-yellow-500 shrink-0 mt-0.5" />;
}

function BarUtil({ pct, nivel }: { pct: number; nivel: string }) {
  const color =
    nivel === 'excelente' ? 'bg-emerald-500' :
    nivel === 'buena' ? 'bg-green-500' :
    nivel === 'regular' ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-10 text-right">{pct.toFixed(1)}%</span>
    </div>
  );
}

function QualityCard({ c, index }: { c: CalidadMuestra; index: number }) {
  const metaLine = [
    c.origen ? (c.origen === 'navojoa' ? 'Navojoa' : 'Caborca') : null,
    c.variedad ? c.variedad.charAt(0).toUpperCase() + c.variedad.slice(1) : null,
    c.lote ? `Lote ${c.lote}` : null,
    c.fecha ? c.fecha : null,
  ].filter(Boolean).join(' · ');

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-gray-400 font-medium">
            #{index + 1} — {c.calibre === 'tercera' ? 'Tercera' : 'Cuarta'}
          </span>
          {metaLine && <p className="text-xs text-gray-500 mt-0.5">{metaLine}</p>}
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${NIVEL_COLOR[c.nivel]}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${NIVEL_DOT[c.nivel]} mr-1`} />
          {NIVEL_LABEL[c.nivel]}
        </span>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-0.5">Semilla útil</p>
        <BarUtil pct={c.pctUtil} nivel={c.nivel} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-gray-600 mb-3">
        {Object.entries(c.detalles).map(([k, v]) => (
          <div key={k} className="flex justify-between">
            <span className="capitalize">{k === 'cuartaChica' ? 'Cuarta Chica' : k}</span>
            <span className="font-medium">{v.toFixed(1)}%</span>
          </div>
        ))}
      </div>

      {c.alertas.length > 0 && (
        <div className="space-y-1">
          {c.alertas.map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs">
              <AlertIcon tipo={a.tipo} />
              <span className={a.tipo === 'success' ? 'text-emerald-700' : a.tipo === 'danger' ? 'text-red-600' : 'text-yellow-700'}>
                {a.mensaje}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResumenCalidad() {
  const { sampling } = useApp();

  const terceras = sampling.muestreosTercera.map(evaluarTercera);
  const cuartas = sampling.muestreosCuarta.map(evaluarCuarta);
  const todas = [...terceras, ...cuartas];

  if (todas.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Resumen de Calidad por Muestra</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {todas.map((c, i) => <QualityCard key={c.id} c={c} index={i} />)}
      </div>
    </div>
  );
}
