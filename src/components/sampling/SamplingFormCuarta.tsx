import { useState } from 'react';
import { Plus, Trash2, FlaskConical, MapPin, Leaf, Package, Calendar, Weight } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { SampleCuarta, OrigenMuestra, VariedadMuestra } from '../../types/sampling';

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
  origen: undefined,
  variedad: undefined,
  lote: '',
  fecha: '',
  kgSegunda: 0,
  kgTercera: 0,
  kgCuarta: 0,
  kgQuinta: 0,
  kgNoAprovechable: 0,
  kgTierra: 0,
  kgSanidad: 0,
});

function formatFecha(fecha?: string) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

function SampleCard({ s, index, onDelete }: {
  s: SampleCuarta;
  index: number;
  onDelete: (id: string) => void;
}) {
  const quinta = s.unidadesQuinta ?? 0;
  const total = s.unidadesTercera + s.unidadesCuarta + s.unidadesCuartaChica + quinta + s.unidadesMerma;
  const pctMerma = total > 0 ? ((s.unidadesMerma / total) * 100).toFixed(0) : '0';
  const pctUtil = total > 0 ? (((s.unidadesTercera + s.unidadesCuarta + s.unidadesCuartaChica) / total) * 100).toFixed(0) : '0';

  const kgClasificados = (s.kgSegunda ?? 0) + (s.kgTercera ?? 0) + (s.kgCuarta ?? 0) +
    (s.kgQuinta ?? 0) + (s.kgNoAprovechable ?? 0) + (s.kgTierra ?? 0) + (s.kgSanidad ?? 0);
  const hasKgData = kgClasificados > 0;
  const kgSinClasificar = hasKgData && s.pesoMuestra > 0
    ? Math.max(0, parseFloat((s.pesoMuestra - kgClasificados).toFixed(2)))
    : 0;

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate uppercase">
            {s.lote || `Muestra #${index + 1}`}
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {s.variedad && <span className="text-xs text-gray-500 capitalize">{s.variedad}</span>}
            {s.origen && <span className="text-xs text-gray-500 capitalize">{s.origen === 'navojoa' ? 'Navojoa' : 'Caborca'}</span>}
            {s.fecha && <span className="text-xs text-gray-400">{formatFecha(s.fecha)}</span>}
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
          { label: '3ra',    value: s.unidadesTercera,     color: 'text-green-700' },
          { label: '4ta',    value: s.unidadesCuarta,      color: 'text-blue-700' },
          { label: '4ta Ch', value: s.unidadesCuartaChica, color: 'text-blue-500' },
          { label: 'Quinta', value: quinta,                 color: 'text-violet-500' },
          { label: 'Merma',  value: s.unidadesMerma,       color: 'text-red-500' },
          { label: 'Total',  value: total,                  color: 'text-gray-800 font-semibold' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-lg py-1 px-0.5">
            <p className={`text-sm font-medium ${color}`}>{value}</p>
            <p className="text-xs text-gray-400 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
        <span>{s.pesoMuestra} kg</span>
        {hasKgData ? (
          kgSinClasificar >= 0.05 ? (
            <span className="text-amber-600 font-medium">{kgSinClasificar.toFixed(1)} kg s/c</span>
          ) : (
            <span className="text-emerald-600 font-medium">kg completos</span>
          )
        ) : (
          <>
            <span className="text-emerald-600 font-medium">Útil {pctUtil}%</span>
            <span className="text-red-500">Merma {pctMerma}%</span>
          </>
        )}
      </div>
    </div>
  );
}

