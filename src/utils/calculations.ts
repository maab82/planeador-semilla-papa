import type { InventoryState, InventorySummary } from '../types/inventory';
import type { SamplingState, SamplingResultsTercera, SamplingResultsCuarta } from '../types/sampling';
import type { PlanningState } from '../types/planning';
import type { ResultsData } from '../types/results';
import { CALCULATION_METHODS } from './constants';

export function calcularInventario(state: InventoryState): InventorySummary {
  const totalArpillasTercera = state.own.terceraArpillas + state.purchased.terceraArpillas;
  const totalArpillasCuarta = state.own.cuartaArpillas + state.purchased.cuartaArpillas;
  const totalArpillas = totalArpillasTercera + totalArpillasCuarta;
  const kgTercera = totalArpillasTercera * state.weightPerBag;
  const kgCuarta = totalArpillasCuarta * state.weightPerBag;
  const totalKg = totalArpillas * state.weightPerBag;
  const totalToneladas = totalKg / 1000;

  return {
    totalArpillasTercera,
    totalArpillasCuarta,
    totalArpillas,
    totalKg,
    totalToneladas,
    kgTercera,
    kgCuarta,
  };
}

export function calcularMuestreosTercera(sampling: SamplingState, weightPerBag: number): SamplingResultsTercera {
  const muestras = sampling.muestreosTercera;
  if (muestras.length === 0) {
    return {
      pctSegunda: 0, pctTercera: 0, pctCuarta: 0, pctMerma: 0,
      promedioTuberculosMuestra: 0, promedioTuberculosArpilla: 0,
      pesoPorTuberculos: 0, tuberculosPorKg: 0,
    };
  }

  const totals = muestras.reduce((acc, m) => {
    const totalUnidades = m.unidadesSegunda + m.unidadesTercera + m.unidadesCuarta + m.unidadesMerma;
    return {
      pesoTotal: acc.pesoTotal + m.pesoMuestra,
      segunda: acc.segunda + m.unidadesSegunda,
      tercera: acc.tercera + m.unidadesTercera,
      cuarta: acc.cuarta + m.unidadesCuarta,
      merma: acc.merma + m.unidadesMerma,
      totalUnidades: acc.totalUnidades + totalUnidades,
    };
  }, { pesoTotal: 0, segunda: 0, tercera: 0, cuarta: 0, merma: 0, totalUnidades: 0 });

  const count = muestras.length;
  const promedioTuberculosMuestra = totals.totalUnidades / count;
  const promedioPesoMuestra = totals.pesoTotal / count;
  const pesoPorTuberculos = promedioPesoMuestra > 0 && promedioTuberculosMuestra > 0
    ? (promedioPesoMuestra / promedioTuberculosMuestra) * 1000
    : 0;
  const tuberculosPorKg = pesoPorTuberculos > 0 ? 1000 / pesoPorTuberculos : 0;
  const promedioTuberculosArpilla = tuberculosPorKg * weightPerBag;

  const totalUnidadesTotales = totals.segunda + totals.tercera + totals.cuarta + totals.merma;

  return {
    pctSegunda: totalUnidadesTotales > 0 ? (totals.segunda / totalUnidadesTotales) * 100 : 0,
    pctTercera: totalUnidadesTotales > 0 ? (totals.tercera / totalUnidadesTotales) * 100 : 0,
    pctCuarta: totalUnidadesTotales > 0 ? (totals.cuarta / totalUnidadesTotales) * 100 : 0,
    pctMerma: totalUnidadesTotales > 0 ? (totals.merma / totalUnidadesTotales) * 100 : 0,
    promedioTuberculosMuestra,
    promedioTuberculosArpilla,
    pesoPorTuberculos,
    tuberculosPorKg,
  };
}

