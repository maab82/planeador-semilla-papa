import type { InventoryState } from '../types/inventory';
import type { SamplingState } from '../types/sampling';
import type { PlanningState } from '../types/planning';

export const sampleInventory: InventoryState = {
  own: {
    terceraArpillas: 850,
    cuartaArpillas: 420,
  },
  purchased: {
    terceraArpillas: 600,
    cuartaArpillas: 310,
  },
  weightPerBag: 52,
};

export const sampleSampling: SamplingState = {
  muestreosTercera: [
    { id: 't3_sample_1', pesoMuestra: 5.2, unidadesSegunda: 12, unidadesTercera: 48, unidadesCuarta: 15, unidadesMerma: 3 },
    { id: 't3_sample_2', pesoMuestra: 5.0, unidadesSegunda: 10, unidadesTercera: 52, unidadesCuarta: 12, unidadesMerma: 2 },
    { id: 't3_sample_3', pesoMuestra: 5.4, unidadesSegunda: 14, unidadesTercera: 46, unidadesCuarta: 18, unidadesMerma: 4 },
  ],
  muestreosCuarta: [
    { id: 't4_sample_1', pesoMuestra: 5.0, unidadesTercera: 8, unidadesCuarta: 52, unidadesCuartaChica: 22, unidadesMerma: 5 },
    { id: 't4_sample_2', pesoMuestra: 4.8, unidadesTercera: 6, unidadesCuarta: 55, unidadesCuartaChica: 20, unidadesMerma: 4 },
    { id: 't4_sample_3', pesoMuestra: 5.1, unidadesTercera: 9, unidadesCuarta: 50, unidadesCuartaChica: 24, unidadesMerma: 6 },
  ],
};

export const samplePlanning: PlanningState = {
  hectareasObjetivo: 100,
  metodoCalculo: 'promedio',
  kgHaPersonalizado: 4633,
  distanciaSurcos: 90,
  tuberculosMetro: 8,
  usarTuberculosMetro: false,
};
