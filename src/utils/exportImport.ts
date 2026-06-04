import type { InventoryState } from '../types/inventory';
import type { SamplingState } from '../types/sampling';
import type { PlanningState } from '../types/planning';

export interface AppData {
  version: string;
  exportedAt: string;
  inventory: InventoryState;
  sampling: SamplingState;
  planning: PlanningState;
}

export function exportarDatos(
  inventory: InventoryState,
  sampling: SamplingState,
  planning: PlanningState,
): void {
  const data: AppData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    inventory,
    sampling,
    planning,
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
        const data = JSON.parse(e.target?.result as string) as AppData;
        resolve(data);
      } catch {
        reject(new Error('Archivo JSON inválido'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}
