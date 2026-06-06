import { useState, useEffect } from 'react';
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
  const [inputValue, setInputValue] = useState(String(planning.kgHaPersonalizado));

  // Sync local string when external state changes (e.g. import)
  useEffect(() => {
    setInputValue(String(planning.kgHaPersonalizado));
  }, [planning.kgHaPersonalizado]);

  function setMethod(method: CalcMethod) {
    setPlanning((prev) => ({ ...prev, metodoCalculo: method }));
  }

  function handleBlur() {
    const parsed = parseFloat(inputValue);
    // Require ≥ 1000 to commit — below that is operationally nonsensical.
    // Falls back to the last valid stored value (never persists junk like "4").
    const valid = !isNaN(parsed) && parsed >= 1000 ? parsed : planning.kgHaPersonalizado;
    setInputValue(String(valid));
    setPlanning((prev) => ({ ...prev, kgHaPersonalizado: valid }));
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
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleBlur}
          />
          {planning.kgHaPersonalizado < 1000 && (
            <p className="mt-1.5 text-xs text-red-700 bg-red-50 border border-red-300 rounded-lg px-2.5 py-1.5 font-medium">
              ✕ Valor inválido ({planning.kgHaPersonalizado} kg/ha). Ingrese un valor entre 1 000 y 10 000 kg/ha.
              El Método Histórico no calculará resultados con este valor.
            </p>
          )}
          {planning.kgHaPersonalizado >= 1000 && planning.kgHaPersonalizado > 10000 && (
            <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
              ⚠ Valor fuera del rango operativo típico para papa (1 000–10 000 kg/ha).
              Resultados pueden ser poco realistas.
            </p>
          )}
          {planning.kgHaPersonalizado >= 1000 && planning.kgHaPersonalizado <= 10000 && (
            <p className="mt-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1.5">
              ✓ {planning.kgHaPersonalizado.toLocaleString()} kg/ha — dentro del rango operativo.
            </p>
          )}
        </div>
      )}
    </Card>
  );
}
