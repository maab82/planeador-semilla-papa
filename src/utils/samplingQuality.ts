import type { SampleTercera, SampleCuarta, OrigenMuestra } from '../types/sampling';
export type { OrigenMuestra };

export type CalidadNivel = 'excelente' | 'buena' | 'regular' | 'deficiente';

export interface AlertaMuestra {
  tipo: 'warning' | 'danger' | 'success';
  mensaje: string;
}

export interface CalidadMuestra {
  id: string;
  calibre: 'tercera' | 'cuarta';
  origen?: OrigenMuestra;
  variedad?: string;
  lote?: string;
  fecha?: string;
  pctUtil: number;
  pctMerma: number;
  pctQuinta?: number;
  nivel: CalidadNivel;
  alertas: AlertaMuestra[];
  detalles: Record<string, number>;
}

export function clasificarCalidad(pctUtil: number, pctMerma: number): CalidadNivel {
  if (pctUtil >= 90 && pctMerma < 3) return 'excelente';
  if (pctUtil >= 80) return 'buena';
  if (pctUtil >= 70) return 'regular';
  return 'deficiente';
}

export function evaluarTercera(s: SampleTercera): CalidadMuestra {
  const total = s.unidadesSegunda + s.unidadesTercera + s.unidadesCuarta + s.unidadesMerma;
  if (total === 0) {
    return {
      id: s.id, calibre: 'tercera',
      origen: s.origen, variedad: s.variedad, lote: s.lote, fecha: s.fecha,
      pctUtil: 0, pctMerma: 0, nivel: 'deficiente', alertas: [],
      detalles: { segunda: 0, tercera: 0, cuarta: 0, merma: 0 },
    };
  }
  const pct = (n: number) => (n / total) * 100;
  const pctSegunda = pct(s.unidadesSegunda);
  const pctTercera = pct(s.unidadesTercera);
  const pctCuarta = pct(s.unidadesCuarta);
  const pctMerma = pct(s.unidadesMerma);
  const pctUtil = pctSegunda + pctTercera + pctCuarta;

  const alertas: AlertaMuestra[] = [];
  if (pctMerma >= 8) alertas.push({ tipo: 'danger', mensaje: `Merma muy alta: ${pctMerma.toFixed(1)}% (umbral 8%)` });
  else if (pctMerma >= 5) alertas.push({ tipo: 'warning', mensaje: `Merma elevada: ${pctMerma.toFixed(1)}%` });
  if (pctCuarta >= 30) alertas.push({ tipo: 'warning', mensaje: `Cuarta elevada: ${pctCuarta.toFixed(1)}% — considerar calibración` });
  if (pctMerma < 2 && pctUtil >= 90) alertas.push({ tipo: 'success', mensaje: 'Excelente uniformidad y muy baja merma' });

  return {
    id: s.id, calibre: 'tercera',
    origen: s.origen, variedad: s.variedad, lote: s.lote, fecha: s.fecha,
    pctUtil, pctMerma, nivel: clasificarCalidad(pctUtil, pctMerma), alertas,
    detalles: { segunda: pctSegunda, tercera: pctTercera, cuarta: pctCuarta, merma: pctMerma },
  };
}

export function evaluarCuarta(s: SampleCuarta): CalidadMuestra {
  const quinta = s.unidadesQuinta ?? 0;
  const total = s.unidadesTercera + s.unidadesCuarta + s.unidadesCuartaChica + quinta + s.unidadesMerma;
  if (total === 0) {
    return {
      id: s.id, calibre: 'cuarta',
      origen: s.origen, variedad: s.variedad, lote: s.lote, fecha: s.fecha,
      pctUtil: 0, pctMerma: 0, pctQuinta: 0, nivel: 'deficiente', alertas: [],
      detalles: { tercera: 0, cuarta: 0, cuartaChica: 0, quinta: 0, merma: 0 },
    };
  }
  const pct = (n: number) => (n / total) * 100;
  const pctTercera = pct(s.unidadesTercera);
  const pctCuarta = pct(s.unidadesCuarta);
  const pctCuartaChica = pct(s.unidadesCuartaChica);
  const pctQuinta = pct(quinta);
  const pctMerma = pct(s.unidadesMerma);
  const pctUtil = pctTercera + pctCuarta + pctCuartaChica;

  const alertas: AlertaMuestra[] = [];
  if (pctMerma >= 8) alertas.push({ tipo: 'danger', mensaje: `Merma muy alta: ${pctMerma.toFixed(1)}% (umbral 8%)` });
  else if (pctMerma >= 5) alertas.push({ tipo: 'warning', mensaje: `Merma elevada: ${pctMerma.toFixed(1)}%` });
  if (pctQuinta > 10) alertas.push({ tipo: 'warning', mensaje: `Quinta elevada: ${pctQuinta.toFixed(1)}% — semilla muy pequeña` });
  if (pctCuartaChica >= 35) alertas.push({ tipo: 'warning', mensaje: `Cuarta Chica elevada: ${pctCuartaChica.toFixed(1)}% — calibre marginal` });
  if (pctMerma < 2 && pctUtil >= 90) alertas.push({ tipo: 'success', mensaje: 'Excelente uniformidad y muy baja merma' });

  return {
    id: s.id, calibre: 'cuarta',
    origen: s.origen, variedad: s.variedad, lote: s.lote, fecha: s.fecha,
    pctUtil, pctMerma, pctQuinta, nivel: clasificarCalidad(pctUtil, pctMerma), alertas,
    detalles: { tercera: pctTercera, cuarta: pctCuarta, cuartaChica: pctCuartaChica, quinta: pctQuinta, merma: pctMerma },
  };
}

export const NIVEL_LABEL: Record<CalidadNivel, string> = {
  excelente: 'Excelente',
  buena: 'Buena',
  regular: 'Regular',
  deficiente: 'Deficiente',
};

export const NIVEL_COLOR: Record<CalidadNivel, string> = {
  excelente: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  buena: 'bg-green-100 text-green-800 border-green-200',
  regular: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  deficiente: 'bg-red-100 text-red-800 border-red-200',
};

export const NIVEL_DOT: Record<CalidadNivel, string> = {
  excelente: 'bg-emerald-500',
  buena: 'bg-green-500',
  regular: 'bg-yellow-500',
  deficiente: 'bg-red-500',
};
