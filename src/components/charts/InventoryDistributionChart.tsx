import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { calcularInventario } from '../../utils/calculations';

const COLORS = ['#15803d', '#1d4ed8', '#16a34a', '#2563eb'];

export function InventoryDistributionChart() {
  const { inventory } = useApp();
  const summary = calcularInventario(inventory);

  if (summary.totalArpillas === 0) return null;

  const data = [
    { name: 'Tercera Propia', value: inventory.own.terceraArpillas, color: COLORS[0] },
    { name: 'Cuarta Propia', value: inventory.own.cuartaArpillas, color: COLORS[1] },
    { name: 'Tercera Comprada', value: inventory.purchased.terceraArpillas, color: COLORS[2] },
    { name: 'Cuarta Comprada', value: inventory.purchased.cuartaArpillas, color: COLORS[3] },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-3">Distribución del Inventario</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} arpillas`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
