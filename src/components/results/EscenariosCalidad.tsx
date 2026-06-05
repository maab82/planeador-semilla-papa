import { Leaf } from 'lucide-react';
import { Card } from '../common/Card';
import type { SamplingResultsTercera, SamplingResultsCuarta } from '../../types/sampling';

interface EscenariosCalidadProps {
  arpillasTercera: number;
  arpillasCuarta: number;
  weightPerBag: number;
  resTercera: SamplingResultsTercera;
  resCuarta: SamplingResultsCuarta;
  kgPorHa: number;
  hectareasObjetivo: number;
}

interface Escenario {
  nombre: string;
  deltaSegunda: number;        // pp adicionales de segunda en lote tercera
  color: {
    card: string;
    badge: string;
    text: string;
    bar: string;
    pill: string;
  };
}

const ESCENARIOS: Escenario[] = [
  {
    nombre: 'Optimista',
    deltaSegunda: 0,
    color: {
      card:  'border-green-200 bg-green-50',
      badge: 'bg-green-600 text-white',
      text:  'text-green-800',
      bar:   'bg-green-500',
      pill:  'bg-green-100 text-green-700',
    },
  },
  {
    nombre: 'Esperado',
    deltaSegunda: 5,
    color: {
      card:  'border-blue-200 bg-blue-50',
      badge: 'bg-blue-600 text-white',
      text:  'text-blue-800',
      bar:   'bg-blue-500',
      pill:  'bg-blue-100 text-blue-700',
    },
  },
  {
    nombre: 'Conservador',
    deltaSegunda: 10,
    color: {
      card:  'border-amber-200 bg-amber-50',
      badge: 'bg-amber-500 text-white',
      text:  'text-amber-800',
      bar:   'bg-amber-400',
      pill:  'bg-amber-100 text-amber-700',
    },
  },
];

interface ResultadoEscenario {
  nombre: string;
  deltaSegunda: number;
  pctSegundaEfectiva: number;
  pctTerceraEfectiva: number;
  arpillasAprovechables: number;
  toneladas: number;
  hectareas: number;
  diferencia: number;
  alcanza: boolean;
  variacionVsOptimista: number;   // % respecto al escenario base
  color: Escenario['color'];
}

function calcularEscenario(
  e: Escenario,
  arpillasTercera: number,
  arpillasCuarta: number,
  weightPerBag: number,
  resTercera: SamplingResultsTercera,
  resCuarta: SamplingResultsCuarta,
  kgPorHa: number,
  hectareasObjetivo: number,
): ResultadoEscenario {
  // Ajuste de porcentajes en lote tercera (no modifica el estado original)
  const pctSegundaEfectiva = Math.min(resTercera.pctSegunda + e.deltaSegunda, 100);
  const reduccion = pctSegundaEfectiva - resTercera.pctSegunda;
  const pctTerceraEfectiva = Math.max(resTercera.pctTercera - reduccion, 0);

  // Arpillas aprovechables para siembra desde lote tercera
  // Segunda y merma salen del lote — no se plantan
  const aprovT = arpillasTercera * (pctTerceraEfectiva + resTercera.pctCuarta) / 100;

  // Arpillas aprovechables desde lote cuarta (muestreo cuarta no tiene segunda)
  const aprovC = arpillasCuarta * (resCuarta.pctTercera + resCuarta.pctCuarta + resCuarta.pctCuartaChica) / 100;

  const arpillasAprovechables = aprovT + aprovC;
  const kg = arpillasAprovechables * weightPerBag;
  const toneladas = kg / 1000;
  const hectareas = kgPorHa > 0 ? kg / kgPorHa : 0;
  const diferencia = hectareas - hectareasObjetivo;

  return {
    nombre: e.nombre,
    deltaSegunda: e.deltaSegunda,
    pctSegundaEfectiva,
    pctTerceraEfectiva,
    arpillasAprovechables,
    toneladas,
    hectareas,
    diferencia,
    alcanza: diferencia >= 0,
    variacionVsOptimista: 0, // se calcula después
    color: e.color,
  };
}

