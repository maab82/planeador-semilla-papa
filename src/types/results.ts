export interface MetodoHistorico {
  kgPorHa: number;
  metodoLabel: string;
  hectareas: number;
  diferencia: number;
  alcanza: boolean;
  toneladasFaltantes: number;
}

export interface MetodoPoblacional {
  disponible: boolean;
  tuberculosPorArpillaTercera: number;
  tuberculosPorArpillaCuarta: number;
  tuberculosTercera: number;
  tuberculosCuarta: number;
  totalTuberculos: number;
  distanciaSurcos: number;
  tuberculosMetro: number;
  metrosPorHa: number;
  tuberculosPorHa: number;
  metrosLinealesPosibles: number;
  hectareas: number;
  diferencia: number;
  alcanza: boolean;
}

export interface ResultsData {
  arpillasTotales: number;
  arpillasTercera: number;
  arpillasCuarta: number;
  kgTotales: number;
  toneladasTotales: number;
  hectareasObjetivo: number;
  historico: MetodoHistorico;
  poblacional: MetodoPoblacional;
}
