export type OrigenMuestra = 'navojoa' | 'caborca' | 'otro';
export type VariedadMuestra = 'fianna' | 'orquesta' | 'otra';

export interface SampleMeta {
  proveedor?: string;
  origen?: OrigenMuestra;
  variedad?: VariedadMuestra;
  lote?: string;           // kept for backward compat — use viaje for new records
  viaje?: string;          // "No. de Viaje / Thermo" — v1.4
  fecha?: string;          // kept for backward compat — use fechaRecepcion for new records
  fechaRecepcion?: string; // v1.4
  toneladasViaje?: number; // v1.4, optional
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
