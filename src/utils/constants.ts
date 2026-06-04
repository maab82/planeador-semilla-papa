import type { HistoricalSeason } from '../types/planning';

export const HISTORICAL_SEASONS: HistoricalSeason[] = [
  { temporada: '22-23', hectareas: 55.8, toneladas: 269.9, kgPorHa: 4837 },
  { temporada: '23-24', hectareas: 110.9, toneladas: 478.9, kgPorHa: 4317 },
  { temporada: '24-25', hectareas: 91.0, toneladas: 431.9, kgPorHa: 4745 },
];

export const HISTORICAL_AVERAGE_KG_HA = 4633;

export const CALCULATION_METHODS = {
  conservador: { label: 'Histórico Conservador', kgHa: 4800 },
  promedio: { label: 'Histórico Promedio', kgHa: 4633 },
  intensivo: { label: 'Histórico Intensivo', kgHa: 4300 },
  personalizado: { label: 'Personalizado', kgHa: 0 },
} as const;

export const DEFAULT_WEIGHT_PER_BAG = 52;
export const DEFAULT_SURCO_DISTANCE = 90;
export const DEFAULT_TUBERCULOS_METRO = 8;
