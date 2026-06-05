import { Scissors, TrendingDown } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card } from '../common/Card';
import type { SamplingResultsTercera, SamplingResultsCuarta } from '../../types/sampling';

interface ProyeccionPostCribaProps {
  arpillasTercera: number;
  arpillasCuarta: number;
  resTercera: SamplingResultsTercera;
  resCuarta: SamplingResultsCuarta;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function pct(base: number, p: number) { return base * p / 100; }

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return <span className="text-xs text-gray-400">—</span>;
  const pos = delta > 0;
  return (
    <span className={`text-xs font-semibold ${pos ? 'text-green-600' : 'text-red-600'}`}>
      {pos ? '+' : ''}{delta.toFixed(0)}
    </span>
  );
}

// ─── subcomponents ───────────────────────────────────────────────────────────

interface BarraCalibr {
  label: string;
  valor: number;
  pct: number;
  colorBar: string;
  colorBg: string;
}

function DesgloseConversion({
  titulo, arpillas, filas, borderColor,
}: {
  titulo: string; arpillas: number; filas: BarraCalibr[]; borderColor: string;
}) {
  return (
    <div className={`rounded-xl border-2 ${borderColor} p-4`}>
      <p className="font-semibold text-gray-800 text-sm">{titulo}</p>
      <p className="text-xs text-gray-400 mb-3">Base: <strong>{arpillas.toLocaleString()}</strong> arpillas recibidas</p>
      <div className="space-y-2.5">
        {filas.map((f) => (
          <div key={f.label} className="grid grid-cols-[7rem_1fr_4.5rem_3rem] items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${f.colorBg} w-fit`}>{f.label}</span>
            <div className="bg-gray-100 rounded-full h-3.5 overflow-hidden">
              <div className={`h-3.5 rounded-full ${f.colorBar}`} style={{ width: `${Math.min(f.pct, 100)}%` }} />
            </div>
            <span className="text-right text-xs font-bold text-gray-800">{f.valor.toFixed(0)} arp</span>
            <span className="text-right text-xs text-gray-400">{f.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main component ──────────────────────────────────────────────────────────

export function ProyeccionPostCriba({
  arpillasTercera,
  arpillasCuarta,
  resTercera,
  resCuarta,
}: ProyeccionPostCribaProps) {
  const hasTercera = resTercera.pctSegunda + resTercera.pctTercera + resTercera.pctCuarta + resTercera.pctMerma > 0;
  const hasCuarta  = resCuarta.pctTercera + resCuarta.pctCuarta + resCuarta.pctCuartaChica + resCuarta.pctMerma > 0;

  if (!hasTercera && !hasCuarta) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-100 p-2 rounded-lg"><Scissors size={18} className="text-purple-700" /></div>
          <h3 className="font-semibold text-gray-800">Proyección Post-Criba</h3>
        </div>
        <p className="text-sm text-gray-500">
          Registre muestreos en la pestaña <strong>Muestreos</strong> para ver la proyección post-criba.
        </p>
      </Card>
    );
  }

  // ── Proyección desde lote tercera ─────────────────────────────────────────
  const t_segunda     = hasTercera ? pct(arpillasTercera, resTercera.pctSegunda)  : 0;
  const t_tercera     = hasTercera ? pct(arpillasTercera, resTercera.pctTercera)  : 0;
  const t_cuarta      = hasTercera ? pct(arpillasTercera, resTercera.pctCuarta)   : 0;
  const t_merma       = hasTercera ? pct(arpillasTercera, resTercera.pctMerma)    : 0;

  // ── Proyección desde lote cuarta ─────────────────────────────────────────
  const c_tercera     = hasCuarta  ? pct(arpillasCuarta,  resCuarta.pctTercera)      : 0;
  const c_cuarta      = hasCuarta  ? pct(arpillasCuarta,  resCuarta.pctCuarta)       : 0;
  const c_cuartaChica = hasCuarta  ? pct(arpillasCuarta,  resCuarta.pctCuartaChica)  : 0;
  const c_merma       = hasCuarta  ? pct(arpillasCuarta,  resCuarta.pctMerma)        : 0;

  // ── Totales consolidados post-criba ──────────────────────────────────────
  const total_segunda     = t_segunda;
  const total_tercera     = t_tercera + c_tercera;
  const total_cuarta      = t_cuarta  + c_cuarta;
  const total_cuartaChica = c_cuartaChica;
  const total_merma       = t_merma   + c_merma;

  const totalOriginal  = arpillasTercera + arpillasCuarta;
  const totalSemilla   = total_tercera + total_cuarta + total_cuartaChica; // usable as seed
  const totalNoSemilla = total_segunda + total_merma;                      // not usable

  // ── Comparación original vs proyectado ───────────────────────────────────
  // "original" breakdown: todo lo recibido se clasifica igual que su calibre
  const orig_tercera = arpillasTercera;
  const orig_cuarta  = arpillasCuarta;

  const compareRows = [
    {
      label: 'Segunda',     orig: 0,           proy: total_segunda,
      pct: hasTercera ? resTercera.pctSegunda : 0,
      colorBg: 'bg-yellow-100 text-yellow-800', colorBorder: 'border-yellow-200',
    },
    {
      label: 'Tercera',     orig: orig_tercera, proy: total_tercera,
      pct: hasTercera ? resTercera.pctTercera : 0,
      colorBg: 'bg-green-100 text-green-800',  colorBorder: 'border-green-200',
    },
    {
      label: 'Cuarta',      orig: orig_cuarta,  proy: total_cuarta,
      pct: hasCuarta ? resCuarta.pctCuarta : 0,
      colorBg: 'bg-blue-100 text-blue-800',    colorBorder: 'border-blue-200',
    },
    {
      label: 'Cuarta Chica',orig: 0,            proy: total_cuartaChica,
      pct: hasCuarta ? resCuarta.pctCuartaChica : 0,
      colorBg: 'bg-indigo-100 text-indigo-800',colorBorder: 'border-indigo-200',
    },
    {
      label: 'Merma',       orig: 0,            proy: total_merma,
      pct: (hasTercera ? resTercera.pctMerma : 0),
      colorBg: 'bg-red-100 text-red-800',      colorBorder: 'border-red-200',
    },
  ];

  // ── Chart data ────────────────────────────────────────────────────────────
  const chartData = compareRows.map((r) => ({
    name: r.label,
    Original: Math.round(r.orig),
    Proyectado: Math.round(r.proy),
  }));

  // ── Desglose por lote ─────────────────────────────────────────────────────
  const terceraFilas: BarraCalibr[] = [
    { label: 'Segunda',  valor: t_segunda, pct: resTercera.pctSegunda, colorBar: 'bg-yellow-400', colorBg: 'bg-yellow-100 text-yellow-800' },
    { label: 'Tercera',  valor: t_tercera, pct: resTercera.pctTercera, colorBar: 'bg-green-500',  colorBg: 'bg-green-100 text-green-800'  },
    { label: 'Cuarta',   valor: t_cuarta,  pct: resTercera.pctCuarta,  colorBar: 'bg-blue-400',   colorBg: 'bg-blue-100 text-blue-800'   },
    { label: 'Merma',    valor: t_merma,   pct: resTercera.pctMerma,   colorBar: 'bg-red-400',    colorBg: 'bg-red-100 text-red-800'     },
  ];

  const cuartaFilas: BarraCalibr[] = [
    { label: 'Tercera',      valor: c_tercera,     pct: resCuarta.pctTercera,     colorBar: 'bg-green-500',  colorBg: 'bg-green-100 text-green-800'   },
    { label: 'Cuarta',       valor: c_cuarta,      pct: resCuarta.pctCuarta,      colorBar: 'bg-blue-400',   colorBg: 'bg-blue-100 text-blue-800'     },
    { label: 'Cuarta Chica', valor: c_cuartaChica, pct: resCuarta.pctCuartaChica, colorBar: 'bg-indigo-400', colorBg: 'bg-indigo-100 text-indigo-800' },
    { label: 'Merma',        valor: c_merma,       pct: resCuarta.pctMerma,       colorBar: 'bg-red-400',    colorBg: 'bg-red-100 text-red-800'       },
  ];

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <div className="bg-purple-100 p-2 rounded-lg"><Scissors size={18} className="text-purple-700" /></div>
        <h3 className="font-semibold text-gray-800">Proyección Post-Criba</h3>
      </div>
      <p className="text-xs text-gray-500 mb-5">
        ¿Qué inventario espero tener después de la criba? — aplicando porcentajes de clasificación de los muestreos.
      </p>

      {/* Desglose conversión por lote */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {hasTercera && (
          <DesgloseConversion
            titulo="Lote Tercera → resultado por calibre"
            arpillas={arpillasTercera}
            filas={terceraFilas}
            borderColor="border-green-200 bg-green-50"
          />
        )}
        {hasCuarta && (
          <DesgloseConversion
            titulo="Lote Cuarta → resultado por calibre"
            arpillas={arpillasCuarta}
            filas={cuartaFilas}
            borderColor="border-blue-200 bg-blue-50"
          />
        )}
      </div>

      {/* Tabla comparativa original vs proyectado */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Inventario Original vs Proyectado Post-Criba</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-xs uppercase">
                <th className="text-left px-3 py-2 rounded-tl-lg">Calibre</th>
                <th className="text-right px-3 py-2">Original (arp)</th>
                <th className="text-right px-3 py-2">Proyectado (arp)</th>
                <th className="text-right px-3 py-2">Diferencia</th>
                <th className="text-right px-3 py-2 rounded-tr-lg">% aplicado</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((r, i) => (
                <tr key={r.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.colorBg}`}>
                      {r.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-600">
                    {r.orig > 0 ? r.orig.toFixed(0) : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-gray-800">
                    {r.proy.toFixed(0)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <DeltaBadge delta={r.proy - r.orig} />
                  </td>
                  <td className="px-3 py-2 text-right text-xs text-gray-500">
                    {r.pct > 0 ? `${r.pct.toFixed(1)}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-semibold text-gray-700 text-xs">
                <td className="px-3 py-2 rounded-bl-lg">Total</td>
                <td className="px-3 py-2 text-right font-mono">{totalOriginal.toLocaleString()}</td>
                <td className="px-3 py-2 text-right font-mono">
                  {(total_segunda + total_tercera + total_cuarta + total_cuartaChica + total_merma).toFixed(0)}
                </td>
                <td className="px-3 py-2 text-right" />
                <td className="px-3 py-2 rounded-br-lg" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Gráfica comparativa antes vs después */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Gráfica Comparativa — Antes vs Después de la Criba</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(0)} arp`, '']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="Original"   fill="#94a3b8" radius={[4, 4, 0, 0]} name="Original" />
            <Bar dataKey="Proyectado" fill="#7c3aed" radius={[4, 4, 0, 0]} name="Post-criba" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Resumen ejecutivo */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={16} className="text-purple-600" />
          <p className="text-sm font-semibold text-purple-800">Resumen de Conversión</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-purple-100 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-0.5">Inventario recibido</p>
            <p className="text-xl font-black text-gray-800">{totalOriginal.toLocaleString()}</p>
            <p className="text-xs text-gray-400">arpillas</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-xs text-green-700 mb-0.5">Semilla aprovechable</p>
            <p className="text-xl font-black text-green-800">{totalSemilla.toFixed(0)}</p>
            <p className="text-xs text-green-500">
              {totalOriginal > 0 ? ((totalSemilla / totalOriginal) * 100).toFixed(1) : 0}% del total
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-700 mb-0.5">Segunda (no semilla)</p>
            <p className="text-xl font-black text-yellow-800">{total_segunda.toFixed(0)}</p>
            <p className="text-xs text-yellow-500">
              {totalOriginal > 0 ? ((total_segunda / totalOriginal) * 100).toFixed(1) : 0}% del total
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs text-red-700 mb-0.5">Merma total</p>
            <p className="text-xl font-black text-red-800">{total_merma.toFixed(0)}</p>
            <p className="text-xs text-red-500">
              {totalOriginal > 0 ? ((total_merma / totalOriginal) * 100).toFixed(1) : 0}% del total
            </p>
          </div>
        </div>
        {total_segunda > 0 && totalOriginal > 0 && (total_segunda / totalOriginal) * 100 > 15 && (
          <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded-lg px-3 py-2 text-xs text-yellow-800">
            ⚠ Alta proporción de segunda ({((total_segunda / totalOriginal) * 100).toFixed(1)}%). Revisar calidad del lote de tercera recibido.
          </div>
        )}
        {totalNoSemilla > 0 && totalOriginal > 0 && (
          <p className="mt-2 text-xs text-gray-500 text-right">
            Material no aprovechable como semilla: {totalNoSemilla.toFixed(0)} arpillas ({((totalNoSemilla / totalOriginal) * 100).toFixed(1)}%)
          </p>
        )}
      </div>
    </Card>
  );
}
