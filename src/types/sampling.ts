export interface SampleTercera {
  id: string;
  pesoMuestra: number;
  unidadesSegunda: number;
  unidadesTercera: number;
  unidadesCuarta: number;
  unidadesMerma: number;
}

export interface SampleCuarta {
  id: string;
  pesoMuestra: number;
  unidadesTercera: number;
  unidadesCuarta: number;
  unidadesCuartaChica: number;
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
  pctMerma: number;
  promedioTuberculosMuestra: number;
  promedioTuberculosArpilla: number;
  pesoPorTuberculos: number;
  tuberculosPorKg: number;
}
