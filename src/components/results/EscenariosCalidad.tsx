import { Leaf, AlertTriangle } from 'lucide-react';
import { Card } from '../common/Card';
import type { SamplingResultsTercera } from '../../types/sampling';

interface EscenariosCalidadProps {
  arpillasTercera: number;
  arpillasCuarta: number;
  weightPerBag: number;
  resTercera: SamplingResultsTercera;
  kgPorHa: number;
  hectareasObjetivo: number;
}

// ─── tipos internos ───────────────────────────────────────────────────────────

interface DistribucionCalibre {
  pctSegunda: number;
  pctTercera: number;
  pctCuarta: number;
  pctCuartaChica: number;
  pctMerma: number;
}

interface ResultadoEscenario {
  nombre: string;
  deltaSegunda: number;
  dist: DistribucionCalibre;
  arpillasTotales: number;
  toneladas: number;
  hectareas: number;
  alcanzaMeta: boolean;
  alertaSegunda: 'alta' | 'muy_alta' | null;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function distribucionConDelta(
  base: SamplingResultsTercera,
  deltaSegunda: number,
): DistribucionCalibre {
  // El delta se resta de la tercera. El resto de calibres no cambia.
  const pctSegunda    = Math.min(base.pctSegunda + deltaSegunda, 100);
  const reduccion     = pctSegunda - base.pctSegunda;
  const pctTercera    = Math.max(base.pctTercera - reduccion, 0);
  return {
    pctSegunda,
    pctTercera,
    pctCuarta:      base.pctCuarta,
    pctCuartaChica: 0,          // lote tercera no genera cuarta chica
    pctMerma:       base.pctMerma,
  };
}

// Segunda es semilla — todas las arpillas son aprovechables
function calcularEscenario(
  nombre: string,
  deltaSegunda: number,
  arpillasTercera: number,
  arpillasCuarta: number,
  weightPerBag: number,
  resTercera: SamplingResultsTercera,
  kgPorHa: number,
  hectareasObjetivo: number,
): ResultadoEscenario {
  const dist = distribucionConDelta(resTercera, deltaSegunda);
  const arpillasTotales = arpillasTercera + arpillasCuarta;
  const toneladas = (arpillasTotales * weightPerBag) / 1000;
  const hectareas = kgPorHa > 0 ? (arpillasTotales * weightPerBag) / kgPorHa : 0;

  // La advertencia se evalúa sobre el lote tercera que es el afectado
  const alertaSegunda: 'alta' | 'muy_alta' | null =
    dist.pctSegunda > 35 ? 'muy_alta' :
    dist.pctSegunda > 25 ? 'alta'     :
    null;

  return {
    nombre,
    deltaSegunda,
    dist,
    arpillasTotales,
    toneladas,
    hectareas,
    alcanzaMeta: hectareas >= hectareasObjetivo,
    alertaSegunda,
  };
}

// ─── subcomponente: barra apilada de calibres ─────────────────────────────────

const CALIBRES = [
  { key: 'pctSegunda'    as const, label: 'Segunda',      color: 'bg-yellow-400' },
  { key: 'pctTercera'    as const, label: 'Tercera',      color: 'bg-green-500'  },
  { key: 'pctCuarta'     as const, label: 'Cuarta',       color: 'bg-blue-400'   },
  { key: 'pctCuartaChica'as const, label: 'Cuarta Chica', color: 'bg-indigo-400' },
  { key: 'pctMerma'      as const, label: 'Merma',        color: 'bg-red-400'    },
];

function BarraApilada({ dist }: { dist: DistribucionCalibre }) {
  return (
    <div className="w-full h-4 flex rounded-full overflow-hidden gap-px bg-gray-200">
      {CALIBRES.filter((c) => dist[c.key] > 0).map((c) => (
        <div
          key={c.key}
          className={c.color}
          style={{ width: `${dist[c.key]}%` }}
          title={`${c.label}: ${dist[c.key].toFixed(1)}%`}
        />
      ))}
    </div>
  );
}

function FilaCalibre({
  label, pct, color, resaltado,
}: { label: string; pct: number; color: string; resaltado?: boolean }) {
  if (pct === 0) return null;
  return (
    <div className={`flex items-center gap-2 text-xs ${resaltado ? 'font-semibold' : ''}`}>
      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${color}`} />
      <span className="text-gray-600 w-20 shrink-0">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={color} style={{ width: `${Math.min(pct, 100)}%`, height: '100%', borderRadius: 9999 }} />
      </div>
      <span className={`w-10 text-right ${resaltado ? 'text-amber-700' : 'text-gray-600'}`}>
        {pct.toFixed(1)}%
      </span>
    </div>
  );
}

// ─── bloque informativo ───────────────────────────────────────────────────────

function AlertPorQueImporta() {
  return (
    <details className="bg-white/70 border border-amber-200 rounded-lg text-[10px] text-gray-600">
      <summary className="px-2.5 py-1.5 cursor-pointer select-none font-semibold text-amber-700 hover:text-amber-900">
        ¿Por qué importa?
      </summary>
      <p className="px-2.5 pb-2.5 leading-relaxed">
        Una mayor proporción de segunda puede modificar el número de tubérculos disponibles
        por tonelada y afectar la población final lograda en campo, aun cuando las toneladas
        disponibles sean las mismas. La segunda típicamente es un calibre mayor y contiene
        menos unidades por kilogramo que tercera o cuarta.
      </p>
    </details>
  );
}

// ─── tarjeta de escenario ─────────────────────────────────────────────────────

const STYLE: Record<string, { card: string; badge: string; heading: string }> = {
  Optimista:    { card: 'border-green-200 bg-green-50',  badge: 'bg-green-600 text-white',  heading: 'text-green-800' },
  Esperado:     { card: 'border-blue-200 bg-blue-50',    badge: 'bg-blue-600 text-white',   heading: 'text-blue-800'  },
  Conservador:  { card: 'border-amber-200 bg-amber-50',  badge: 'bg-amber-500 text-white',  heading: 'text-amber-800' },
};

function TarjetaEscenario({ r }: { r: ResultadoEscenario }) {
  const s = STYLE[r.nombre];
  return (
    <div className={`rounded-xl border-2 ${s.card} p-4 flex flex-col gap-3`}>
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.badge}`}>{r.nombre}</span>
        {r.deltaSegunda > 0 && (
          <span className="text-xs text-gray-400">+{r.deltaSegunda} pp segunda</span>
        )}
      </div>

      {/* Barra apilada */}
      <div>
        <BarraApilada dist={r.dist} />
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
          {CALIBRES.filter((c) => r.dist[c.key] > 0).map((c) => (
            <span key={c.key} className="flex items-center gap-1 text-[10px] text-gray-500">
              <span className={`w-2 h-2 rounded-full ${c.color}`} />
              {c.label} {r.dist[c.key].toFixed(1)}%
            </span>
          ))}
        </div>
      </div>

      {/* Distribución por línea */}
      <div className="space-y-1.5">
        <FilaCalibre label="Segunda"   pct={r.dist.pctSegunda}     color="bg-yellow-400" resaltado={r.alertaSegunda !== null} />
        <FilaCalibre label="Tercera"   pct={r.dist.pctTercera}     color="bg-green-500"  />
        <FilaCalibre label="Cuarta"    pct={r.dist.pctCuarta}      color="bg-blue-400"   />
        <FilaCalibre label="Cuarta Ch" pct={r.dist.pctCuartaChica} color="bg-indigo-400" />
        <FilaCalibre label="Merma"     pct={r.dist.pctMerma}       color="bg-red-400"    />
      </div>

      {/* Inventario — no cambia entre escenarios */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/60">
        <div className="bg-white/70 rounded-lg p-2">
          <p className="text-gray-400">Arpillas</p>
          <p className={`font-bold ${s.heading}`}>{r.arpillasTotales.toLocaleString()}</p>
        </div>
        <div className="bg-white/70 rounded-lg p-2">
          <p className="text-gray-400">Toneladas</p>
          <p className={`font-bold ${s.heading}`}>{r.toneladas.toFixed(1)}</p>
        </div>
      </div>

      {/* Advertencia agronómica por nivel */}
      {r.alertaSegunda === 'muy_alta' && (
        <div className="space-y-1.5">
          <div className="flex items-start gap-1.5 bg-red-100 border border-red-300 rounded-lg px-2.5 py-2">
            <AlertTriangle size={13} className="text-red-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-red-800 leading-snug">
              <strong>La presencia de segunda es muy elevada ({r.dist.pctSegunda.toFixed(1)}%).</strong>{' '}
              Considere realizar muestreos adicionales o validar la población esperada antes de definir
              la superficie final de siembra.
            </p>
          </div>
          <AlertPorQueImporta />
        </div>
      )}
      {r.alertaSegunda === 'alta' && (
        <div className="space-y-1.5">
          <div className="flex items-start gap-1.5 bg-amber-100 border border-amber-300 rounded-lg px-2.5 py-2">
            <AlertTriangle size={13} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] text-amber-800 leading-snug">
              <strong>Alta proporción de segunda detectada ({r.dist.pctSegunda.toFixed(1)}%).</strong>{' '}
              Considere validar si la densidad objetivo (tubérculos por metro) sigue siendo
              adecuada para esta composición de semilla.
            </p>
          </div>
          <AlertPorQueImporta />
        </div>
      )}
    </div>
  );
}

