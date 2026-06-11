import type { InventoryState, InventorySummary } from '../types/inventory';
import type { SamplingState, SamplingResultsTercera, SamplingResultsCuarta } from '../types/sampling';
import type { PlanningState } from '../types/planning';
import type { ResultsData, MetodoHistorico, MetodoPoblacional } from '../types/results';
import { CALCULATION_METHODS } from './constants';

// ─── Inventario ─────────────────────────────────────────────────────────────

export function calcularInventario(state: InventoryState): InventorySummary {
  const totalArpillasTercera = state.own.terceraArpillas + state.purchased.terceraArpillas;
  const totalArpillasCuarta = state.own.cuartaArpillas + state.purchased.cuartaArpillas;
  const totalArpillas = totalArpillasTercera + totalArpillasCuarta;
  const kgTercera = totalArpillasTercera * state.weightPerBag;
  const kgCuarta = totalArpillasCuarta * state.weightPerBag;
  const totalKg = totalArpillas * state.weightPerBag;
  const totalToneladas = totalKg / 1000;
  return { totalArpillasTercera, totalArpillasCuarta, totalArpillas, totalKg, totalToneladas, kgTercera, kgCuarta };
}

// ─── Muestreos ───────────────────────────────────────────────────────────────

export function calcularMuestreosTercera(sampling: SamplingState, weightPerBag: number): SamplingResultsTercera {
  const muestras = sampling.muestreosTercera;
  if (muestras.length === 0) {
    return { pctSegunda: 0, pctTercera: 0, pctCuarta: 0, pctQuinta: 0, pctMerma: 0,
             promedioTuberculosMuestra: 0, promedioTuberculosArpilla: 0,
             pesoPorTuberculos: 0, tuberculosPorKg: 0 };
  }
  const totals = muestras.reduce((acc, m) => {
    const quinta = m.unidadesQuinta ?? 0;
    // quinta se cuenta para porcentajes pero NO para promedioTuberculosMuestra,
    // ya que no es calibre aprovechable para siembra (mismo criterio que en Cuarta).
    const udsParaPoblacional = m.unidadesSegunda + m.unidadesTercera + m.unidadesCuarta + m.unidadesMerma;
    return {
      pesoTotal: acc.pesoTotal + m.pesoMuestra,
      segunda: acc.segunda + m.unidadesSegunda,
      tercera: acc.tercera + m.unidadesTercera,
      cuarta: acc.cuarta + m.unidadesCuarta,
      quinta: acc.quinta + quinta,
      merma: acc.merma + m.unidadesMerma,
      totalUnidadesPoblacional: acc.totalUnidadesPoblacional + udsParaPoblacional,
      totalUnidades: acc.totalUnidades + udsParaPoblacional + quinta,
    };
  }, { pesoTotal: 0, segunda: 0, tercera: 0, cuarta: 0, quinta: 0, merma: 0,
       totalUnidadesPoblacional: 0, totalUnidades: 0 });

  const n = muestras.length;
  const promedioTuberculosMuestra = totals.totalUnidadesPoblacional / n;
  const promedioPesoMuestra = totals.pesoTotal / n;
  const pesoPorTuberculos = promedioTuberculosMuestra > 0
    ? (promedioPesoMuestra / promedioTuberculosMuestra) * 1000 : 0;
  const tuberculosPorKg = pesoPorTuberculos > 0 ? 1000 / pesoPorTuberculos : 0;
  const promedioTuberculosArpilla = tuberculosPorKg * weightPerBag;
  const totalUds = totals.totalUnidades;
  return {
    pctSegunda:  totalUds > 0 ? (totals.segunda  / totalUds) * 100 : 0,
    pctTercera:  totalUds > 0 ? (totals.tercera  / totalUds) * 100 : 0,
    pctCuarta:   totalUds > 0 ? (totals.cuarta   / totalUds) * 100 : 0,
    pctQuinta:   totalUds > 0 ? (totals.quinta   / totalUds) * 100 : 0,
    pctMerma:    totalUds > 0 ? (totals.merma    / totalUds) * 100 : 0,
    promedioTuberculosMuestra,
    promedioTuberculosArpilla,
    pesoPorTuberculos,
    tuberculosPorKg,
  };
}

