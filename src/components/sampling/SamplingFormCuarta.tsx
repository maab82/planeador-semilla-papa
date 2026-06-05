import { useState } from 'react';
import { Plus, Trash2, FlaskConical } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { SampleCuarta } from '../../types/sampling';

function generateId() {
  return `t4_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const emptyForm = (): Omit<SampleCuarta, 'id'> => ({
  pesoMuestra: 0,
  unidadesTercera: 0,
  unidadesCuarta: 0,
  unidadesCuartaChica: 0,
  unidadesQuinta: 0,
  unidadesMerma: 0,
});

export function SamplingFormCuarta() {
  const { sampling, setSampling } = useApp();
  const [form, setForm] = useState(emptyForm());
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (form.pesoMuestra <= 0) return;
    const newSample: SampleCuarta = { id: generateId(), ...form };
    setSampling((prev) => ({ ...prev, muestreosCuarta: [...prev.muestreosCuarta, newSample] }));
    setForm(emptyForm());
    setAdding(false);
  }

  function handleDelete(id: string) {
    setSampling((prev) => ({ ...prev, muestreosCuarta: prev.muestreosCuarta.filter((s) => s.id !== id) }));
  }

  function handleFormChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FlaskConical size={18} className="text-blue-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Muestreos de Cuarta</h3>
            <p className="text-xs text-gray-500">{sampling.muestreosCuarta.length} muestra(s) registrada(s)</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus size={15} />
          Agregar Muestra
        </Button>
      </div>

      {adding && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-blue-800 mb-3">Nueva Muestra — Cuarta</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Input
              label="Peso Muestra"
              type="number"
              min={0}
              step={0.1}
              unit="kg"
              value={form.pesoMuestra || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('pesoMuestra', e.target.value)}
            />
            <Input
              label="Unidades Tercera"
              type="number"
              min={0}
              value={form.unidadesTercera || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('unidadesTercera', e.target.value)}
            />
            <Input
              label="Unidades Cuarta"
              type="number"
              min={0}
              value={form.unidadesCuarta || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('unidadesCuarta', e.target.value)}
            />
            <Input
              label="Unidades Cuarta Chica"
              type="number"
              min={0}
              value={form.unidadesCuartaChica || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('unidadesCuartaChica', e.target.value)}
            />
            <Input
              label="Unidades Quinta"
              type="number"
              min={0}
              value={form.unidadesQuinta || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('unidadesQuinta', e.target.value)}
            />
            <Input
              label="Unidades Merma"
              type="number"
              min={0}
              value={form.unidadesMerma || ''}
              placeholder="0"
              onChange={(e) => handleFormChange('unidadesMerma', e.target.value)}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleAdd} disabled={form.pesoMuestra <= 0}>
              Guardar Muestra
            </Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setForm(emptyForm()); }}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {sampling.muestreosCuarta.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
                <th className="text-left px-3 py-2">#</th>
                <th className="text-right px-3 py-2">Peso (kg)</th>
                <th className="text-right px-3 py-2">3ra</th>
                <th className="text-right px-3 py-2">4ta</th>
                <th className="text-right px-3 py-2">4ta Chica</th>
                <th className="text-right px-3 py-2">Quinta</th>
                <th className="text-right px-3 py-2">Merma</th>
                <th className="text-right px-3 py-2">Total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sampling.muestreosCuarta.map((s, i) => {
                const quinta = s.unidadesQuinta ?? 0;
                const total = s.unidadesTercera + s.unidadesCuarta + s.unidadesCuartaChica + quinta + s.unidadesMerma;
                return (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-3 py-2 text-right font-medium">{s.pesoMuestra}</td>
                    <td className="px-3 py-2 text-right">{s.unidadesTercera}</td>
                    <td className="px-3 py-2 text-right">{s.unidadesCuarta}</td>
                    <td className="px-3 py-2 text-right">{s.unidadesCuartaChica}</td>
                    <td className="px-3 py-2 text-right">{quinta}</td>
                    <td className="px-3 py-2 text-right">{s.unidadesMerma}</td>
                    <td className="px-3 py-2 text-right font-semibold text-blue-700">{total}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {sampling.muestreosCuarta.length === 0 && !adding && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No hay muestras registradas. Haga clic en "Agregar Muestra" para comenzar.
        </div>
      )}
    </Card>
  );
}
