import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function PurchasedInventoryForm() {
  const { inventory, setInventory } = useApp();

  function handleChange(field: 'terceraArpillas' | 'cuartaArpillas', value: string) {
    const num = Math.max(0, parseInt(value) || 0);
    setInventory((prev) => ({ ...prev, purchased: { ...prev.purchased, [field]: num } }));
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <ShoppingCart size={18} className="text-blue-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Inventario Comprado</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Arpillas de Tercera"
          type="number"
          min={0}
          unit="arpillas"
          value={inventory.purchased.terceraArpillas || ''}
          placeholder="0"
          onChange={(e) => handleChange('terceraArpillas', e.target.value)}
        />
        <Input
          label="Arpillas de Cuarta"
          type="number"
          min={0}
          unit="arpillas"
          value={inventory.purchased.cuartaArpillas || ''}
          placeholder="0"
          onChange={(e) => handleChange('cuartaArpillas', e.target.value)}
        />
      </div>
    </Card>
  );
}
