import { Package, FlaskConical, Target, BarChart3 } from 'lucide-react';

export type TabId = 'inventario' | 'muestreos' | 'planeacion' | 'resultados';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: 'inventario', label: 'Inventario', icon: <Package size={18} /> },
  { id: 'muestreos', label: 'Muestreos', icon: <FlaskConical size={18} /> },
  { id: 'planeacion', label: 'Planeación', icon: <Target size={18} /> },
  { id: 'resultados', label: 'Resultados', icon: <BarChart3 size={18} /> },
];

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-green-700 text-green-800 bg-green-50'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
