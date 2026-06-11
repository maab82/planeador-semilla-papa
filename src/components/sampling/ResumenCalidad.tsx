import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta, NIVEL_LABEL, NIVEL_DOT } from '../../utils/samplingQuality';
import type { CalidadMuestra } from '../../utils/samplingQuality';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

function formatFecha(fecha?: string) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

const NIVEL_BG: Record<string, string> = {
  excelente: 'bg-emerald-50 border-emerald-300',
  buena: 'bg-green-50 border-green-300',
  regular: 'bg-yellow-50 border-yellow-300',
  deficiente: 'bg-red-50 border-red-300',
};

const NIVEL_HEADER: Record<string, string> = {
  excelente: 'bg-emerald-500',
  buena: 'bg-green-500',
  regular: 'bg-yellow-500',
  deficiente: 'bg-red-500',
};

const NIVEL_NUM: Record<string, string> = {
  excelente: 'text-emerald-700',
  buena: 'text-green-700',
  regular: 'text-yellow-700',
  deficiente: 'text-red-700',
};

const OBSERVACION: Record<string, string> = {
  excelente: 'Excelente uniformidad. Semilla altamente sembrable.',
  buena: 'Predominan calibres sembrables. Calidad satisfactoria.',
  regular: 'Semilla aprovechable con reservas. Monitorear merma.',
  deficiente: 'Calidad baja. Considerar revisión del lote.',
};

