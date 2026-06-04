import { Users } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';

export function AdvancedSettings() {
  const { planning, setPlanning } = useApp();

  const metrosPorHa = 10000 / (planning.distanciaSurcos / 100);
  const tuberculosPorHa = metrosPorHa * planning.tuberculosMetro;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Users size={18} className="text-purple-700" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">Parámetros de Siembra</h3>
          <p className="text-xs text-gray-500">Usados por el Método Poblacional</p>
        </div>
      </div>

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
        <Input
          label="Tubérculos por metro lineal"
          type="number"
          min={1}
          max={20}
          unit="tub/m"
          value={planning.tuberculosMetro}
          onChange={(e) => {
            const num = Math.max(1, parseFloat(e.target.value) || 8);
            setPlanning((prev) => ({ ...prev, tuberculosMetro: num }));
          }}
        />
      </div>

      <div className="mt-4 bg-purple-50 rounded-lg p-3 grid grid-cols-2 gap-3">
        <div className="text-center">
          <p className="text-xs text-purple-600 font-medium">Metros de surco / ha</p>
          <p className="text-lg font-bold text-purple-800">
            {metrosPorHa.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-purple-500">10,000 ÷ ({planning.distanciaSurcos} cm ÷ 100)</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-purple-600 font-medium">Tubérculos / ha</p>
          <p className="text-lg font-bold text-purple-800">
            {tuberculosPorHa.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-purple-500">
            {metrosPorHa.toLocaleString('es-MX', { maximumFractionDigits: 0 })} × {planning.tuberculosMetro}
          </p>
        </div>
      </div>
    </Card>
  );
}
