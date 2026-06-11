import { useState } from 'react';
import { Plus, Trash2, FlaskConical, MapPin, Leaf, Package, Calendar, Truck } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import type { SampleTercera, OrigenMuestra, VariedadMuestra } from '../../types/sampling';

function generateId() {
  return `t3_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

const emptyForm = (): Omit<SampleTercera, 'id'> => ({
  pesoMuestra: 0,
  unidadesSegunda: 0,
  unidadesTercera: 0,
  unidadesCuarta: 0,
  unidadesQuinta: 0,
  unidadesMerma: 0,
  proveedor: '',
  origen: undefined,
  variedad: undefined,
  viaje: '',
  fechaRecepcion: todayISO(),
  toneladasViaje: undefined,
});

function formatFecha(fecha?: string) {
  if (!fecha) return null;
  const [y, m, d] = fecha.split('-');
  return `${d}/${m}/${y}`;
}

function origenLabel(o?: OrigenMuestra) {
  if (o === 'navojoa') return 'Navojoa';
  if (o === 'caborca') return 'Caborca';
  if (o === 'otro') return 'Otro';
  return null;
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

  const proveedorText = s.proveedor || 'Proveedor no especificado';
  const origenText = origenLabel(s.origen);
  const viajeText = s.viaje || s.lote;
  const fechaText = formatFecha(s.fechaRecepcion ?? s.fecha ?? undefined);
  const variedadText = s.variedad ? s.variedad.charAt(0).toUpperCase() + s.variedad.slice(1) : null;

  return (
    <div className="border border-gray-200 rounded-xl p-3 bg-white hover:border-green-300 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm leading-tight uppercase">
            {proveedorText}
            {origenText && <span className="text-gray-500"> · {origenText}</span>}
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
            {viajeText && (
              <span className="text-xs text-gray-600 font-medium">Viaje {viajeText}</span>
            )}
            {variedadText && (
              <span className="text-xs text-gray-500">{variedadText}</span>
            )}
            {fechaText && (
              <span className="text-xs text-gray-400">{fechaText}</span>
            )}
            {!viajeText && !variedadText && !fechaText && (
              <span className="text-xs text-gray-400">Muestra #{index + 1}</span>
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
  const [showValidation, setShowValidation] = useState(false);

  const viajeValido = !!(form.proveedor && form.origen && form.viaje);

  function handleAdd() {
    if (form.pesoMuestra <= 0) return;
    if (!viajeValido) {
      setShowValidation(true);
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
      proveedor: form.proveedor,
      origen: form.origen,
      viaje: form.viaje,
      fechaRecepcion: form.fechaRecepcion,
      ...(form.variedad ? { variedad: form.variedad } : {}),
      ...(form.toneladasViaje !== undefined ? { toneladasViaje: form.toneladasViaje } : {}),
    };
    setSampling((prev) => ({ ...prev, muestreosTercera: [...prev.muestreosTercera, newSample] }));
    setForm(emptyForm());
    setAdding(false);
    setShowValidation(false);
  }

  function handleDelete(id: string) {
    setSampling((prev) => ({ ...prev, muestreosTercera: prev.muestreosTercera.filter((s) => s.id !== id) }));
  }

  function handleNum(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  }

  function handleText(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (showValidation) setShowValidation(false);
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

          {/* Datos del Viaje */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Truck size={11} /> Datos del Viaje
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Proveedor */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Package size={10} /> Proveedor <span className="text-red-400">*</span>
                </label>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.proveedor ?? ''}
                  onChange={(e) => handleText('proveedor', e.target.value)}
                >
                  <option value="">— Seleccionar</option>
                  <option value="Agrofon">Agrofon</option>
                  <option value="Agrícola Rábago">Agrícola Rábago</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              {/* Origen */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <MapPin size={10} /> Origen <span className="text-red-400">*</span>
                </label>
                <select
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.origen ?? ''}
                  onChange={(e) => handleText('origen', e.target.value as OrigenMuestra | '')}
                >
                  <option value="">— Seleccionar</option>
                  <option value="navojoa">Navojoa</option>
                  <option value="caborca">Caborca</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              {/* Viaje */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Truck size={10} /> No. de Viaje / Thermo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.viaje ?? ''}
                  placeholder="6165"
                  onChange={(e) => handleText('viaje', e.target.value)}
                />
              </div>
              {/* Fecha Recepción */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                  <Calendar size={10} /> Fecha Recepción
                </label>
                <input
                  type="date"
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  value={form.fechaRecepcion ?? ''}
                  onChange={(e) => handleText('fechaRecepcion', e.target.value)}
                />
              </div>
              {/* Variedad */}
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
              {/* Toneladas del Viaje — eliminado del formulario (campo toneladasViaje conservado en tipo para compat. histórica) */}
            </div>
          </div>

          {/* Conteo de calibres */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
              <FlaskConical size={11} /> Conteo de calibres
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Input
                label="Peso de la arpilla (kg)"
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

          {showValidation && !viajeValido && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Complete los datos del viaje antes de registrar el muestreo.
            </p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={form.pesoMuestra <= 0}>Guardar Muestra</Button>
            <Button variant="secondary" onClick={() => { setAdding(false); setForm(emptyForm()); setShowValidation(false); }}>Cancelar</Button>
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
