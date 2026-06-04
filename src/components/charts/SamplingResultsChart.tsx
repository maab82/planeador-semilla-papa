import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { calcularMuestreosTercera, calcularMuestreosCuarta } from '../../utils/calculations';

export function SamplingResultsChart() {
  const { sampling, inventory } = useApp();
  const hasTercera = sampling.muestreosTercera.length > 0;
  const hasCuarta = sampling.muestreosCuarta.length > 0;

  if (!hasTercera && !hasCuarta) return null;

  const resTercera = calcularMuestreosTercera(sampling, inventory.weightPerBag);
  const resCuarta = calcularMuestreosCuarta(sampling, inventory.weightPerBag);

  const data = [];
  if (hasTercera) {
    data.push({
      calibre: 'Tercera',
      'Segunda': parseFloat(resTercera.pctSegunda.toFixed(1)),
      'Tercera': parseFloat(resTercera.pctTercera.toFixed(1)),
      'Cuarta': parseFloat(resTercera.pctCuarta.toFixed(1)),
      'Merma': parseFloat(resTercera.pctMerma.toFixed(1)),
    });
  }
  if (hasCuarta) {
    data.push({
      calibre: 'Cuarta',
      'Tercera': parseFloat(resCuarta.pctTercera.toFixed(1)),
      'Cuarta': parseFloat(resCuarta.pctCuarta.toFixed(1)),
      'Cuarta Chica': parseFloat(resCuarta.pctCuartaChica.toFixed(1)),
      'Merma': parseFloat(resCuarta.pctMerma.toFixed(1)),
    });
  }

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-3">Distribución por Calibre en Muestreos (%)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="calibre" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit="%" domain={[0, 100]} />
          <Tooltip formatter={(v) => [`${v}%`, '']} />
          <Legend />
          <Bar dataKey="Segunda" fill="#4ade80" />
          <Bar dataKey="Tercera" fill="#16a34a" />
          <Bar dataKey="Cuarta" fill="#2563eb" />
          <Bar dataKey="Cuarta Chica" fill="#93c5fd" />
          <Bar dataKey="Merma" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
