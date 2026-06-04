import { SamplingFormTercera } from '../sampling/SamplingFormTercera';
import { SamplingFormCuarta } from '../sampling/SamplingFormCuarta';
import { SamplingResults } from '../sampling/SamplingResults';
import { HistoricalReference } from '../sampling/HistoricalReference';
import { SamplingResultsChart } from '../charts/SamplingResultsChart';

export function SamplingTab() {
  return (
    <div className="space-y-4">
      <SamplingFormTercera />
      <SamplingFormCuarta />
      <SamplingResults />
      <SamplingResultsChart />
      <HistoricalReference />
    </div>
  );
}
