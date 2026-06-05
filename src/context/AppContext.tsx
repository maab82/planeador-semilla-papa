import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { InventoryState } from '../types/inventory';
import type { SamplingState } from '../types/sampling';
import type { PlanningState } from '../types/planning';
import type { NotasState } from '../types/notas';
import { samplePlanning } from '../utils/sampleData';
import { defaultNotas } from '../utils/defaultNotas';

const emptyInventory: InventoryState = {
  own: { terceraArpillas: 0, cuartaArpillas: 0 },
  purchased: { terceraArpillas: 0, cuartaArpillas: 0 },
  weightPerBag: 52,
};

const emptySampling: SamplingState = {
  muestreosTercera: [],
  muestreosCuarta: [],
};

interface AppContextType {
  inventory: InventoryState;
  setInventory: (v: InventoryState | ((p: InventoryState) => InventoryState)) => void;
  sampling: SamplingState;
  setSampling: (v: SamplingState | ((p: SamplingState) => SamplingState)) => void;
  planning: PlanningState;
  setPlanning: (v: PlanningState | ((p: PlanningState) => PlanningState)) => void;
  notas: NotasState;
  setNotas: (v: NotasState | ((p: NotasState) => NotasState)) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useLocalStorage<InventoryState>('psp_inventory', emptyInventory);
  const [sampling, setSampling] = useLocalStorage<SamplingState>('psp_sampling', emptySampling);
  const [planning, setPlanning] = useLocalStorage<PlanningState>('psp_planning', samplePlanning);
  const [notas, setNotas] = useLocalStorage<NotasState>('psp_notas', defaultNotas);

  function resetAll() {
    setInventory(emptyInventory);
    setSampling(emptySampling);
    setPlanning(samplePlanning);
    setNotas(defaultNotas);
  }

  return (
    <AppContext.Provider value={{ inventory, setInventory, sampling, setSampling, planning, setPlanning, notas, setNotas, resetAll }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
