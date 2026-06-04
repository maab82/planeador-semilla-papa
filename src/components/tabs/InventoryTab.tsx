import { OwnInventoryForm } from '../inventory/OwnInventoryForm';
import { PurchasedInventoryForm } from '../inventory/PurchasedInventoryForm';
import { InventorySummary } from '../inventory/InventorySummary';
import { InventoryDistributionChart } from '../charts/InventoryDistributionChart';

export function InventoryTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <OwnInventoryForm />
        <PurchasedInventoryForm />
      </div>
      <InventorySummary />
      <InventoryDistributionChart />
    </div>
  );
}
