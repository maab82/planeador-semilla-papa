import type { NotasState } from '../types/notas';

export const defaultNotas: NotasState = {
  temporada: '',
  notas: [],
  resultadosReales: {
    temporada: '',
    hectareasSembradas: 0,
    toneladasUsadas: 0,
    kgHaReal: 0,
    observaciones: '',
  },
};