function CaliberBar({ detalles }: { detalles: Record<string, number> }) {
  const segments: { key: string; label: string; color: string; pct: number }[] = [
    { key: 'segunda',     label: '2da',    color: 'bg-green-400',   pct: detalles['segunda'] ?? 0 },
    { key: 'tercera',     label: '3ra',    color: 'bg-green-500',   pct: detalles['tercera'] ?? 0 },
    { key: 'cuarta',      label: '4ta',    color: 'bg-blue-400',    pct: detalles['cuarta'] ?? 0 },
    { key: 'cuartaChica', label: '4Ch',    color: 'bg-blue-300',    pct: detalles['cuartaChica'] ?? 0 },
    { key: 'quinta',      label: 'Qta',    color: 'bg-violet-400',  pct: detalles['quinta'] ?? 0 },
    { key: 'merma',       label: 'Merma',  color: 'bg-red-400',     pct: detalles['merma'] ?? 0 },
  ].filter((s) => s.pct > 0);

  return (
    <div className="mt-3">
      <div className="flex rounded-full overflow-hidden h-3 w-full">
        {segments.map((s) => (
          <div
            key={s.key}
            className={`${s.color} h-3 transition-all`}
            style={{ width: `${s.pct}%` }}
            title={`${s.label}: ${s.pct.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
        {segments.map((s) => (
          <span key={s.key} className="text-xs text-gray-500 flex items-center gap-1">
            <span className={`inline-block w-2 h-2 rounded-sm ${s.color}`} />
            {s.label} {s.pct.toFixed(0)}%
          </span>
        ))}
      </div>
    </div>
  );
}

function AlertChip({ tipo, mensaje }: { tipo: 'warning' | 'danger' | 'success'; mensaje: string }) {
  if (tipo === 'success') {
    return (
      <div className="flex items-start gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1.5">
        <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />
        <span className="text-xs text-emerald-700">{mensaje}</span>
      </div>
    );
  }
  if (tipo === 'danger') {
    return (
      <div className="flex items-start gap-1.5 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
        <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />
        <span className="text-xs text-red-700">{mensaje}</span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-1.5 bg-yellow-50 border border-yellow-200 rounded-lg px-2 py-1.5">
      <AlertTriangle size={13} className="text-yellow-500 shrink-0 mt-0.5" />
      <span className="text-xs text-yellow-700">{mensaje}</span>
    </div>
  );
}

function origenLabel(o?: string) {
  if (o === 'navojoa') return 'Navojoa';
  if (o === 'caborca') return 'Caborca';
  if (o === 'otro') return 'Otro';
  return null;
}

function QualityCard({ c }: { c: CalidadMuestra }) {
  const calibreLabel = c.calibre === 'tercera' ? 'Tercera' : 'Cuarta';
  const proveedorText = c.proveedor?.toUpperCase() || 'PROVEEDOR NO ESPECIFICADO';
  const origenText = origenLabel(c.origen);
  const viajeText = c.viaje || c.lote;
  const variedadText = c.variedad ? c.variedad.charAt(0).toUpperCase() + c.variedad.slice(1) : null;
  const fechaText = formatFecha(c.fechaRecepcion ?? c.fecha ?? undefined);

  const headerLine1Parts = [proveedorText, origenText].filter(Boolean).join(' · ');
  const headerLine2Parts = [
    viajeText ? `Viaje ${viajeText}` : null,
    variedadText,
    fechaText,
  ].filter(Boolean).join(' · ');

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${NIVEL_BG[c.nivel]}`}>
      {/* Header de color */}
      <div className={`${NIVEL_HEADER[c.nivel]} px-4 py-2 flex items-center justify-between`}>
        <span className="text-white text-xs font-semibold uppercase tracking-wide">{calibreLabel}</span>
        <span className="text-white text-xs font-bold">{NIVEL_LABEL[c.nivel].toUpperCase()}</span>
      </div>

      <div className="p-4">
        {/* Título: proveedor · origen */}
        <h4 className="font-bold text-gray-900 text-sm leading-tight">{headerLine1Parts}</h4>

        {/* Sub-identidad: viaje · variedad · fecha */}
        <div className="mt-0.5 mb-3">
          {headerLine2Parts ? (
            <p className="text-xs text-gray-500">{headerLine2Parts}</p>
          ) : (
            <p className="text-xs text-gray-400">Sin identificación de viaje</p>
          )}
        </div>

        {/* Indicadores principales */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center bg-white rounded-xl py-2 px-1 border border-gray-100">
            <p className={`text-2xl font-black ${NIVEL_NUM[c.nivel]}`}>{c.pctUtil.toFixed(0)}<span className="text-sm font-semibold">%</span></p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">Semilla útil</p>
          </div>
          <div className="text-center bg-white rounded-xl py-2 px-1 border border-gray-100">
            <p className="text-2xl font-black text-red-500">{c.pctMerma.toFixed(0)}<span className="text-sm font-semibold">%</span></p>
            <p className="text-xs text-gray-500 leading-tight mt-0.5">Merma</p>
          </div>
          {c.pctQuinta !== undefined ? (
            <div className="text-center bg-white rounded-xl py-2 px-1 border border-gray-100">
              <p className="text-2xl font-black text-violet-500">{c.pctQuinta.toFixed(0)}<span className="text-sm font-semibold">%</span></p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5">Quinta</p>
            </div>
          ) : (
            <div className="text-center bg-white rounded-xl py-2 px-1 border border-gray-100">
              <p className="text-2xl font-black text-gray-400">—</p>
              <p className="text-xs text-gray-500 leading-tight mt-0.5">Quinta</p>
            </div>
          )}
        </div>

        {/* Barra de distribución */}
        <CaliberBar detalles={c.detalles} />

        {/* Observación automática */}
        <p className="text-xs text-gray-500 italic mt-3 border-t border-gray-200 pt-2">
          {OBSERVACION[c.nivel]}
        </p>

        {/* Alertas */}
        {c.alertas.length > 0 && (
          <div className="space-y-1.5 mt-3">
            {c.alertas.map((a, i) => <AlertChip key={i} tipo={a.tipo} mensaje={a.mensaje} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResumenCalidad() {
  const { sampling } = useApp();

  const terceras = sampling.muestreosTercera.map(evaluarTercera);
  const cuartas = sampling.muestreosCuarta.map(evaluarCuarta);
  const todas = [...terceras, ...cuartas];

  if (todas.length === 0) return null;

  const dot = (nivel: string) => <span className={`inline-block w-2 h-2 rounded-full ${NIVEL_DOT[nivel as keyof typeof NIVEL_DOT]} mr-1`} />;
  const conteo = { excelente: 0, buena: 0, regular: 0, deficiente: 0 };
  for (const c of todas) conteo[c.nivel]++;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Resumen Ejecutivo de Calidad</h3>
        <div className="flex gap-3 text-xs text-gray-500">
          {conteo.excelente > 0 && <span>{dot('excelente')}{conteo.excelente} excelente</span>}
          {conteo.buena > 0 && <span>{dot('buena')}{conteo.buena} buena</span>}
          {conteo.regular > 0 && <span>{dot('regular')}{conteo.regular} regular</span>}
          {conteo.deficiente > 0 && <span>{dot('deficiente')}{conteo.deficiente} deficiente</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {todas.map((c) => <QualityCard key={c.id} c={c} />)}
      </div>
    </div>
  );
}