export function calcularMuestreosCuarta(sampling: SamplingState, weightPerBag: number): SamplingResultsCuarta {
  const muestras = sampling.muestreosCuarta;
  if (muestras.length === 0) {
    return { pctTercera: 0, pctCuarta: 0, pctCuartaChica: 0, pctQuinta: 0, pctMerma: 0,
             promedioTuberculosMuestra: 0, promedioTuberculosArpilla: 0,
             pesoPorTuberculos: 0, tuberculosPorKg: 0 };
  }
  const totals = muestras.reduce((acc, m) => {
    // quinta se cuenta para porcentajes pero NO para el promedioTuberculosMuestra
    // que alimenta el método poblacional, ya que es calibre no aprovechable para siembra.
    const quinta = m.unidadesQuinta ?? 0;
    const udsParaPoblacional = m.unidadesTercera + m.unidadesCuarta + m.unidadesCuartaChica + m.unidadesMerma;
    return {
      pesoTotal: acc.pesoTotal + m.pesoMuestra,
      tercera: acc.tercera + m.unidadesTercera,
      cuarta: acc.cuarta + m.unidadesCuarta,
      cuartaChica: acc.cuartaChica + m.unidadesCuartaChica,
      quinta: acc.quinta + quinta,
      merma: acc.merma + m.unidadesMerma,
      totalUnidadesPoblacional: acc.totalUnidadesPoblacional + udsParaPoblacional,
      totalUnidades: acc.totalUnidades + udsParaPoblacional + quinta,
    };
  }, { pesoTotal: 0, tercera: 0, cuarta: 0, cuartaChica: 0, quinta: 0, merma: 0,
       totalUnidadesPoblacional: 0, totalUnidades: 0 });

  const n = muestras.length;
  // promedioTuberculosMuestra excluye quinta para no afectar la estimación de ha
  const promedioTuberculosMuestra = totals.totalUnidadesPoblacional / n;
  const promedioPesoMuestra = totals.pesoTotal / n;
  const pesoPorTuberculos = promedioTuberculosMuestra > 0
    ? (promedioPesoMuestra / promedioTuberculosMuestra) * 1000 : 0;
  const tuberculosPorKg = pesoPorTuberculos > 0 ? 1000 / pesoPorTuberculos : 0;
  const promedioTuberculosArpilla = tuberculosPorKg * weightPerBag;
  // porcentajes sobre el total incluyendo quinta
  const totalUds = totals.totalUnidades;
  return {
    pctTercera:     totalUds > 0 ? (totals.tercera     / totalUds) * 100 : 0,
    pctCuarta:      totalUds > 0 ? (totals.cuarta      / totalUds) * 100 : 0,
    pctCuartaChica: totalUds > 0 ? (totals.cuartaChica / totalUds) * 100 : 0,
    pctQuinta:      totalUds > 0 ? (totals.quinta      / totalUds) * 100 : 0,
    pctMerma:       totalUds > 0 ? (totals.merma       / totalUds) * 100 : 0,
    promedioTuberculosMuestra,
    promedioTuberculosArpilla,
    pesoPorTuberculos,
    tuberculosPorKg,
  };
}

// ─── Método Histórico (solo inventario + kg/ha) ───────────────────────────────
// No usa muestreos. Entrada: kg totales disponibles ÷ kg/ha seleccionado.

