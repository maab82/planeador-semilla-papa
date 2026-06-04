import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'green' | 'red' | 'yellow' | 'blue';
}

const variantClasses: Record<string, string> = {
  default: 'bg-white border border-gray-200',
  green: 'bg-green-50 border border-green-200',
  red: 'bg-red-50 border border-red-200',
  yellow: 'bg-yellow-50 border border-yellow-200',
  blue: 'bg-blue-50 border border-blue-200',
};

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  return (
    <div className={`rounded-xl shadow-sm p-4 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
