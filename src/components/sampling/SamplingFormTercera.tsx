import { useState } from 'react';
import { Plus, Trash2, FlaskConical, MapPin, Leaf, Package, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { SampleTercera, OrigenMuestra, VariedadMuestra } from '../../types/sampling';

function generateId() {
  return `t3_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

const emptyForm = (): Omit<SampleTercera, 'id'> => ({
  pesoMuestra: 0,
  unidadesSegunda: 0,
  unidadesTercera: 0,
  unidadesCuarta: 0,
  unidadesQuinta: 0,
  unidadesMerma: 0,
  origen: undefined,
  variedad: undefined,
  lote: '',
  fecha: '',
});

function formatFecha(fecha?: string) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

function SampleCard({ s, index, onDelete }: {
  s: SampleTercera;
  index: number;
  onDelete: (id: string) => void;
}) {
  const quinta = s.unidadesQuinta ?? 0;
  const total = s.unidadesSegunda + s.unidadesTercera + s.unidadesCuarta + quinta + s.unidadesMerma;
  const pctMerma = total > 0 ? ((s.unidadesMerma / total) * 100).toFixed(0) : '0';
  const pctUtil = total > 0 ? (((s.unidadesSegunda + s.unidadesTercera + s.unidadesCuarta) / total) * 100).toFixed(0) : '0';

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white hover:border-green-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate uppercase">
            {s.lote || `Muestra #${index + 1}`}
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {s.variedad && (
              <span className="text-xs text-gray-500 capitalize">{s.variedad}</span>
            )}
            {s.origen && (
              <span className="text-xs text-gray-500 capitalize">{s.origen === 'navojoa' ? 'Navojoa' : 'Caborca'}</span>
            )}
            {s.fecha && (
              <span className="text-xs text-gray-400">{formatFecha(s.fecha)}</span>
            )}
            {!s.variedad && !s.origen && !s.fecha && (
              <span className="text-xs text-gray-400">Sin identificación</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(s.id)}
          className="text-red-300 hover:text-red-500 transition-colors shrink-0 cursor-pointer mt-0.5"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="grid grid-cols-6 gap-1 text-center">
        {[
          { label: '2da',   value: s.unidadesSegunda, color: 'text-green-700' },
          { label: '3ra',   value: s.unidadesTercera, color: 'text-green-700' },
          { label: '4ta',   value: s.unidadesCuarta,  color: 'text-yellow-600' },
          { label: 'Qta',   value: quinta,             color: 'text-violet-500' },
          { label: 'Merma', value: s.unidadesMerma,   color: 'text-red-500' },
          { label: 'Total', value: total,              color: 'text-gray-800 font-semibold' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg py-1 px-0.5">
            <p className={`text-sm font-medium ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span>{s.pesoMuestra} kg</span>
        <span className="text-emerald-600 font-medium">Útil {pctUtil}%</span>
        <span className="text-red-500">Merma {pctMerma}%</span>
      </div>
    </div>
  );
}

export function SamplingFormTercera() {
  const { sampling, setSampling } = useApp();
  const [form, setForm] = useState(emptyForm());
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    console.log('[DEBUG T3] handleAdd fired. pesoMuestra:', form.pesoMuestra);
    if (form.pesoMuestra <= 0) {
      console.log('[DEBUG T3] BLOCKED: pesoMuestra <= 0');
      return;
    }
    const newSample: SampleTercera = {
      id: generateId(),
      pesoMuestra: form.pesoMuestra,
      unidadesSegunda: form.unidadesSegunda,
      unidadesTercera: form.unidadesTercera,
      unidadesCuarta: form.unidadesCuarta,
      unidadesQuinta: form.unidadesQuinta ?? 0,
      unidadesMerma: form.unidadesMerma,
      ...(form.origen ? { origen: form.origen } : {}),
      ...(form.variedad ? { variedad: form.variedad } : {}),
      ...(form.lote ? { lote: form.lote } : {}),
      ...(form.fecha ? { fecha: form.fecha } : {}),
    };
    console.log('[DEBUG T3] newSample built:', JSON.stringify(newSample));
    setSampling((prev) => {
      console.log('[DEBUG T3] setSampling updater — prev.muestreosTercera.length:', prev.muestreosTercera.length);
      const updated = { ...prev, muestreosTercera: [...prev.muestreosTercera, newSample] };
      console.log('[DEBUG T3] updated.muestreosTercera.length:', updated.muestreosTercera.length);
      return updated;
    });
    setTimeout(() => {
      const raw = localStorage.getItem('psp_sampling');
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        console.log('[DEBUG T3] localStorage psp_sampling.muestreosTercera.length:', parsed?.muestreosTercera?.length ?? 'N/A');
      } catch {
        console.log('[DEBUG T3] localStorage psp_sampling raw:', raw);
      }
    }, 300);
    setForm(emptyForm());
    setAdding(false);
    console.log('[DEBUG T3] handleAdd complete — form reset, adding=false');
  }

  function handleDelete(id: string) {
    setSampling((prev) => ({ ...prev, muestreosTercera: prev.muestreosTercera.filter((s) => s.id !== id) }));
  }

  function handleNum(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }

  function handleText(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-2 rounded-lg">
            <FlaskConical size={18} className="text-green-700" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Muestreos de Tercera</h3>
            <p className="text-xs text-gray-500">{sampling.muestreosTercera.length} muestra(s) registrada(s)</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setAdding(!adding)}>
          <Plus size={15} />
          Agregar Muestra
        </Button>
      </div>

      {adding && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 space-y-4">
          <p className="text-sm font-semibold text-green-800">Nueva Muestra — Tercera</p>

          {/* Identificación del lote */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Package size={11} /> Identificación
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input
                label="Lote / Viaje"
                type="text"
                value={form.lote ?? ''}
                placeholder="Thermo 478"
                onChange={(e) => handleText('lote', e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <MapPin size={10} /> Origen
                </label>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.origen ?? ''}
                  onChange={(e) => handleText('origen', e.target.value as OrigenMuestra | '')}
                >
                  <option value="">— Sin especificar</option>
                  <option value="navojoa">Navojoa</option>
                  <option value="caborca">Caborca</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Leaf size={10} /> Variedad
                </label>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.variedad ?? ''}
                  onChange={(e) => handleText('variedad', e.target.value as VariedadMuestra | '')}
                >
                  <option value="">— Sin especificar</option>
                  <option value="fianna">Fianna</option>
                  <option value="orquesta">Orquesta</option>
                  <option value="otra">Otra</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar size={10} /> Fecha
                </label>
                <input
                  type="date"
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.fecha ?? ''}
                  onChange={(e) => handleText('fecha', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Conteo de calibres */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <FlaskConical size={11} /> Conteo de calibres
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Peso Muestra"
                type="number" min={0} step={0.1} unit="kg"
                value={form.pesoMuestra || ''}
                placeholder="0"
                onChange={(e) => handleNum('pesoMuestra', e.target.value)}
              />
              <Input label="Unidades Segunda" type="number" min={0} value={form.unidadesSegunda || ''} placeholder="0" onChange={(e) => handleNum('unidadesSegunda', e.target.value)} />
              <Input label="Unidades Tercera" type="number" min={0} value={form.unidadesTercera || ''} placeholder="0" onChange={(e) => handleNum('unidadesTercera', e.target.value)} />
              <Input label="Unidades Cuarta" type="number" min={0} value={form.unidadesCuarta || ''} placeholder="0" onChange={(e) => handleNum('unidadesCuarta', e.target.value)} />
              <Input label="Unidades Quinta" type="number" min={0} value={form.unidadesQuinta || ''} placeholder="0" onChange={(e) => handleNum('unidadesQuinta', e.target.value)} />
              <Input label="Unidades Merma" type="number" min={0} value={form.unidadesMerma || ''} placeholder="0" onChange={(e) => handleNum('unidadesMerma', e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={form.pesoMuestra <= 0}>Guardar Muestra</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setForm(emptyForm()); }}>Cancelar</Button>
          </div>
        </div>
      )}

      {sampling.muestreosTercera.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampling.muestreosTercera.map((s, i) => (
            <SampleCard key={s.id} s={s} index={i} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {sampling.muestreosTercera.length === 0 && !adding && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No hay muestras registradas. Haga clic en "Agregar Muestra" para comenzar.
        </div>
      )}
    </Card>
  );
}
