export type CalculationMethod = 'conservador' | 'promedio' | 'intensivo' | 'personalizado';

export interface PlanningState {
  hectareasObjetivo: number;
  metodoCalculo: CalculationMethod;
  kgHaPersonalizado: number;
  distanciaSurcos: number;
  tuberculosMetro: number;
}

export interface HistoricalSeason {
  temporada: string;
  hectareas: number;
  toneladas: number;
  kgPorHa: number;
}