// ─── componente principal ─────────────────────────────────────────────────────

export function EscenariosCalidad({
  arpillasTercera,
  arpillasCuarta,
  weightPerBag,
  resTercera,
  kgPorHa,
  hectareasObjetivo,
}: EscenariosCalidadProps) {
  const hayMuestreos =
    resTercera.pctSegunda + resTercera.pctTercera + resTercera.pctCuarta + resTercera.pctMerma > 0;

  if (!hayMuestreos || arpillasTercera === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-indigo-100 p-2 rounded-lg"><Leaf size={18} className="text-indigo-700" /></div>
          <h3 className="font-semibold text-gray-800">Escenarios de Calidad de Criba</h3>
        </div>
        <p className="text-sm text-gray-500">
          Registre muestreos de tercera e inventario para ver los escenarios de calidad.
        </p>
      </Card>
    );
  }

  const escenarios = [
    calcularEscenario('Optimista',   0,  arpillasTercera, arpillasCuarta, weightPerBag, resTercera, kgPorHa, hectareasObjetivo),
    calcularEscenario('Esperado',    5,  arpillasTercera, arpillasCuarta, weightPerBag, resTercera, kgPorHa, hectareasObjetivo),
    calcularEscenario('Conservador', 10, arpillasTercera, arpillasCuarta, weightPerBag, resTercera, kgPorHa, hectareasObjetivo),
  ];

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-indigo-100 p-2 rounded-lg"><Leaf size={18} className="text-indigo-700" /></div>
        <h3 className="font-semibold text-gray-800">Escenarios de Calidad de Criba</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        Visualización de la distribución de calibres según distintos niveles de segunda en el lote Tercera.
        Las toneladas y arpillas disponibles no cambian — lo que varía es la composición de la semilla.
      </p>

      {/* Supuesto base */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Muestreo observado lote Tercera: </span>
        Segunda <strong>{resTercera.pctSegunda.toFixed(1)}%</strong> ·{' '}
        Tercera <strong>{resTercera.pctTercera.toFixed(1)}%</strong> ·{' '}
        Cuarta <strong>{resTercera.pctCuarta.toFixed(1)}%</strong> ·{' '}
        Merma <strong>{resTercera.pctMerma.toFixed(1)}%</strong>
      </div>

      {/* Tres tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {escenarios.map((r) => <TarjetaEscenario key={r.nombre} r={r} />)}
      </div>

      {/* Tabla resumen comparativa */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase">
              <th className="text-left px-3 py-2 rounded-tl-lg">Escenario</th>
              <th className="text-right px-3 py-2">Segunda</th>
              <th className="text-right px-3 py-2">Tercera</th>
              <th className="text-right px-3 py-2">Cuarta</th>
              <th className="text-right px-3 py-2">Merma</th>
              <th className="text-right px-3 py-2">Arpillas</th>
              <th className="text-right px-3 py-2 rounded-tr-lg">Toneladas</th>
            </tr>
          </thead>
          <tbody>
            {escenarios.map((r, i) => {
              const s = STYLE[r.nombre];
              return (
                <tr key={r.nombre} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>{r.nombre}</span>
                  </td>
                  <td className={`px-3 py-2 text-right font-mono ${r.alertaSegunda === 'muy_alta' ? 'text-red-700 font-bold' : r.alertaSegunda === 'alta' ? 'text-amber-700 font-bold' : ''}`}>
                    {r.dist.pctSegunda.toFixed(1)}%
                    {r.alertaSegunda !== null && ' ⚠'}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{r.dist.pctTercera.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{r.dist.pctCuarta.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono text-red-600">{r.dist.pctMerma.toFixed(1)}%</td>
                  <td className="px-3 py-2 text-right font-mono">{r.arpillasTotales.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right font-mono">{r.toneladas.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Segunda, tercera, cuarta y cuarta chica son semilla aprovechable. Solo merma es descarte.
        Los escenarios simulan mayor presencia de segunda en el lote Tercera sin modificar los muestreos originales.
      </p>
    </Card>
  );
}
