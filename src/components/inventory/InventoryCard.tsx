import type { ReactNode } from 'react';
import { Card } from '../common/Card';

interface InventoryCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  color?: 'green' | 'blue' | 'yellow';
}

const colorMap = {
  green: { bg: 'bg-green-100', text: 'text-green-700', value: 'text-green-800' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-700', value: 'text-blue-800' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-700', value: 'text-yellow-800' },
};

export function InventoryCard({ title, value, unit, icon, color = 'green' }: InventoryCardProps) {
  const colors = colorMap[color];
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className={`${colors.bg} p-2.5 rounded-lg`}>
          <span className={colors.text}>{icon}</span>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold ${colors.value} mt-0.5`}>
            {typeof value === 'number' ? value.toLocaleString('es-MX', { maximumFractionDigits: 2 }) : value}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{unit}</p>
        </div>
      </div>
    </Card>
  );
}
