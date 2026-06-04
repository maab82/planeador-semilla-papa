import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { TabNav, type TabId } from './components/layout/TabNav';
import { InventoryTab } from './components/tabs/InventoryTab';
import { SamplingTab } from './components/tabs/SamplingTab';
import { PlanningTab } from './components/tabs/PlanningTab';
import { ResultsTab } from './components/tabs/ResultsTab';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('inventario');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'inventario' && <InventoryTab />}
        {activeTab === 'muestreos' && <SamplingTab />}
        {activeTab === 'planeacion' && <PlanningTab />}
        {activeTab === 'resultados' && <ResultsTab />}
      </main>
      <footer className="bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
        Planeador de Semilla de Papa — Datos almacenados localmente en su navegador
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