export function SamplingFormCuarta() {
  const { sampling, setSampling } = useApp();
  const [form, setForm] = useState(emptyForm());
  const [adding, setAdding] = useState(false);

  function handleAdd() {
    if (form.pesoMuestra <= 0) return;
    const newSample: SampleCuarta = {
      id: generateId(),
      pesoMuestra: form.pesoMuestra,
      unidadesTercera: form.unidadesTercera,
      unidadesCuarta: form.unidadesCuarta,
      unidadesCuartaChica: form.unidadesCuartaChica,
      unidadesQuinta: form.unidadesQuinta,
      unidadesMerma: form.unidadesMerma,
      ...(form.origen ? { origen: form.origen } : {}),
      ...(form.variedad ? { variedad: form.variedad } : {}),
      ...(form.lote ? { lote: form.lote } : {}),
      ...(form.fecha ? { fecha: form.fecha } : {}),
      kgSegunda: form.kgSegunda ?? 0,
      kgTercera: form.kgTercera ?? 0,
      kgCuarta: form.kgCuarta ?? 0,
      kgQuinta: form.kgQuinta ?? 0,
      kgNoAprovechable: form.kgNoAprovechable ?? 0,
      kgTierra: form.kgTierra ?? 0,
      kgSanidad: form.kgSanidad ?? 0,
    };
    setSampling((prev) => ({ ...prev, muestreosCuarta: [...prev.muestreosCuarta, newSample] }));
    setForm(emptyForm());
    setAdding(false);
  }

  function handleDelete(id: string) {
    setSampling((prev) => ({ ...prev, muestreosCuarta: prev.muestreosCuarta.filter((s) => s.id !== id) }));
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
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 space-y-4">
          <p className="text-sm font-semibold text-blue-800">Nueva Muestra — Cuarta</p>

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
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              <Input label="Peso Muestra" type="number" min={0} step={0.1} unit="kg" value={form.pesoMuestra || ''} placeholder="0" onChange={(e) => handleNum('pesoMuestra', e.target.value)} />
              <Input label="Unidades Tercera" type="number" min={0} value={form.unidadesTercera || ''} placeholder="0" onChange={(e) => handleNum('unidadesTercera', e.target.value)} />
              <Input label="Unidades Cuarta" type="number" min={0} value={form.unidadesCuarta || ''} placeholder="0" onChange={(e) => handleNum('unidadesCuarta', e.target.value)} />
              <Input label="Unidades Cuarta Chica" type="number" min={0} value={form.unidadesCuartaChica || ''} placeholder="0" onChange={(e) => handleNum('unidadesCuartaChica', e.target.value)} />
              <Input label="Unidades Quinta" type="number" min={0} value={form.unidadesQuinta || ''} placeholder="0" onChange={(e) => handleNum('unidadesQuinta', e.target.value)} />
              <Input label="Unidades Merma" type="number" min={0} value={form.unidadesMerma || ''} placeholder="0" onChange={(e) => handleNum('unidadesMerma', e.target.value)} />
            </div>
          </div>

          {/* Análisis de calidad en kg */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Weight size={11} /> Análisis de calidad (kg) — opcional
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Input label="kg Segunda"        type="number" min={0} step={0.1} value={form.kgSegunda        || ''} placeholder="0.0" onChange={(e) => handleNum('kgSegunda',        e.target.value)} />
              <Input label="kg Tercera"         type="number" min={0} step={0.1} value={form.kgTercera         || ''} placeholder="0.0" onChange={(e) => handleNum('kgTercera',         e.target.value)} />
              <Input label="kg Cuarta"          type="number" min={0} step={0.1} value={form.kgCuarta          || ''} placeholder="0.0" onChange={(e) => handleNum('kgCuarta',          e.target.value)} />
              <Input label="kg Quinta"          type="number" min={0} step={0.1} value={form.kgQuinta          || ''} placeholder="0.0" onChange={(e) => handleNum('kgQuinta',          e.target.value)} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              <Input label="kg No aprovechable" type="number" min={0} step={0.1} value={form.kgNoAprovechable  || ''} placeholder="0.0" onChange={(e) => handleNum('kgNoAprovechable',  e.target.value)} />
              <Input label="kg Tierra / inerte" type="number" min={0} step={0.1} value={form.kgTierra          || ''} placeholder="0.0" onChange={(e) => handleNum('kgTierra',          e.target.value)} />
              <Input label="kg Sanidad"         type="number" min={0} step={0.1} value={form.kgSanidad         || ''} placeholder="0.0" onChange={(e) => handleNum('kgSanidad',         e.target.value)} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={form.pesoMuestra <= 0}>Guardar Muestra</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setForm(emptyForm()); }}>Cancelar</Button>
          </div>
        </div>
      )}

      {sampling.muestreosCuarta.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sampling.muestreosCuarta.map((s, i) => (
            <SampleCard key={s.id} s={s} index={i} onDelete={handleDelete} />
          ))}
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
