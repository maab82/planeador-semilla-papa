import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../common/Card';
import { useApp } from '../../context/AppContext';
import { calcularInventario } from '../../utils/calculations';

// Verde para Navojoa, Azul para Caborca
const PALETTE = {
  terceraNavojoa: '#15803d',
  cuartaNavojoa:  '#4ade80',
  terceraCaborca: '#1d4ed8',
  cuartaCaborca:  '#60a5fa',
};

const LEGEND_ITEMS = [
  { key: 'terceraNavojoa', label: 'Tercera Navojoa', color: PALETTE.terceraNavojoa },
  { key: 'cuartaNavojoa',  label: 'Cuarta Navojoa',  color: PALETTE.cuartaNavojoa  },
  { key: 'terceraCaborca', label: 'Tercera Caborca', color: PALETTE.terceraCaborca },
  { key: 'cuartaCaborca',  label: 'Cuarta Caborca',  color: PALETTE.cuartaCaborca  },
];

// Etiqueta interna solo si el segmento es lo suficientemente grande
function renderInnerLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) {
  if ((percent ?? 0) < 0.07) return null; // omitir segmentos < 7%
  const RADIAN = Math.PI / 180;
  const _cx = cx ?? 0;
  const _cy = cy ?? 0;
  const _angle = midAngle ?? 0;
  const _inner = innerRadius ?? 0;
  const _outer = outerRadius ?? 0;
  const radius = _inner + (_outer - _inner) * 0.55;
  const x = _cx + radius * Math.cos(-_angle * RADIAN);
  const y = _cy + radius * Math.sin(-_angle * RADIAN);
  return (
    <text
      x={x} y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${((percent ?? 0) * 100).toFixed(0)}%`}
    </text>
  );
}

export function InventoryDistributionChart() {
  const { inventory } = useApp();
  const summary = calcularInventario(inventory);

  if (summary.totalArpillas === 0) return null;

  const data = [
    { name: 'Tercera Navojoa', value: inventory.own.terceraArpillas,       color: PALETTE.terceraNavojoa },
    { name: 'Cuarta Navojoa',  value: inventory.own.cuartaArpillas,        color: PALETTE.cuartaNavojoa  },
    { name: 'Tercera Caborca', value: inventory.purchased.terceraArpillas, color: PALETTE.terceraCaborca },
    { name: 'Cuarta Caborca',  value: inventory.purchased.cuartaArpillas,  color: PALETTE.cuartaCaborca  },
  ].filter((d) => d.value > 0);

  return (
    <Card>
      <h3 className="font-semibold text-gray-800 mb-4">Distribución del Inventario</h3>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Gráfica */}
        <div className="w-full sm:w-1/2 shrink-0">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                labelLine={false}
                label={renderInnerLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString()} arpillas`, '']}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda manual — siempre visible y limpia */}
        <div className="w-full sm:w-1/2 space-y-2">
          {LEGEND_ITEMS.filter((item) =>
            data.some((d) => d.name === item.label),
          ).map((item) => {
            const entry = data.find((d) => d.name === item.label)!;
            const pct = summary.totalArpillas > 0
              ? (entry.value / summary.totalArpillas) * 100
              : 0;
            return (
              <div key={item.key} className="flex items-center gap-2">
                <span
                  className="shrink-0 w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 flex-1">{item.label}</span>
                <span className="text-xs font-semibold text-gray-800 tabular-nums">
                  {entry.value.toLocaleString()} arp
                </span>
                <span className="text-xs text-gray-400 tabular-nums w-10 text-right">
                  {pct.toFixed(1)}%
                </span>
              </div>
            );
          })}
          <div className="pt-2 mt-2 border-t border-gray-100 flex justify-between text-xs text-gray-500 font-medium">
            <span>Total</span>
            <span>{summary.totalArpillas.toLocaleString()} arpillas</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