export function calcularMetodoHistorico(
  totalKg: number,
  planning: PlanningState,
): MetodoHistorico {
  const kgPorHa = planning.metodoCalculo === 'personalizado'
    ? planning.kgHaPersonalizado
    : CALCULATION_METHODS[planning.metodoCalculo].kgHa;

  const metodoLabel = planning.metodoCalculo === 'personalizado'
    ? `Personalizado (${kgPorHa.toLocaleString()} kg/ha)`
    : CALCULATION_METHODS[planning.metodoCalculo].label;

  // Block calculation when kg/ha is outside the operational range to prevent absurd results.
  const kgHaInvalido = kgPorHa < 1000;
  const hectareas = kgHaInvalido || kgPorHa === 0 ? 0 : totalKg / kgPorHa;
  const diferencia = hectareas - planning.hectareasObjetivo;
  const alcanza = diferencia >= 0;
  const toneladasFaltantes = alcanza ? 0 : (Math.abs(diferencia) * kgPorHa) / 1000;

  return { kgPorHa, metodoLabel, hectareas, diferencia, alcanza, toneladasFaltantes };
}

// ─── Método Poblacional (inventario + muestreos + densidad) ──────────────────
// No usa kg/ha histórico. Entrada: tubérculos totales ÷ tubérculos/ha.

export function calcularMetodoPoblacional(
  arpillasTercera: number,
  arpillasCuarta: number,
  resTercera: SamplingResultsTercera,
  resCuarta: SamplingResultsCuarta,
  planning: PlanningState,
): MetodoPoblacional {
  const hasMuestreos =
    resTercera.promedioTuberculosArpilla > 0 || resCuarta.promedioTuberculosArpilla > 0;

  const tuberculosPorArpillaTercera = resTercera.promedioTuberculosArpilla;
  const tuberculosPorArpillaCuarta = resCuarta.promedioTuberculosArpilla;
  const tuberculosTercera = Math.round(arpillasTercera * tuberculosPorArpillaTercera);
  const tuberculosCuarta = Math.round(arpillasCuarta * tuberculosPorArpillaCuarta);
  const totalTuberculos = tuberculosTercera + tuberculosCuarta;

  const distanciaSurcos = planning.distanciaSurcos;
  const tuberculosMetro = planning.tuberculosMetro;
  const metrosPorHa = 10000 / (distanciaSurcos / 100);
  const tuberculosPorHa = metrosPorHa * tuberculosMetro;
  const metrosLinealesPosibles = tuberculosMetro > 0 ? totalTuberculos / tuberculosMetro : 0;
  const hectareas = tuberculosPorHa > 0 ? totalTuberculos / tuberculosPorHa : 0;
  const diferencia = hectareas - planning.hectareasObjetivo;
  const alcanza = diferencia >= 0;

  return {
    disponible: hasMuestreos,
    tuberculosPorArpillaTercera,
    tuberculosPorArpillaCuarta,
    tuberculosTercera,
    tuberculosCuarta,
    totalTuberculos,
    distanciaSurcos,
    tuberculosMetro,
    metrosPorHa,
    tuberculosPorHa,
    metrosLinealesPosibles,
    hectareas,
    diferencia,
    alcanza,
  };
}

// ─── Resultado combinado ──────────────────────────────────────────────────────

export function calcularResultados(
  inventory: InventoryState,
  sampling: SamplingState,
  planning: PlanningState,
): ResultsData {
  const inv = calcularInventario(inventory);
  const resTercera = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCuarta = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  const historico = calcularMetodoHistorico(inv.totalKg, planning);
  const poblacional = calcularMetodoPoblacional(
    inv.totalArpillasTercera,
    inv.totalArpillasCuarta,
    resTercera,
    resCuarta,
    planning,
  );

  return {
    arpillasTotales: inv.totalArpillas,
    arpillasTercera: inv.totalArpillasTercera,
    arpillasCuarta: inv.totalArpillasCuarta,
    kgTotales: inv.totalKg,
    toneladasTotales: inv.totalToneladas,
    hectareasObjetivo: planning.hectareasObjetivo,
    historico,
    poblacional,
  };
}
