import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { InventoryState } from '../types/inventory';
import type { SamplingState } from '../types/sampling';
import type { PlanningState } from '../types/planning';
import type { NotasState } from '../types/notas';
import { sampleInventory, sampleSampling, samplePlanning } from '../utils/sampleData';
import { defaultNotas } from '../utils/defaultNotas';

interface AppContextType {
  inventory: InventoryState;
  setInventory: (v: InventoryState | ((p: InventoryState) => InventoryState)) => void;
  sampling: SamplingState;
  setSampling: (v: SamplingState | ((p: SamplingState) => SamplingState)) => void;
  planning: PlanningState;
  setPlanning: (v: PlanningState | ((p: PlanningState) => PlanningState)) => void;
  notas: NotasState;
  setNotas: (v: NotasState | ((p: NotasState) => NotasState)) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useLocalStorage<InventoryState>('psp_inventory', sampleInventory);
  const [sampling, setSampling] = useLocalStorage<SamplingState>('psp_sampling', sampleSampling);
  const [planning, setPlanning] = useLocalStorage<PlanningState>('psp_planning', samplePlanning);
  const [notas, setNotas] = useLocalStorage<NotasState>('psp_notas', defaultNotas);

  return (
    <AppContext.Provider value={{ inventory, setInventory, sampling, setSampling, planning, setPlanning, notas, setNotas }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
