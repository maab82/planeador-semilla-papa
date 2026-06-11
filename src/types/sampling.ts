export type OrigenMuestra = 'navojoa' | 'caborca';
export type VariedadMuestra = 'fianna' | 'orquesta' | 'otra';

export interface SampleMeta {
  origen?: OrigenMuestra;
  variedad?: VariedadMuestra;
  lote?: string;
  fecha?: string;
  // kg por categoría (opcionales — modelo dual kg + unidades)
  kgSegunda?: number;
  kgTercera?: number;
  kgCuarta?: number;
  kgQuinta?: number;
  kgNoAprovechable?: number;
  kgTierra?: number;
  kgSanidad?: number;
}

export interface SampleTercera extends SampleMeta {
  id: string;
  pesoMuestra: number;
  unidadesSegunda: number;
  unidadesTercera: number;
  unidadesCuarta: number;
  unidadesQuinta?: number;
  unidadesMerma: number;
}

export interface SampleCuarta extends SampleMeta {
  id: string;
  pesoMuestra: number;
  unidadesTercera: number;
  unidadesCuarta: number;
  unidadesCuartaChica: number;
  unidadesQuinta: number;
  unidadesMerma: number;
}

export interface SamplingState {
  muestreosTercera: SampleTercera[];
  muestreosCuarta: SampleCuarta[];
}

export interface SamplingResultsTercera {
  pctSegunda: number;
  pctTercera: number;
  pctCuarta: number;
  pctQuinta: number;
  pctMerma: number;
  promedioTuberculosMuestra: number;
  promedioTuberculosArpilla: number;
  pesoPorTuberculos: number;
  tuberculosPorKg: number;
}

export interface SamplingResultsCuarta {
  pctTercera: number;
  pctCuarta: number;
  pctCuartaChica: number;
  pctQuinta: number;
  pctMerma: number;
  promedioTuberculosMuestra: number;
  promedioTuberculosArpilla: number;
  pesoPorTuberculos: number;
  tuberculosPorKg: number;
}
