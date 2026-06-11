import type { InventoryState, } from '../types/inventory';
import type { SamplingState, SampleTercera, SampleCuarta } from '../types/sampling';
import type { PlanningState } from '../types/planning';
import type { NotasState } from '../types/notas';
import { defaultNotas } from './defaultNotas';

export interface AppData {
  version: string;
  exportedAt: string;
  inventory: InventoryState;
  sampling: SamplingState;
  planning: PlanningState;
  notas: NotasState;
}

// Sanitiza SamplingState: normaliza campo a campo para compatibilidad hacia atrás.
function sanitizeSampling(raw: Record<string, unknown>): SamplingState {
  const muestreosTercera: SampleTercera[] = (raw['muestreosTercera'] as Record<string, unknown>[] ?? []).map((m) => ({
    id:                (m['id'] as string)              ?? '',
    pesoMuestra:       (m['pesoMuestra'] as number)     ?? 0,
    unidadesSegunda:   (m['unidadesSegunda'] as number) ?? 0,
    unidadesTercera:   (m['unidadesTercera'] as number) ?? 0,
    unidadesCuarta:    (m['unidadesCuarta'] as number)  ?? 0,
    unidadesQuinta:    (m['unidadesQuinta'] as number)  ?? 0, // v1.3 — default 0
    unidadesMerma:     (m['unidadesMerma'] as number)   ?? 0,
    origen:   (m['origen']   as SampleTercera['origen'])   ?? undefined,
    variedad: (m['variedad'] as SampleTercera['variedad']) ?? undefined,
    lote:     (m['lote']     as string | undefined)        ?? undefined,
    fecha:    (m['fecha']    as string | undefined)        ?? undefined,
  }));
  const muestreosCuarta: SampleCuarta[] = (raw['muestreosCuarta'] as Record<string, unknown>[] ?? []).map((m) => ({
    id:                 (m['id'] as string)                  ?? '',
    pesoMuestra:        (m['pesoMuestra'] as number)         ?? 0,
    unidadesTercera:    (m['unidadesTercera'] as number)     ?? 0,
    unidadesCuarta:     (m['unidadesCuarta'] as number)      ?? 0,
    unidadesCuartaChica:(m['unidadesCuartaChica'] as number) ?? 0,
    unidadesQuinta:     (m['unidadesQuinta'] as number)      ?? 0, // v1.2 — default 0
    unidadesMerma:      (m['unidadesMerma'] as number)       ?? 0,
    origen:   (m['origen']   as SampleCuarta['origen'])   ?? undefined,
    variedad: (m['variedad'] as SampleCuarta['variedad']) ?? undefined,
    lote:     (m['lote']     as string | undefined)       ?? undefined,
    fecha:    (m['fecha']    as string | undefined)       ?? undefined,
  }));
  return { muestreosTercera, muestreosCuarta };
}

// Sanitiza un PlanningState importado para eliminar campos obsoletos
// y completar campos nuevos con valores por defecto.
function sanitizePlanning(raw: Record<string, unknown>): PlanningState {
  return {
    hectareasObjetivo: (raw['hectareasObjetivo'] as number) ?? 100,
    metodoCalculo: (raw['metodoCalculo'] as PlanningState['metodoCalculo']) ?? 'promedio',
    kgHaPersonalizado: (raw['kgHaPersonalizado'] as number) ?? 4633,
    distanciaSurcos: (raw['distanciaSurcos'] as number) ?? 90,
    tuberculosMetro: (raw['tuberculosMetro'] as number) ?? 8,
    // 'usarTuberculosMetro' fue eliminado en v1.1 — se descarta aquí.
  };
}

export function exportarDatos(
  inventory: InventoryState,
  sampling: SamplingState,
  planning: PlanningState,
  notas: NotasState,
): void {
  const data: AppData = {
    version: '1.3',
    exportedAt: new Date().toISOString(),
    inventory,
    sampling,
    planning,
    notas,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const year = new Date().getFullYear();
  const a = document.createElement('a');
  a.href = url;
  a.download = `temporada_${year}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importarDatos(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string) as Record<string, unknown>;

        if (!raw['inventory'] || !raw['sampling'] || !raw['planning']) {
          throw new Error('Archivo incompleto: faltan campos requeridos.');
        }

        const data: AppData = {
          version: (raw['version'] as string) ?? '1.0',
          exportedAt: (raw['exportedAt'] as string) ?? '',
          inventory: raw['inventory'] as InventoryState,
          sampling: sanitizeSampling(raw['sampling'] as Record<string, unknown>),
          planning: sanitizePlanning(raw['planning'] as Record<string, unknown>),
          notas: (raw['notas'] as NotasState) ?? defaultNotas,
        };

        resolve(data);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Archivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
