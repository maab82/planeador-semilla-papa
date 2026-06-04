import { Calculator } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import type { CalculationMethod as CalcMethod } from '../../types/planning';
import { CALCULATION_METHODS } from '../../utils/constants';

interface MethodOptionProps {
  label: string;
  kgHa: number | string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

function MethodOption({ label, kgHa, description, selected, onSelect }: MethodOptionProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
        selected
          ? 'border-green-600 bg-green-50'
          : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-sm font-semibold ${selected ? 'text-green-800' : 'text-gray-700'}`}>{label}</span>
        {typeof kgHa === 'number' && (
          <span className={`text-sm font-bold ${selected ? 'text-green-700' : 'text-gray-500'}`}>
            {kgHa.toLocaleString()} kg/ha
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </button>
  );
}

const methodDescriptions: Record<CalcMethod, string> = {
  conservador: 'Estimación conservadora basada en el mayor consumo histórico',
  promedio: 'Promedio de las tres últimas temporadas registradas',
  intensivo: 'Estimación intensiva basada en el menor consumo histórico',
  personalizado: 'Ingrese manualmente el valor de kg/ha para su estimación',
};

export function CalculationMethodSelector() {
  const { planning, setPlanning } = useApp();

  function setMethod(method: CalcMethod) {
    setPlanning((prev) => ({ ...prev, metodoCalculo: method }));
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Calculator size={18} className="text-blue-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Método de Cálculo</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(CALCULATION_METHODS) as CalcMethod[]).map((key) => (
          <MethodOption
            key={key}
            label={CALCULATION_METHODS[key].label}
            kgHa={key !== 'personalizado' ? CALCULATION_METHODS[key].kgHa : ''}
            description={methodDescriptions[key]}
            selected={planning.metodoCalculo === key}
            onSelect={() => setMethod(key)}
          />
        ))}
      </div>
      {planning.metodoCalculo === 'personalizado' && (
        <div className="mt-4 max-w-xs">
          <Input
            label="kg por hectárea personalizado"
            type="number"
            min={1000}
            max={10000}
            unit="kg/ha"
            value={planning.kgHaPersonalizado}
            onChange={(e) => {
              const num = Math.max(1, parseFloat(e.target.value) || 4633);
              setPlanning((prev) => ({ ...prev, kgHaPersonalizado: num }));
            }}
          />
        </div>
      )}
    </Card>
  );
}
