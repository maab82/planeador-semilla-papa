import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function OwnInventoryForm() {
  const { inventory, setInventory } = useApp();

  function handleChange(field: 'terceraArpillas' | 'cuartaArpillas', value: string) {
    const num = Math.max(0, parseInt(value) || 0);
    setInventory((prev) => ({ ...prev, own: { ...prev.own, [field]: num } }));
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-green-100 p-2 rounded-lg">
          <Home size={18} className="text-green-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Inventario Propio</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Arpillas de Tercera"
          type="number"
          min={0}
          unit="arpillas"
          value={inventory.own.terceraArpillas || ''}
          placeholder="0"
          onChange={(e) => handleChange('terceraArpillas', e.target.value)}
        />
        <Input
          label="Arpillas de Cuarta"
          type="number"
          min={0}
          unit="arpillas"
          value={inventory.own.cuartaArpillas || ''}
          placeholder="0"
          onChange={(e) => handleChange('cuartaArpillas', e.target.value)}
        />
      </div>
    </Card>
  );
}
