import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

interface PlantingComparisonChartProps {
  results: ResultsData;
}

export function PlantingComparisonChart({ results }: PlantingComparisonChartProps) {
  const data = [
    { name: 'Meta de Siembra', hectareas: results.hectareasObjetivo, fill: '#6b7280' },
    { name: 'Capacidad Estimada', hectareas: parseFloat(results.hectareasPostbles.toFixed(2)), fill: results.alcanza ? '#16a34a' : '#dc2626' },
  ];

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-3">Meta vs Capacidad Estimada</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit=" ha" />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(2)} ha`, 'Hectáreas']} />
          <ReferenceLine y={results.hectareasObjetivo} stroke="#6b7280" strokeDasharray="4 4" />
          <Bar dataKey="hectareas" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
