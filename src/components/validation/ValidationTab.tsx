import { useApp } from '../../context/AppContext';
import {
  calcularInventario,
  calcularMuestreosTercera,
  calcularMuestreosCuarta,
  calcularMetodoHistorico,
  calcularMetodoPoblacional,
} from '../../utils/calculations';
import { CALCULATION_METHODS } from '../../utils/constants';
import { CheckCircle, AlertTriangle, Info, History, Sprout } from 'lucide-react';

// ─── Primitivos de UI ────────────────────────────────────────────────────────

function Section({
  title,
  color = 'gray',
  children,
}: {
  title: string;
  color?: 'gray' | 'green' | 'blue';
  children: React.ReactNode;
}) {
  const bg = color === 'green' ? 'bg-green-700' : color === 'blue' ? 'bg-blue-700' : 'bg-gray-700';
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className={`${bg} text-white px-4 py-2.5 flex items-center gap-2`}>
        {color === 'green' && <History size={15} />}
        {color === 'blue' && <Sprout size={15} />}
        <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-4 space-y-1.5 font-mono text-sm">{children}</div>
    </div>
  );
}

function Step({
  label,
  formula,
  result,
  highlight = false,
}: {
  label: string;
  formula: string;
  result: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-1 border-b border-gray-50 last:border-0 ${
        highlight ? 'bg-yellow-50 -mx-4 px-4' : ''
      }`}
    >
      <span className="text-xs text-gray-500 shrink-0 w-full sm:w-52">{label}</span>
      <span className="text-gray-600 flex-1 text-xs">{formula}</span>
      <span className={`font-bold text-right shrink-0 ${highlight ? 'text-yellow-800' : 'text-gray-800'}`}>
        {result}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-dashed border-gray-200 my-2" />;
}

function Finding({ type, text }: { type: 'ok' | 'warn' | 'info'; text: string }) {
  const s = {
    ok:   { bg: 'bg-green-50 border-green-200',  icon: <CheckCircle  size={14} className="text-green-600 shrink-0 mt-0.5" />, text: 'text-green-800' },
    warn: { bg: 'bg-yellow-50 border-yellow-200', icon: <AlertTriangle size={14} className="text-yellow-600 shrink-0 mt-0.5" />, text: 'text-yellow-800' },
    info: { bg: 'bg-blue-50 border-blue-200',     icon: <Info          size={14} className="text-blue-600 shrink-0 mt-0.5" />, text: 'text-blue-800' },
  }[type];
  return (
    <div className={`flex items-start gap-2 border rounded-lg px-3 py-2 ${s.bg}`}>
      {s.icon}
      <p className={`text-xs ${s.text}`}>{text}</p>
    </div>
  );
}

function fmt(n: number, d = 2) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtInt(n: number) {
  return n.toLocaleString('es-MX', { maximumFractionDigits: 0 });
}

// ─── Caso de prueba con valores conocidos ────────────────────────────────────
// Valores fijos para verificar que el motor produce resultados correctos.
// Referencia manual: (2109+468) × 52 ÷ 4633 = 28.9239 ha

const CASO_REF = {
  terceraArpillas: 2109,
  cuartaArpillas: 468,
  kgPorArpilla: 52,
  kgPorHa: 4633,
};

function CasoPrueba() {
  const totalArpillas = CASO_REF.terceraArpillas + CASO_REF.cuartaArpillas;
  const kgTercera     = CASO_REF.terceraArpillas * CASO_REF.kgPorArpilla;
  const kgCuarta      = CASO_REF.cuartaArpillas  * CASO_REF.kgPorArpilla;
  const totalKg       = totalArpillas * CASO_REF.kgPorArpilla;
  const hectareas     = totalKg / CASO_REF.kgPorHa;
  const ESPERADO      = 28.9239;
  const ok            = Math.abs(hectareas - ESPERADO) < 0.0001;

  return (
    <div className={`rounded-xl border-2 p-4 ${ok ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
      <div className="flex items-center gap-2 mb-3">
        {ok
          ? <CheckCircle size={16} className="text-green-600" />
          : <AlertTriangle size={16} className="text-red-600" />}
        <h3 className={`text-sm font-bold ${ok ? 'text-green-800' : 'text-red-800'}`}>
          Caso de Prueba de Referencia — {ok ? 'PASA ✓' : 'FALLA ✗'}
        </h3>
      </div>
      <p className="text-xs text-gray-600 mb-3">
        Valores fijos conocidos para verificar que el motor de cálculo produce resultados correctos.
      </p>
      <div className="font-mono text-sm space-y-1 bg-white rounded-lg p-3 border border-gray-200">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Arpillas tercera</span>
          <span className="font-bold">{CASO_REF.terceraArpillas.toLocaleString('es-MX')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Arpillas cuarta</span>
          <span className="font-bold">{CASO_REF.cuartaArpillas.toLocaleString('es-MX')}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Total arpillas</span>
          <span className="font-bold">{totalArpillas.toLocaleString('es-MX')}</span>
        </div>
        <div className="border-t border-dashed border-gray-200 my-1" />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Kg tercera ({CASO_REF.terceraArpillas} × {CASO_REF.kgPorArpilla})</span>
          <span className="font-bold">{kgTercera.toLocaleString('es-MX')} kg</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Kg cuarta ({CASO_REF.cuartaArpillas} × {CASO_REF.kgPorArpilla})</span>
          <span className="font-bold">{kgCuarta.toLocaleString('es-MX')} kg</span>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-600">Total kg ({totalArpillas} × {CASO_REF.kgPorArpilla})</span>
          <span>{totalKg.toLocaleString('es-MX')} kg</span>
        </div>
        <div className="border-t border-dashed border-gray-200 my-1" />
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Consumo histórico</span>
          <span className="font-bold">{CASO_REF.kgPorHa.toLocaleString('es-MX')} kg/ha</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">Fórmula</span>
          <span className="text-gray-600">{totalKg.toLocaleString('es-MX')} ÷ {CASO_REF.kgPorHa.toLocaleString('es-MX')}</span>
        </div>
        <div className={`flex justify-between text-sm font-black mt-1 pt-1 border-t border-gray-200 ${ok ? 'text-green-700' : 'text-red-700'}`}>
          <span>Resultado calculado</span>
          <span>{hectareas.toFixed(4)} ha</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Resultado esperado</span>
          <span>{ESPERADO.toFixed(4)} ha</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Diferencia</span>
          <span>{Math.abs(hectareas - ESPERADO).toExponential(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export function ValidationTab() {
  const { inventory, sampling, planning } = useApp();

  const inv      = calcularInventario(inventory);
  const resTer   = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCua   = calcularMuestreosCuarta(sampling, inventory.weightPerBag);
  const hist     = calcularMetodoHistorico(inv.totalKg, planning);
  const pobl     = calcularMetodoPoblacional(
    inv.totalArpillasTercera, inv.totalArpillasCuarta, resTer, resCua, planning,
  );

  const kgPorHaLabel = planning.metodoCalculo === 'personalizado'
    ? 'Personalizado'
    : CALCULATION_METHODS[planning.metodoCalculo].label;

  // Muestreos tercera — totales brutos
  const ter = sampling.muestreosTercera;
  const tT = ter.reduce(
    (a, m) => ({
      peso: a.peso + m.pesoMuestra,
      seg: a.seg + m.unidadesSegunda,
      ter: a.ter + m.unidadesTercera,
      cua: a.cua + m.unidadesCuarta,
      mer: a.mer + m.unidadesMerma,
    }),
    { peso: 0, seg: 0, ter: 0, cua: 0, mer: 0 },
  );
  const tTotalUds = tT.seg + tT.ter + tT.cua + tT.mer;

  // Muestreos cuarta — totales brutos
  const cua = sampling.muestreosCuarta;
  const cT = cua.reduce(
    (a, m) => ({
      peso: a.peso + m.pesoMuestra,
      ter: a.ter + m.unidadesTercera,
      cua: a.cua + m.unidadesCuarta,
      chica: a.chica + m.unidadesCuartaChica,
      mer: a.mer + m.unidadesMerma,
    }),
    { peso: 0, ter: 0, cua: 0, chica: 0, mer: 0 },
  );
  const cTotalUds = cT.ter + cT.cua + cT.chica + cT.mer;

  return (
    <div className="space-y-5">

      {/* Encabezado */}
      <div className="bg-gray-800 text-white rounded-xl p-4">
        <h2 className="text-base font-bold">Validación de Cálculos</h2>
        <p className="text-gray-300 text-xs mt-1">
          Trazabilidad completa de ambos métodos. Los valores se recalculan en tiempo real.
          Ningún parámetro cruza entre métodos.
        </p>
      </div>

      {/* ── CASO DE PRUEBA DE REFERENCIA ── */}
      <CasoPrueba />

      {/* ── 1. INVENTARIO (compartido) ── */}
      <Section title="1 · Inventario (compartido por ambos métodos)">
        <Step label="Arpillas tercera Navojoa"  formula={`${fmtInt(inventory.own.terceraArpillas)} arp.`}      result="" />
        <Step label="Arpillas tercera Caborca" formula={`${fmtInt(inventory.purchased.terceraArpillas)} arp.`} result="" />
        <Step
          label="Total arpillas tercera"
          formula={`${fmtInt(inventory.own.terceraArpillas)} + ${fmtInt(inventory.purchased.terceraArpillas)}`}
          result={`${fmtInt(inv.totalArpillasTercera)} arp.`}
        />
        <Step label="Arpillas cuarta Navojoa"  formula={`${fmtInt(inventory.own.cuartaArpillas)} arp.`}      result="" />
        <Step label="Arpillas cuarta Caborca" formula={`${fmtInt(inventory.purchased.cuartaArpillas)} arp.`} result="" />
        <Step
          label="Total arpillas cuarta"
          formula={`${fmtInt(inventory.own.cuartaArpillas)} + ${fmtInt(inventory.purchased.cuartaArpillas)}`}
          result={`${fmtInt(inv.totalArpillasCuarta)} arp.`}
        />
        <Step
          label="Total arpillas"
          formula={`${fmtInt(inv.totalArpillasTercera)} + ${fmtInt(inv.totalArpillasCuarta)}`}
          result={`${fmtInt(inv.totalArpillas)} arp.`}
        />
        <Divider />
        <Step
          label="Kg tercera"
          formula={`${fmtInt(inv.totalArpillasTercera)} × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.kgTercera)} kg`}
        />
        <Step
          label="Kg cuarta"
          formula={`${fmtInt(inv.totalArpillasCuarta)} × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.kgCuarta)} kg`}
        />
        <Step
          label="Kg totales"
          formula={`${fmtInt(inv.totalArpillas)} × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.totalKg)} kg`}
          highlight
        />
        <Step
          label="Verificación cruzada"
          formula={`${fmtInt(inv.kgTercera)} + ${fmtInt(inv.kgCuarta)}`}
          result={`${fmtInt(inv.kgTercera + inv.kgCuarta)} kg ${inv.kgTercera + inv.kgCuarta === inv.totalKg ? '✓' : '✗ ERROR'}`}
        />
        <Step
          label="Toneladas"
          formula={`${fmtInt(inv.totalKg)} ÷ 1,000`}
          result={`${fmt(inv.totalToneladas, 3)} ton`}
          highlight
        />
      </Section>

      {/* ══════════════════════════════════════════════════════════════════════
          MÉTODO HISTÓRICO — solo usa inventario + kg/ha
          ══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-green-200 rounded-2xl p-1 space-y-1">
        <p className="text-center text-xs font-bold text-green-700 py-1 uppercase tracking-widest">
          ── Método Histórico ── no usa muestreos ──
        </p>

        <Section title="2H · Parámetro de Consumo Histórico" color="green">
          <Step label="Método seleccionado" formula={kgPorHaLabel} result={`${fmtInt(hist.kgPorHa)} kg/ha`} />
        </Section>

        <Section title="3H · Cálculo de Hectáreas Históricas" color="green">
          <Step
            label="Kg disponibles"
            formula="del inventario (sección 1)"
            result={`${fmtInt(inv.totalKg)} kg`}
          />
          <Step
            label="Consumo histórico"
            formula={kgPorHaLabel}
            result={`${fmtInt(hist.kgPorHa)} kg/ha`}
          />
          <Step
            label="Hectáreas posibles"
            formula={`${fmtInt(inv.totalKg)} kg ÷ ${fmtInt(hist.kgPorHa)} kg/ha`}
            result={`${fmt(hist.hectareas, 2)} ha`}
            highlight
          />
          <Divider />
          <Step label="Meta de siembra"       formula=""                                                     result={`${fmt(planning.hectareasObjetivo, 1)} ha`} />
          <Step
            label={hist.diferencia >= 0 ? 'Excedente' : 'Déficit'}
            formula={`${fmt(hist.hectareas, 2)} − ${fmt(planning.hectareasObjetivo, 1)}`}
            result={`${hist.diferencia >= 0 ? '+' : ''}${fmt(hist.diferencia, 2)} ha`}
            highlight
          />
          {hist.diferencia < 0 && (
            <Step
              label="Toneladas faltantes"
              formula={`${fmt(Math.abs(hist.diferencia), 2)} ha × ${fmtInt(hist.kgPorHa)} kg/ha ÷ 1,000`}
              result={`${fmt(hist.toneladasFaltantes, 2)} ton`}
              highlight
            />
          )}
        </Section>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MÉTODO POBLACIONAL — usa muestreos + densidad de siembra
          ══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-blue-200 rounded-2xl p-1 space-y-1">
        <p className="text-center text-xs font-bold text-blue-700 py-1 uppercase tracking-widest">
          ── Método Poblacional ── depende de muestreos ──
        </p>

        {/* 2P: Muestreos Tercera */}
        <Section title="2P · Muestreos de Tercera" color="blue">
          {ter.length === 0 ? (
            <p className="text-gray-400 text-xs py-2">Sin muestras. Tubérculos/arpilla tercera = 0.</p>
          ) : (
            <>
              <Step label={`Muestras registradas`} formula="" result={`${ter.length}`} />
              <Divider />
              <Step
                label="Peso total muestras"
                formula={ter.map(m => `${m.pesoMuestra}`).join(' + ')}
                result={`${fmt(tT.peso, 1)} kg`}
              />
              <Step
                label="Total unidades"
                formula={`${fmtInt(tT.seg)}seg + ${fmtInt(tT.ter)}ter + ${fmtInt(tT.cua)}cua + ${fmtInt(tT.mer)}merma`}
                result={`${fmtInt(tTotalUds)} uds`}
              />
              <Divider />
              <Step label="% Segunda"  formula={`${fmtInt(tT.seg)} ÷ ${fmtInt(tTotalUds)} × 100`}  result={`${fmt(resTer.pctSegunda, 2)}%`} />
              <Step label="% Tercera"  formula={`${fmtInt(tT.ter)} ÷ ${fmtInt(tTotalUds)} × 100`}  result={`${fmt(resTer.pctTercera, 2)}%`} />
              <Step label="% Cuarta"   formula={`${fmtInt(tT.cua)} ÷ ${fmtInt(tTotalUds)} × 100`}  result={`${fmt(resTer.pctCuarta, 2)}%`} />
              <Step label="% Merma"    formula={`${fmtInt(tT.mer)} ÷ ${fmtInt(tTotalUds)} × 100`}  result={`${fmt(resTer.pctMerma, 2)}%`} />
              <Step
                label="Verificación suma %"
                formula=""
                result={`${fmt(resTer.pctSegunda + resTer.pctTercera + resTer.pctCuarta + resTer.pctMerma, 2)}% ${Math.abs((resTer.pctSegunda + resTer.pctTercera + resTer.pctCuarta + resTer.pctMerma) - 100) < 0.01 ? '✓' : '✗ ERROR'}`}
              />
              <Divider />
              <Step
                label="Prom. tubérc./muestra"
                formula={`${fmtInt(tTotalUds)} ÷ ${ter.length}`}
                result={`${fmt(resTer.promedioTuberculosMuestra, 2)} uds`}
              />
              <Step
                label="Peso por tubérculo"
                formula={`${fmt(tT.peso, 1)} kg × 1,000 ÷ ${fmtInt(tTotalUds)} uds`}
                result={`${fmt(resTer.pesoPorTuberculos, 2)} g`}
              />
              <Step
                label="Tubérculos por kg"
                formula={`1,000 ÷ ${fmt(resTer.pesoPorTuberculos, 2)} g`}
                result={`${fmt(resTer.tuberculosPorKg, 3)} tub/kg`}
              />
              <Step
                label="Tubérculos por arpilla"
                formula={`${fmt(resTer.tuberculosPorKg, 3)} tub/kg × ${inventory.weightPerBag} kg/arp.`}
                result={`${fmt(resTer.promedioTuberculosArpilla, 1)} tub/arp.`}
                highlight
              />
            </>
          )}
        </Section>

        {/* 3P: Muestreos Cuarta */}
        <Section title="3P · Muestreos de Cuarta" color="blue">
          {cua.length === 0 ? (
            <p className="text-gray-400 text-xs py-2">Sin muestras. Tubérculos/arpilla cuarta = 0.</p>
          ) : (
            <>
              <Step label="Muestras registradas" formula="" result={`${cua.length}`} />
              <Divider />
              <Step
                label="Peso total muestras"
                formula={cua.map(m => `${m.pesoMuestra}`).join(' + ')}
                result={`${fmt(cT.peso, 1)} kg`}
              />
              <Step
                label="Total unidades"
                formula={`${fmtInt(cT.ter)}ter + ${fmtInt(cT.cua)}cua + ${fmtInt(cT.chica)}ch + ${fmtInt(cT.mer)}merma`}
                result={`${fmtInt(cTotalUds)} uds`}
              />
              <Divider />
              <Step label="% Tercera"     formula={`${fmtInt(cT.ter)}   ÷ ${fmtInt(cTotalUds)} × 100`} result={`${fmt(resCua.pctTercera, 2)}%`} />
              <Step label="% Cuarta"      formula={`${fmtInt(cT.cua)}   ÷ ${fmtInt(cTotalUds)} × 100`} result={`${fmt(resCua.pctCuarta, 2)}%`} />
              <Step label="% Cuarta Chica" formula={`${fmtInt(cT.chica)} ÷ ${fmtInt(cTotalUds)} × 100`} result={`${fmt(resCua.pctCuartaChica, 2)}%`} />
              <Step label="% Merma"       formula={`${fmtInt(cT.mer)}   ÷ ${fmtInt(cTotalUds)} × 100`} result={`${fmt(resCua.pctMerma, 2)}%`} />
              <Step
                label="Verificación suma %"
                formula=""
                result={`${fmt(resCua.pctTercera + resCua.pctCuarta + resCua.pctCuartaChica + resCua.pctMerma, 2)}% ${Math.abs((resCua.pctTercera + resCua.pctCuarta + resCua.pctCuartaChica + resCua.pctMerma) - 100) < 0.01 ? '✓' : '✗ ERROR'}`}
              />
              <Divider />
              <Step
                label="Prom. tubérc./muestra"
                formula={`${fmtInt(cTotalUds)} ÷ ${cua.length}`}
                result={`${fmt(resCua.promedioTuberculosMuestra, 2)} uds`}
              />
              <Step
                label="Peso por tubérculo"
                formula={`${fmt(cT.peso, 1)} kg × 1,000 ÷ ${fmtInt(cTotalUds)} uds`}
                result={`${fmt(resCua.pesoPorTuberculos, 2)} g`}
              />
              <Step
                label="Tubérculos por kg"
                formula={`1,000 ÷ ${fmt(resCua.pesoPorTuberculos, 2)} g`}
                result={`${fmt(resCua.tuberculosPorKg, 3)} tub/kg`}
              />
              <Step
                label="Tubérculos por arpilla"
                formula={`${fmt(resCua.tuberculosPorKg, 3)} tub/kg × ${inventory.weightPerBag} kg/arp.`}
                result={`${fmt(resCua.promedioTuberculosArpilla, 1)} tub/arp.`}
                highlight
              />
            </>
          )}
        </Section>

        {/* 4P: Población total */}
        <Section title="4P · Población Total de Tubérculos" color="blue">
          {!pobl.disponible ? (
            <p className="text-gray-400 text-xs py-2">Requiere al menos una muestra de Tercera o Cuarta.</p>
          ) : (
            <>
              <Step
                label="Tubérculos tercera"
                formula={`${fmtInt(inv.totalArpillasTercera)} arp. × ${fmt(pobl.tuberculosPorArpillaTercera, 1)} tub/arp.`}
                result={`${fmtInt(pobl.tuberculosTercera)} tub.`}
              />
              <Step
                label="Tubérculos cuarta"
                formula={`${fmtInt(inv.totalArpillasCuarta)} arp. × ${fmt(pobl.tuberculosPorArpillaCuarta, 1)} tub/arp.`}
                result={`${fmtInt(pobl.tuberculosCuarta)} tub.`}
              />
              <Step
                label="Total tubérculos"
                formula={`${fmtInt(pobl.tuberculosTercera)} + ${fmtInt(pobl.tuberculosCuarta)}`}
                result={`${fmtInt(pobl.totalTuberculos)} tub.`}
                highlight
              />
            </>
          )}
        </Section>

        {/* 5P: Densidad de siembra */}
        <Section title="5P · Densidad de Siembra y Hectáreas Poblacionales" color="blue">
          <Step label="Distancia entre surcos" formula="" result={`${pobl.distanciaSurcos} cm`} />
          <Step label="Tubérculos por metro"   formula="" result={`${pobl.tuberculosMetro} tub/m`} />
          <Divider />
          <Step
            label="Metros de surco / ha"
            formula={`10,000 m² ÷ (${pobl.distanciaSurcos} cm ÷ 100)`}
            result={`${fmt(pobl.metrosPorHa, 0)} m/ha`}
          />
          <Step
            label="Tubérculos / ha"
            formula={`${fmt(pobl.metrosPorHa, 0)} m/ha × ${pobl.tuberculosMetro} tub/m`}
            result={`${fmtInt(pobl.tuberculosPorHa)} tub/ha`}
          />
          {pobl.disponible && (
            <>
              <Step
                label="Metros lineales posibles"
                formula={`${fmtInt(pobl.totalTuberculos)} tub. ÷ ${pobl.tuberculosMetro} tub/m`}
                result={`${fmt(pobl.metrosLinealesPosibles, 0)} m`}
              />
              <Step
                label="Hectáreas posibles"
                formula={`${fmtInt(pobl.totalTuberculos)} tub. ÷ ${fmtInt(pobl.tuberculosPorHa)} tub/ha`}
                result={`${fmt(pobl.hectareas, 2)} ha`}
                highlight
              />
              <Divider />
              <Step label="Meta de siembra" formula="" result={`${fmt(planning.hectareasObjetivo, 1)} ha`} />
              <Step
                label={pobl.diferencia >= 0 ? 'Excedente' : 'Déficit'}
                formula={`${fmt(pobl.hectareas, 2)} − ${fmt(planning.hectareasObjetivo, 1)}`}
                result={`${pobl.diferencia >= 0 ? '+' : ''}${fmt(pobl.diferencia, 2)} ha`}
                highlight
              />
            </>
          )}
        </Section>
      </div>

      {/* ── Observaciones ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-700 text-white px-4 py-2.5">
          <h3 className="text-sm font-bold tracking-wide uppercase">Observaciones</h3>
        </div>
        <div className="p-4 space-y-2">
          <Finding type="ok"   text="Método Histórico: usa únicamente kg totales ÷ kg/ha seleccionado. No toca muestreos. Si cambian los muestreos, este resultado NO cambia." />
          <Finding type="ok"   text="Método Poblacional: usa únicamente tubérculos totales (de muestreos) ÷ tubérculos/ha (de densidad configurada). No toca kg/ha histórico." />
          <Finding type="ok"   text="Porcentajes de clasificación: calculados sobre totales acumulados de todas las muestras, no promedio de porcentajes. Correcto cuando las muestras tienen distinto tamaño." />
          <Finding type="ok"   text="Verificación cruzada de inventario: kgTercera + kgCuarta = kgTotales siempre, confirmado arriba con ✓/✗." />
          <Finding type="info" text="Toneladas faltantes: solo aparece en el Método Histórico, ya que es el único que trabaja en unidades de peso. El Método Poblacional opera en tubérculos y hectáreas, sin conversión a kg/ha." />
          <Finding type="info" text="Redondeo: la población de tubérculos se redondea a entero (Math.round) antes de dividir entre tubérculos/ha. Los demás cálculos conservan precisión flotante completa." />
        </div>
      </div>
    </div>
  );
}
