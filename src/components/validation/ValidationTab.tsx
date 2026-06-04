import { useApp } from '../../context/AppContext';
import { calcularInventario, calcularMuestreosTercera, calcularMuestreosCuarta } from '../../utils/calculations';
import { CALCULATION_METHODS } from '../../utils/constants';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-700 text-white px-4 py-2.5">
        <h3 className="text-sm font-bold tracking-wide uppercase">{title}</h3>
      </div>
      <div className="p-4 space-y-1.5 font-mono text-sm">{children}</div>
    </div>
  );
}

function Step({ label, formula, result, highlight = false }: {
  label: string;
  formula: string;
  result: string;
  highlight?: boolean;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 py-1 border-b border-gray-50 last:border-0 ${highlight ? 'bg-green-50 -mx-4 px-4 rounded' : ''}`}>
      <span className="text-xs text-gray-500 shrink-0 w-full sm:w-48">{label}</span>
      <span className="text-gray-600 flex-1 text-xs">{formula}</span>
      <span className={`font-bold text-right shrink-0 ${highlight ? 'text-green-700' : 'text-gray-800'}`}>{result}</span>
    </div>
  );
}

function Finding({ type, text }: { type: 'ok' | 'warn' | 'info'; text: string }) {
  const styles = {
    ok: { bg: 'bg-green-50 border-green-200', icon: <CheckCircle size={15} className="text-green-600 shrink-0 mt-0.5" />, text: 'text-green-800' },
    warn: { bg: 'bg-yellow-50 border-yellow-200', icon: <AlertTriangle size={15} className="text-yellow-600 shrink-0 mt-0.5" />, text: 'text-yellow-800' },
    info: { bg: 'bg-blue-50 border-blue-200', icon: <Info size={15} className="text-blue-600 shrink-0 mt-0.5" />, text: 'text-blue-800' },
  };
  const s = styles[type];
  return (
    <div className={`flex items-start gap-2 border rounded-lg px-3 py-2 ${s.bg}`}>
      {s.icon}
      <p className={`text-xs ${s.text}`}>{text}</p>
    </div>
  );
}

function fmt(n: number, decimals = 2) {
  return n.toLocaleString('es-MX', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtInt(n: number) {
  return n.toLocaleString('es-MX', { maximumFractionDigits: 0 });
}

export function ValidationTab() {
  const { inventory, sampling, planning } = useApp();

  const inv = calcularInventario(inventory);
  const resTer = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCua = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  const hasTercera = sampling.muestreosTercera.length > 0;
  const hasCuarta = sampling.muestreosCuarta.length > 0;

  const kgPorHaUsado = planning.metodoCalculo === 'personalizado'
    ? planning.kgHaPersonalizado
    : CALCULATION_METHODS[planning.metodoCalculo].kgHa;

  const metodLabel = planning.metodoCalculo === 'personalizado'
    ? 'Personalizado'
    : CALCULATION_METHODS[planning.metodoCalculo].label;

  const hectareasCapacidad = kgPorHaUsado > 0 ? inv.totalKg / kgPorHaUsado : 0;
  const metrosPorHa = 10000 / (planning.distanciaSurcos / 100);
  const tuberculosPorHa = metrosPorHa * planning.tuberculosMetro;
  const hectareasPorDensidad = tuberculosPorHa > 0
    ? (resTer.promedioTuberculosArpilla * inv.totalArpillasTercera + resCua.promedioTuberculosArpilla * inv.totalArpillasCuarta) / tuberculosPorHa
    : 0;

  const hectareasFinales = planning.usarTuberculosMetro ? hectareasPorDensidad : hectareasCapacidad;
  const diferencia = hectareasFinales - planning.hectareasObjetivo;
  const toneladasFaltantes = diferencia >= 0 ? 0 : Math.abs(diferencia) * kgPorHaUsado / 1000;

  const totalTuberculos = Math.round(inv.totalArpillasTercera * resTer.promedioTuberculosArpilla)
    + Math.round(inv.totalArpillasCuarta * resCua.promedioTuberculosArpilla);

  // Muestreos Tercera raw totals
  const ter = sampling.muestreosTercera;
  const terTotals = ter.reduce(
    (a, m) => ({
      peso: a.peso + m.pesoMuestra,
      seg: a.seg + m.unidadesSegunda,
      ter: a.ter + m.unidadesTercera,
      cua: a.cua + m.unidadesCuarta,
      mer: a.mer + m.unidadesMerma,
    }),
    { peso: 0, seg: 0, ter: 0, cua: 0, mer: 0 },
  );
  const terTotalUds = terTotals.seg + terTotals.ter + terTotals.cua + terTotals.mer;

  // Muestreos Cuarta raw totals
  const cua = sampling.muestreosCuarta;
  const cuaTotals = cua.reduce(
    (a, m) => ({
      peso: a.peso + m.pesoMuestra,
      ter: a.ter + m.unidadesTercera,
      cua: a.cua + m.unidadesCuarta,
      chica: a.chica + m.unidadesCuartaChica,
      mer: a.mer + m.unidadesMerma,
    }),
    { peso: 0, ter: 0, cua: 0, chica: 0, mer: 0 },
  );
  const cuaTotalUds = cuaTotals.ter + cuaTotals.cua + cuaTotals.chica + cuaTotals.mer;

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 text-white rounded-xl p-4">
        <h2 className="text-base font-bold">Validación de Cálculos</h2>
        <p className="text-gray-300 text-xs mt-1">
          Trazabilidad paso a paso de todos los resultados usando los datos actuales.
          Los valores se recalculan en tiempo real cada vez que modifica el inventario, muestreos o planeación.
        </p>
      </div>

      {/* ── SECCIÓN 1: INVENTARIO ── */}
      <Section title="1 · Inventario">
        <Step label="Terceras propias" formula={`${fmtInt(inventory.own.terceraArpillas)} arp.`} result="" />
        <Step label="Terceras compradas" formula={`${fmtInt(inventory.purchased.terceraArpillas)} arp.`} result="" />
        <Step
          label="Total arpillas tercera"
          formula={`${fmtInt(inventory.own.terceraArpillas)} + ${fmtInt(inventory.purchased.terceraArpillas)}`}
          result={`${fmtInt(inv.totalArpillasTercera)} arp.`}
        />
        <Step label="Cuartas propias" formula={`${fmtInt(inventory.own.cuartaArpillas)} arp.`} result="" />
        <Step label="Cuartas compradas" formula={`${fmtInt(inventory.purchased.cuartaArpillas)} arp.`} result="" />
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
        <Step
          label="Kg de tercera"
          formula={`${fmtInt(inv.totalArpillasTercera)} arp. × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.kgTercera)} kg`}
        />
        <Step
          label="Kg de cuarta"
          formula={`${fmtInt(inv.totalArpillasCuarta)} arp. × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.kgCuarta)} kg`}
        />
        <Step
          label="Kg totales"
          formula={`${fmtInt(inv.totalArpillas)} arp. × ${inventory.weightPerBag} kg/arp.`}
          result={`${fmtInt(inv.totalKg)} kg`}
          highlight
        />
        <Step
          label="Verificación kg totales"
          formula={`${fmtInt(inv.kgTercera)} + ${fmtInt(inv.kgCuarta)}`}
          result={`${fmtInt(inv.kgTercera + inv.kgCuarta)} kg ${inv.kgTercera + inv.kgCuarta === inv.totalKg ? '✓' : '✗ ERROR'}`}
        />
        <Step
          label="Toneladas totales"
          formula={`${fmtInt(inv.totalKg)} kg ÷ 1,000`}
          result={`${fmt(inv.totalToneladas, 3)} ton`}
          highlight
        />
      </Section>

      {/* ── SECCIÓN 2: MUESTREOS TERCERA ── */}
      <Section title="2 · Muestreos de Tercera">
        {!hasTercera ? (
          <p className="text-gray-400 text-xs py-2">Sin muestras registradas.</p>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-2">{ter.length} muestra(s) registrada(s)</div>

            <Step
              label="Peso total muestras"
              formula={ter.map(m => `${m.pesoMuestra}`).join(' + ')}
              result={`${fmt(terTotals.peso, 1)} kg`}
            />
            <Step
              label="Total unidades segunda"
              formula={ter.map(m => `${m.unidadesSegunda}`).join(' + ')}
              result={`${fmtInt(terTotals.seg)} uds`}
            />
            <Step
              label="Total unidades tercera"
              formula={ter.map(m => `${m.unidadesTercera}`).join(' + ')}
              result={`${fmtInt(terTotals.ter)} uds`}
            />
            <Step
              label="Total unidades cuarta"
              formula={ter.map(m => `${m.unidadesCuarta}`).join(' + ')}
              result={`${fmtInt(terTotals.cua)} uds`}
            />
            <Step
              label="Total unidades merma"
              formula={ter.map(m => `${m.unidadesMerma}`).join(' + ')}
              result={`${fmtInt(terTotals.mer)} uds`}
            />
            <Step
              label="Total unidades"
              formula={`${fmtInt(terTotals.seg)} + ${fmtInt(terTotals.ter)} + ${fmtInt(terTotals.cua)} + ${fmtInt(terTotals.mer)}`}
              result={`${fmtInt(terTotalUds)} uds`}
            />

            <div className="border-t border-dashed border-gray-200 my-2" />

            <Step
              label="% Segunda"
              formula={`${fmtInt(terTotals.seg)} ÷ ${fmtInt(terTotalUds)} × 100`}
              result={`${fmt(resTer.pctSegunda, 2)}%`}
            />
            <Step
              label="% Tercera"
              formula={`${fmtInt(terTotals.ter)} ÷ ${fmtInt(terTotalUds)} × 100`}
              result={`${fmt(resTer.pctTercera, 2)}%`}
            />
            <Step
              label="% Cuarta"
              formula={`${fmtInt(terTotals.cua)} ÷ ${fmtInt(terTotalUds)} × 100`}
              result={`${fmt(resTer.pctCuarta, 2)}%`}
            />
            <Step
              label="% Merma"
              formula={`${fmtInt(terTotals.mer)} ÷ ${fmtInt(terTotalUds)} × 100`}
              result={`${fmt(resTer.pctMerma, 2)}%`}
            />
            <Step
              label="Verificación suma %"
              formula={`${fmt(resTer.pctSegunda, 2)} + ${fmt(resTer.pctTercera, 2)} + ${fmt(resTer.pctCuarta, 2)} + ${fmt(resTer.pctMerma, 2)}`}
              result={`${fmt(resTer.pctSegunda + resTer.pctTercera + resTer.pctCuarta + resTer.pctMerma, 2)}% ${Math.abs((resTer.pctSegunda + resTer.pctTercera + resTer.pctCuarta + resTer.pctMerma) - 100) < 0.01 ? '✓' : '✗ ERROR'}`}
            />

            <div className="border-t border-dashed border-gray-200 my-2" />

            <Step
              label="Promedio tubérc./muestra"
              formula={`${fmtInt(terTotalUds)} uds ÷ ${ter.length} muestras`}
              result={`${fmt(resTer.promedioTuberculosMuestra, 2)} uds`}
            />
            <Step
              label="Promedio peso/muestra"
              formula={`${fmt(terTotals.peso, 1)} kg ÷ ${ter.length} muestras`}
              result={`${fmt(terTotals.peso / ter.length, 4)} kg`}
            />
            <Step
              label="Peso por tubérculo"
              formula={`(${fmt(terTotals.peso / ter.length, 4)} kg ÷ ${fmt(resTer.promedioTuberculosMuestra, 2)} uds) × 1,000`}
              result={`${fmt(resTer.pesoPorTuberculos, 2)} g`}
            />
            <Step
              label="Equivalencia directa"
              formula={`${fmt(terTotals.peso, 1)} kg × 1,000 ÷ ${fmtInt(terTotalUds)} uds`}
              result={`${fmt(terTotals.peso * 1000 / terTotalUds, 2)} g ✓ misma fórmula`}
            />
            <Step
              label="Tubérculos por kg"
              formula={`1,000 g ÷ ${fmt(resTer.pesoPorTuberculos, 2)} g/tub.`}
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

      {/* ── SECCIÓN 3: MUESTREOS CUARTA ── */}
      <Section title="3 · Muestreos de Cuarta">
        {!hasCuarta ? (
          <p className="text-gray-400 text-xs py-2">Sin muestras registradas.</p>
        ) : (
          <>
            <div className="text-xs text-gray-500 mb-2">{cua.length} muestra(s) registrada(s)</div>

            <Step
              label="Peso total muestras"
              formula={cua.map(m => `${m.pesoMuestra}`).join(' + ')}
              result={`${fmt(cuaTotals.peso, 1)} kg`}
            />
            <Step
              label="Total unidades tercera"
              formula={cua.map(m => `${m.unidadesTercera}`).join(' + ')}
              result={`${fmtInt(cuaTotals.ter)} uds`}
            />
            <Step
              label="Total unidades cuarta"
              formula={cua.map(m => `${m.unidadesCuarta}`).join(' + ')}
              result={`${fmtInt(cuaTotals.cua)} uds`}
            />
            <Step
              label="Total unidades cuarta chica"
              formula={cua.map(m => `${m.unidadesCuartaChica}`).join(' + ')}
              result={`${fmtInt(cuaTotals.chica)} uds`}
            />
            <Step
              label="Total unidades merma"
              formula={cua.map(m => `${m.unidadesMerma}`).join(' + ')}
              result={`${fmtInt(cuaTotals.mer)} uds`}
            />
            <Step
              label="Total unidades"
              formula={`${fmtInt(cuaTotals.ter)} + ${fmtInt(cuaTotals.cua)} + ${fmtInt(cuaTotals.chica)} + ${fmtInt(cuaTotals.mer)}`}
              result={`${fmtInt(cuaTotalUds)} uds`}
            />

            <div className="border-t border-dashed border-gray-200 my-2" />

            <Step
              label="% Tercera"
              formula={`${fmtInt(cuaTotals.ter)} ÷ ${fmtInt(cuaTotalUds)} × 100`}
              result={`${fmt(resCua.pctTercera, 2)}%`}
            />
            <Step
              label="% Cuarta"
              formula={`${fmtInt(cuaTotals.cua)} ÷ ${fmtInt(cuaTotalUds)} × 100`}
              result={`${fmt(resCua.pctCuarta, 2)}%`}
            />
            <Step
              label="% Cuarta Chica"
              formula={`${fmtInt(cuaTotals.chica)} ÷ ${fmtInt(cuaTotalUds)} × 100`}
              result={`${fmt(resCua.pctCuartaChica, 2)}%`}
            />
            <Step
              label="% Merma"
              formula={`${fmtInt(cuaTotals.mer)} ÷ ${fmtInt(cuaTotalUds)} × 100`}
              result={`${fmt(resCua.pctMerma, 2)}%`}
            />
            <Step
              label="Verificación suma %"
              formula={`${fmt(resCua.pctTercera, 2)} + ${fmt(resCua.pctCuarta, 2)} + ${fmt(resCua.pctCuartaChica, 2)} + ${fmt(resCua.pctMerma, 2)}`}
              result={`${fmt(resCua.pctTercera + resCua.pctCuarta + resCua.pctCuartaChica + resCua.pctMerma, 2)}% ${Math.abs((resCua.pctTercera + resCua.pctCuarta + resCua.pctCuartaChica + resCua.pctMerma) - 100) < 0.01 ? '✓' : '✗ ERROR'}`}
            />

            <div className="border-t border-dashed border-gray-200 my-2" />

            <Step
              label="Promedio tubérc./muestra"
              formula={`${fmtInt(cuaTotalUds)} uds ÷ ${cua.length} muestras`}
              result={`${fmt(resCua.promedioTuberculosMuestra, 2)} uds`}
            />
            <Step
              label="Promedio peso/muestra"
              formula={`${fmt(cuaTotals.peso, 1)} kg ÷ ${cua.length} muestras`}
              result={`${fmt(cuaTotals.peso / cua.length, 4)} kg`}
            />
            <Step
              label="Peso por tubérculo"
              formula={`(${fmt(cuaTotals.peso / cua.length, 4)} kg ÷ ${fmt(resCua.promedioTuberculosMuestra, 2)} uds) × 1,000`}
              result={`${fmt(resCua.pesoPorTuberculos, 2)} g`}
            />
            <Step
              label="Tubérculos por kg"
              formula={`1,000 g ÷ ${fmt(resCua.pesoPorTuberculos, 2)} g/tub.`}
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

      {/* ── SECCIÓN 4: POBLACIÓN ESTIMADA ── */}
      <Section title="4 · Población Estimada de Tubérculos">
        {!hasTercera && !hasCuarta ? (
          <p className="text-gray-400 text-xs py-2">Requiere al menos una muestra en Tercera o Cuarta.</p>
        ) : (
          <>
            {hasTercera && (
              <Step
                label="Tubérculos tercera"
                formula={`${fmtInt(inv.totalArpillasTercera)} arp. × ${fmt(resTer.promedioTuberculosArpilla, 1)} tub/arp.`}
                result={`${fmtInt(Math.round(inv.totalArpillasTercera * resTer.promedioTuberculosArpilla))} tub.`}
              />
            )}
            {hasCuarta && (
              <Step
                label="Tubérculos cuarta"
                formula={`${fmtInt(inv.totalArpillasCuarta)} arp. × ${fmt(resCua.promedioTuberculosArpilla, 1)} tub/arp.`}
                result={`${fmtInt(Math.round(inv.totalArpillasCuarta * resCua.promedioTuberculosArpilla))} tub.`}
              />
            )}
            <Step
              label="Total tubérculos"
              formula="suma de tercera + cuarta"
              result={`${fmtInt(totalTuberculos)} tub.`}
              highlight
            />
            <div className="pt-1">
              <Finding
                type="info"
                text="La población estimada de tubérculos se usa únicamente cuando se activa el modo 'Tubérculos por metro' en Configuración Avanzada. Con el método kg/ha, las hectáreas se calculan directamente de los kilogramos totales."
              />
            </div>
          </>
        )}
      </Section>

      {/* ── SECCIÓN 5: CAPACIDAD DE SIEMBRA ── */}
      <Section title="5 · Capacidad de Siembra">
        {!planning.usarTuberculosMetro ? (
          <>
            <Step label="Método seleccionado" formula={metodLabel} result={`${fmtInt(kgPorHaUsado)} kg/ha`} />
            <Step
              label="Hectáreas posibles"
              formula={`${fmtInt(inv.totalKg)} kg ÷ ${fmtInt(kgPorHaUsado)} kg/ha`}
              result={`${fmt(hectareasCapacidad, 2)} ha`}
              highlight
            />
          </>
        ) : (
          <>
            <Step label="Distancia entre surcos" formula="" result={`${planning.distanciaSurcos} cm`} />
            <Step
              label="Metros de surco por ha"
              formula={`10,000 m² ÷ (${planning.distanciaSurcos} cm ÷ 100)`}
              result={`${fmtInt(metrosPorHa)} m/ha`}
            />
            <Step
              label="Tubérculos por ha"
              formula={`${fmtInt(metrosPorHa)} m/ha × ${planning.tuberculosMetro} tub/m`}
              result={`${fmtInt(tuberculosPorHa)} tub/ha`}
            />
            <Step
              label="Hectáreas posibles"
              formula={`${fmtInt(totalTuberculos)} tub. ÷ ${fmtInt(tuberculosPorHa)} tub/ha`}
              result={`${fmt(hectareasPorDensidad, 2)} ha`}
              highlight
            />
          </>
        )}
      </Section>

      {/* ── SECCIÓN 6: META DE SIEMBRA ── */}
      <Section title="6 · Comparación con Meta">
        <Step label="Meta de siembra" formula="" result={`${fmt(planning.hectareasObjetivo, 1)} ha`} />
        <Step label="Capacidad estimada" formula="" result={`${fmt(hectareasFinales, 2)} ha`} />
        <Step
          label={diferencia >= 0 ? 'Excedente' : 'Déficit'}
          formula={`${fmt(hectareasFinales, 2)} − ${fmt(planning.hectareasObjetivo, 1)}`}
          result={`${diferencia >= 0 ? '+' : ''}${fmt(diferencia, 2)} ha`}
          highlight
        />
        {diferencia < 0 && (
          <>
            <Step
              label="Toneladas faltantes"
              formula={`${fmt(Math.abs(diferencia), 2)} ha × ${fmtInt(kgPorHaUsado)} kg/ha ÷ 1,000`}
              result={`${fmt(toneladasFaltantes, 2)} ton`}
              highlight
            />
          </>
        )}
      </Section>

      {/* ── SECCIÓN 7: OBSERVACIONES ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-700 text-white px-4 py-2.5">
          <h3 className="text-sm font-bold tracking-wide uppercase">7 · Observaciones y Hallazgos</h3>
        </div>
        <div className="p-4 space-y-2">
          <Finding
            type="ok"
            text="Inventario: cálculo correcto. Total kg = (arpillas propias + compradas de tercera + cuarta) × peso por arpilla. La suma por calibre coincide con el total general."
          />
          <Finding
            type="ok"
            text="Porcentajes de clasificación: calculados sobre el total acumulado de unidades (no promedio de porcentajes por muestra). Esto es el método correcto para evitar sesgo cuando las muestras tienen diferente tamaño."
          />
          <Finding
            type="ok"
            text="Peso por tubérculo: se calcula como (promedio kg/muestra) ÷ (promedio tubérculos/muestra) × 1,000. Matemáticamente equivalente a pesoTotal × 1,000 ÷ totalUnidades, ya que los denominadores count se cancelan."
          />
          <Finding
            type={!hasTercera && !hasCuarta ? 'warn' : 'info'}
            text="Muestreos y hectáreas: con el método kg/ha, las hectáreas posibles se calculan SOLO con los kilogramos totales. Los muestreos determinan la población de tubérculos, que se usa únicamente en modo 'Tubérculos por metro'. Sin muestreos, la capacidad sigue calculándose correctamente por peso."
          />
          {planning.usarTuberculosMetro && (
            <Finding
              type="warn"
              text="Modo Tubérculos/metro activo: las toneladas faltantes se calculan usando el kg/ha del método seleccionado, aunque las hectáreas se calcularon por densidad de siembra. Estos dos parámetros pueden ser inconsistentes. Verifique que el kg/ha del selector refleje su consumo real."
            />
          )}
          <Finding
            type="info"
            text="Redondeo: la población de tubérculos se redondea a entero (Math.round). El resto de cálculos usan precisión flotante completa. Los valores mostrados en pantalla se formatean a 2 decimales pero los cálculos internos conservan mayor precisión."
          />
        </div>
      </div>
    </div>
  );
}