export function calcularMuestreosCuarta(sampling: SamplingState, weightPerBag: number): SamplingResultsCuarta {
  const muestras = sampling.muestreosCuarta;
  if (muestras.length === 0) {
    return {
      pctTercera: 0, pctCuarta: 0, pctCuartaChica: 0, pctMerma: 0,
      promedioTuberculosMuestra: 0, promedioTuberculosArpilla: 0,
      pesoPorTuberculos: 0, tuberculosPorKg: 0,
    };
  }

  const totals = muestras.reduce((acc, m) => {
    const totalUnidades = m.unidadesTercera + m.unidadesCuarta + m.unidadesCuartaChica + m.unidadesMerma;
    return {
      pesoTotal: acc.pesoTotal + m.pesoMuestra,
      tercera: acc.tercera + m.unidadesTercera,
      cuarta: acc.cuarta + m.unidadesCuarta,
      cuartaChica: acc.cuartaChica + m.unidadesCuartaChica,
      merma: acc.merma + m.unidadesMerma,
      totalUnidades: acc.totalUnidades + totalUnidades,
    };
  }, { pesoTotal: 0, tercera: 0, cuarta: 0, cuartaChica: 0, merma: 0, totalUnidades: 0 });

  const count = muestras.length;
  const promedioTuberculosMuestra = totals.totalUnidades / count;
  const promedioPesoMuestra = totals.pesoTotal / count;
  const pesoPorTuberculos = promedioPesoMuestra > 0 && promedioTuberculosMuestra > 0
    ? (promedioPesoMuestra / promedioTuberculosMuestra) * 1000
    : 0;
  const tuberculosPorKg = pesoPorTuberculos > 0 ? 1000 / pesoPorTuberculos : 0;
  const promedioTuberculosArpilla = tuberculosPorKg * weightPerBag;

  const totalUnidadesTotales = totals.tercera + totals.cuarta + totals.cuartaChica + totals.merma;

  return {
    pctTercera: totalUnidadesTotales > 0 ? (totals.tercera / totalUnidadesTotales) * 100 : 0,
    pctCuarta: totalUnidadesTotales > 0 ? (totals.cuarta / totalUnidadesTotales) * 100 : 0,
    pctCuartaChica: totalUnidadesTotales > 0 ? (totals.cuartaChica / totalUnidadesTotales) * 100 : 0,
    pctMerma: totalUnidadesTotales > 0 ? (totals.merma / totalUnidadesTotales) * 100 : 0,
    promedioTuberculosMuestra,
    promedioTuberculosArpilla,
    pesoPorTuberculos,
    tuberculosPorKg,
  };
}

export function calcularResultados(
  inventory: InventoryState,
  sampling: SamplingState,
  planning: PlanningState,
): ResultsData {
  const invSummary = calcularInventario(inventory);
  const resTercera = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCuarta = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  const tuberculosTercera = Math.round(invSummary.totalArpillasTercera * resTercera.promedioTuberculosArpilla);
  const tuberculosCuarta = Math.round(invSummary.totalArpillasCuarta * resCuarta.promedioTuberculosArpilla);
  const totalTuberculos = tuberculosTercera + tuberculosCuarta;

  let kgPorHaUsado: number;
  if (planning.metodoCalculo === 'personalizado') {
    kgPorHaUsado = planning.kgHaPersonalizado;
  } else {
    kgPorHaUsado = CALCULATION_METHODS[planning.metodoCalculo].kgHa;
  }

  let hectareasPostbles: number;

  if (planning.usarTuberculosMetro && planning.tuberculosMetro > 0 && planning.distanciaSurcos > 0) {
    const metrosPorHa = 10000 / (planning.distanciaSurcos / 100);
    const tuberculosPorHa = metrosPorHa * planning.tuberculosMetro;
    hectareasPostbles = tuberculosPorHa > 0 ? totalTuberculos / tuberculosPorHa : 0;
  } else {
    hectareasPostbles = kgPorHaUsado > 0 ? invSummary.totalKg / kgPorHaUsado : 0;
  }

  const diferenciaHectareas = hectareasPostbles - planning.hectareasObjetivo;
  const alcanza = diferenciaHectareas >= 0;
  const toneladasFaltantes = alcanza ? 0 : Math.abs(diferenciaHectareas) * kgPorHaUsado / 1000;

  return {
    arpillasTotales: invSummary.totalArpillas,
    kgTotales: invSummary.totalKg,
    toneladasTotales: invSummary.totalToneladas,
    tuberculosTercera,
    tuberculosCuarta,
    totalTuberculos,
    hectareasPostbles,
    diferenciaHectareas,
    alcanza,
    toneladasFaltantes,
    kgPorHaUsado,
    hectareasObjetivo: planning.hectareasObjetivo,
  };
}
