import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Card } from '../common/Card';
import type { ResultsData } from '../../types/results';

interface Props {
  results: ResultsData;
}

export function PlantingComparisonChart({ results }: Props) {
  const { historico, poblacional, hectareasObjetivo } = results;

  const data = [
    { name: 'Meta', hectareas: hectareasObjetivo, fill: '#6b7280' },
    { name: 'Histórico', hectareas: parseFloat(historico.hectareas.toFixed(2)), fill: historico.alcanza ? '#16a34a' : '#dc2626' },
    ...(poblacional.disponible
      ? [{ name: 'Poblacional', hectareas: parseFloat(poblacional.hectareas.toFixed(2)), fill: poblacional.alcanza ? '#2563eb' : '#dc2626' }]
      : []),
  ];

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-3">Meta vs Ambos Métodos (ha)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit=" ha" />
          <Tooltip formatter={(v) => [`${Number(v).toFixed(2)} ha`, 'Hectáreas']} />
          <ReferenceLine y={hectareasObjetivo} stroke="#6b7280" strokeDasharray="4 4" label={{ value: 'Meta', position: 'right', fontSize: 11, fill: '#6b7280' }} />
          <Bar dataKey="hectareas" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="hectareas" position="top" formatter={(v: unknown) => `${Number(v).toFixed(1)}`} style={{ fontSize: 11, fontWeight: 700 }} />
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