export function EscenariosCalidad({
  arpillasTercera,
  arpillasCuarta,
  weightPerBag,
  resTercera,
  resCuarta,
  kgPorHa,
  hectareasObjetivo,
}: EscenariosCalidadProps) {
  // Solo mostrar cuando hay muestreos de tercera (la variable afectada)
  const hayMuestreos = resTercera.pctSegunda + resTercera.pctTercera + resTercera.pctCuarta + resTercera.pctMerma > 0;

  if (!hayMuestreos || arpillasTercera === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-indigo-100 p-2 rounded-lg"><Leaf size={18} className="text-indigo-700" /></div>
          <h3 className="font-semibold text-gray-800">Escenarios de Calidad de Criba</h3>
        </div>
        <p className="text-sm text-gray-500">
          Registre muestreos de tercera e inventario en la pestaña <strong>Inventario</strong> y{' '}
          <strong>Muestreos</strong> para ver los escenarios.
        </p>
      </Card>
    );
  }

  // Calcular los tres escenarios
  const resultados = ESCENARIOS.map((e) =>
    calcularEscenario(e, arpillasTercera, arpillasCuarta, weightPerBag, resTercera, resCuarta, kgPorHa, hectareasObjetivo),
  );

  // Variación porcentual relativa al optimista
  const haOptimista = resultados[0].hectareas;
  resultados.forEach((r) => {
    r.variacionVsOptimista = haOptimista > 0 ? ((r.hectareas - haOptimista) / haOptimista) * 100 : 0;
  });

  const maxHa = Math.max(...resultados.map((r) => r.hectareas), hectareasObjetivo);

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-indigo-100 p-2 rounded-lg"><Leaf size={18} className="text-indigo-700" /></div>
        <h3 className="font-semibold text-gray-800">Escenarios de Calidad de Criba</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        ¿Si la calidad real resulta peor de lo observado en los muestreos, ¿para cuántas hectáreas seguiría alcanzando?
        — Simulación sobre lote Tercera. No modifica los muestreos originales.
      </p>

      {/* Supuesto base */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mb-4 text-xs text-gray-600">
        <span className="font-semibold text-gray-700">Muestreo base lote Tercera: </span>
        Segunda <strong>{resTercera.pctSegunda.toFixed(1)}%</strong> ·
        Tercera <strong>{resTercera.pctTercera.toFixed(1)}%</strong> ·
        Cuarta <strong>{resTercera.pctCuarta.toFixed(1)}%</strong> ·
        Merma <strong>{resTercera.pctMerma.toFixed(1)}%</strong>
        <span className="ml-2 text-gray-400">(usando {kgPorHa.toLocaleString()} kg/ha)</span>
      </div>

      {/* Tarjetas de escenarios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {resultados.map((r) => (
          <div key={r.nombre} className={`rounded-xl border-2 ${r.color.card} p-4 flex flex-col gap-3`}>
            {/* Badge nombre + delta */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${r.color.badge}`}>{r.nombre}</span>
              {r.deltaSegunda > 0 && (
                <span className="text-xs text-gray-500">+{r.deltaSegunda} pp segunda</span>
              )}
            </div>

            {/* Porcentajes simulados */}
            <div className="text-xs space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Segunda (simulada)</span>
                <span className={`font-semibold ${r.deltaSegunda > 0 ? 'text-red-600' : 'text-gray-700'}`}>
                  {r.pctSegundaEfectiva.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tercera (aprovechable)</span>
                <span className="font-semibold text-gray-700">{r.pctTerceraEfectiva.toFixed(1)}%</span>
              </div>
            </div>

            {/* Barra de hectáreas */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Hectáreas posibles</span>
                <span className={`font-bold text-sm ${r.color.text}`}>{r.hectareas.toFixed(1)} ha</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${r.color.bar}`}
                  style={{ width: `${maxHa > 0 ? (r.hectareas / maxHa) * 100 : 0}%` }}
                />
              </div>
              {/* Línea de meta */}
              {maxHa > 0 && (
                <div className="relative h-0 mt-[-6px]">
                  <div
                    className="absolute top-0 w-0.5 h-4 bg-gray-500 opacity-50"
                    style={{ left: `${(hectareasObjetivo / maxHa) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {/* Métricas clave */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/70 rounded-lg p-2">
                <p className="text-gray-400">Arpillas</p>
                <p className={`font-bold ${r.color.text}`}>{Math.round(r.arpillasAprovechables).toLocaleString()}</p>
              </div>
              <div className="bg-white/70 rounded-lg p-2">
                <p className="text-gray-400">Toneladas</p>
                <p className={`font-bold ${r.color.text}`}>{r.toneladas.toFixed(1)}</p>
              </div>
            </div>

            {/* Diferencia vs meta */}
            <div className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
              r.alcanza ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {r.alcanza
                ? `✓ Excedente +${r.diferencia.toFixed(1)} ha`
                : `✗ Déficit ${r.diferencia.toFixed(1)} ha`}
            </div>

            {/* Variación vs optimista */}
            {r.variacionVsOptimista !== 0 && (
              <p className="text-center text-xs text-gray-500">
                {r.variacionVsOptimista.toFixed(1)}% vs Optimista
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Tabla resumen comparativa */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
              <th className="text-left px-3 py-2 rounded-tl-lg">Escenario</th>
              <th className="text-right px-3 py-2">Segunda simulada</th>
              <th className="text-right px-3 py-2">Arpillas aprov.</th>
              <th className="text-right px-3 py-2">Toneladas</th>
              <th className="text-right px-3 py-2">Hectáreas</th>
              <th className="text-right px-3 py-2">Vs meta</th>
              <th className="text-right px-3 py-2 rounded-tr-lg">Vs Optimista</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <tr key={r.nombre} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-3 py-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.color.badge}`}>{r.nombre}</span>
                </td>
                <td className="px-3 py-2 text-right font-mono">{r.pctSegundaEfectiva.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right font-mono">{Math.round(r.arpillasAprovechables).toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono">{r.toneladas.toFixed(1)}</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{r.hectareas.toFixed(1)}</td>
                <td className={`px-3 py-2 text-right font-semibold ${r.alcanza ? 'text-green-600' : 'text-red-600'}`}>
                  {r.alcanza ? '+' : ''}{r.diferencia.toFixed(1)} ha
                </td>
                <td className="px-3 py-2 text-right text-gray-500">
                  {r.variacionVsOptimista === 0 ? '—' : `${r.variacionVsOptimista.toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nota operacional */}
      <p className="mt-3 text-xs text-gray-400 leading-relaxed">
        <strong>Nota:</strong> "Segunda" en este contexto son arpillas que salen del lote de semilla hacia canal comercial.
        Los escenarios Esperado y Conservador añaden +5 y +10 pp de segunda a lo observado en muestreos,
        reduciendo la tercera disponible para siembra.
      </p>
    </Card>
  );
}
