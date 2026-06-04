import { Target } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';

export function PlantingGoal() {
  const { planning, setPlanning } = useApp();

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <Target size={18} className="text-green-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Meta de Siembra</h3>
      </div>
      <div className="max-w-xs">
        <Input
          label="Hectáreas Objetivo"
          type="number"
          min={1}
          unit="ha"
          value={planning.hectareasObjetivo}
          onChange={(e) => {
            const num = Math.max(1, parseFloat(e.target.value) || 1);
            setPlanning((prev) => ({ ...prev, hectareasObjetivo: num }));
          }}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Número de hectáreas que desea sembrar esta temporada
        </p>
      </div>
    </Card>
  );
}
