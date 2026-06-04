export type EtapaNota = 'pre-criba' | 'post-criba' | 'siembra' | 'general';

export interface NotaValidacion {
  id: string;
  fecha: string;
  etapa: EtapaNota;
  titulo: string;
  contenido: string;
}

export interface ResultadosReales {
  temporada: string;
  hectareasSembradas: number;
  toneladasUsadas: number;
  kgHaReal: number;
  observaciones: string;
}

export interface NotasState {
  temporada: string;
  notas: NotaValidacion[];
  resultadosReales: ResultadosReales;
}
