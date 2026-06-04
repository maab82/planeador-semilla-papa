import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';

export function AdvancedSettings() {
  const { planning, setPlanning } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Settings size={18} className="text-gray-600" />
          </div>
          <h3 className="font-semibold text-gray-800">Configuración Avanzada</h3>
        </div>
        <span className="text-gray-400">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Distancia entre surcos"
              type="number"
              min={50}
              max={200}
              unit="cm"
              value={planning.distanciaSurcos}
              onChange={(e) => {
                const num = Math.max(1, parseFloat(e.target.value) || 90);
                setPlanning((prev) => ({ ...prev, distanciaSurcos: num }));
              }}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Tubérculos por metro</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={20}
                  className={`flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${!planning.usarTuberculosMetro ? 'bg-gray-50 text-gray-400' : ''}`}
                  value={planning.tuberculosMetro}
                  disabled={!planning.usarTuberculosMetro}
                  onChange={(e) => {
                    const num = Math.max(1, parseFloat(e.target.value) || 8);
                    setPlanning((prev) => ({ ...prev, tuberculosMetro: num }));
                  }}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={planning.usarTuberculosMetro}
                  onChange={(e) => setPlanning((prev) => ({ ...prev, usarTuberculosMetro: e.target.checked }))}
                  className="rounded"
                />
                Usar tubérculos/metro para calcular hectáreas
              </label>
            </div>
          </div>

          {planning.usarTuberculosMetro && (
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800">
              <p className="font-semibold mb-1">Cálculo por densidad de siembra:</p>
              <p>Metros de surco por ha = 10,000 ÷ ({planning.distanciaSurcos} cm ÷ 100) = {(10000 / (planning.distanciaSurcos / 100)).toLocaleString('es-MX', { maximumFractionDigits: 0 })} m/ha</p>
              <p>Tubérculos por ha = {(10000 / (planning.distanciaSurcos / 100)).toLocaleString('es-MX', { maximumFractionDigits: 0 })} × {planning.tuberculosMetro} = {(10000 / (planning.distanciaSurcos / 100) * planning.tuberculosMetro).toLocaleString('es-MX', { maximumFractionDigits: 0 })} uds/ha</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
