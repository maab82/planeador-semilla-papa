import { PlantingGoal } from '../planning/PlantingGoal';
import { CalculationMethodSelector } from '../planning/CalculationMethod';
import { AdvancedSettings } from '../planning/AdvancedSettings';
import { HistoricalReference } from '../sampling/HistoricalReference';

export function PlanningTab() {
  return (
    <div className="space-y-4">
      <PlantingGoal />
      <CalculationMethodSelector />
      <AdvancedSettings />
      <HistoricalReference />
    </div>
  );
}
