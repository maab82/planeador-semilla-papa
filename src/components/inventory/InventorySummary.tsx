import { Package, Weight, Truck, MapPin } from 'lucide-react';
import { InventoryCard } from './InventoryCard';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { useApp } from '../../context/AppContext';
import { calcularInventario } from '../../utils/calculations';

export function InventorySummary() {
  const { inventory, setInventory } = useApp();
  const summary = calcularInventario(inventory);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold text-gray-800">Parámetros de Peso</h3>
        </div>
        <div className="max-w-xs">
          <Input
            label="Peso promedio por arpilla"
            type="number"
            min={1}
            unit="kg"
            value={inventory.weightPerBag}
            onChange={(e) => {
              const num = Math.max(1, parseFloat(e.target.value) || 52);
              setInventory((prev) => ({ ...prev, weightPerBag: num }));
            }}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InventoryCard
          title="Arpillas Totales"
          value={summary.totalArpillas}
          unit="arpillas"
          icon={<Package size={20} />}
          color="green"
        />
        <InventoryCard
          title="Kg Totales"
          value={summary.totalKg.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          unit="kilogramos"
          icon={<Weight size={20} />}
          color="blue"
        />
        <InventoryCard
          title="Toneladas Totales"
          value={summary.totalToneladas.toFixed(2)}
          unit="toneladas"
          icon={<Truck size={20} />}
          color="yellow"
        />
      </div>

      <Card>
        <h3 className="font-semibold text-gray-800 mb-3">Desglose por Calibre y Origen</h3>

        {/* Totales por calibre */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Arpillas Tercera</p>
            <p className="text-xl font-bold text-green-700">{summary.totalArpillasTercera.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Kg Tercera</p>
            <p className="text-xl font-bold text-green-700">{summary.kgTercera.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Arpillas Cuarta</p>
            <p className="text-xl font-bold text-blue-700">{summary.totalArpillasCuarta.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">Kg Cuarta</p>
            <p className="text-xl font-bold text-blue-700">{summary.kgCuarta.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>

        {/* Desglose por origen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-green-100 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={13} className="text-green-600" />
              <p className="text-xs font-semibold text-green-700">Navojoa</p>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Tercera</span>
              <span className="font-semibold">{inventory.own.terceraArpillas.toLocaleString()} arp</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Cuarta</span>
              <span className="font-semibold">{inventory.own.cuartaArpillas.toLocaleString()} arp</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-green-700 mt-2 pt-2 border-t border-green-100">
              <span>Total</span>
              <span>{(inventory.own.terceraArpillas + inventory.own.cuartaArpillas).toLocaleString()} arp</span>
            </div>
          </div>
          <div className="border border-blue-100 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MapPin size={13} className="text-blue-600" />
              <p className="text-xs font-semibold text-blue-700">Caborca</p>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Tercera</span>
              <span className="font-semibold">{inventory.purchased.terceraArpillas.toLocaleString()} arp</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
              <span>Cuarta</span>
              <span className="font-semibold">{inventory.purchased.cuartaArpillas.toLocaleString()} arp</span>
            </div>
            <div className="flex justify-between text-xs font-semibold text-blue-700 mt-2 pt-2 border-t border-blue-100">
              <span>Total</span>
              <span>{(inventory.purchased.terceraArpillas + inventory.purchased.cuartaArpillas).toLocaleString()} arp</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
