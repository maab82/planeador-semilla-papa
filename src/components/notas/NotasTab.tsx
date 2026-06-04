import { useState } from 'react';
import { Plus, Trash2, ClipboardList, BarChart2, Calendar } from 'lucide-react';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { calcularResultados } from '../../utils/calculations';
import type { EtapaNota, NotaValidacion } from '../../types/notas';

const ETAPAS: { value: EtapaNota; label: string; color: string }[] = [
  { value: 'pre-criba',  label: 'Pre-criba',  color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'post-criba', label: 'Post-criba', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'siembra',    label: 'Siembra',    color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'general',    label: 'General',    color: 'bg-gray-100 text-gray-700 border-gray-300' },
];

function etapaColor(etapa: EtapaNota): string {
  return ETAPAS.find(e => e.value === etapa)?.color ?? 'bg-gray-100 text-gray-700 border-gray-300';
}
function etapaLabel(etapa: EtapaNota): string {
  return ETAPAS.find(e => e.value === etapa)?.label ?? etapa;
}

function generateId() {
  return `nota_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function NotasTab() {
  const { inventory, sampling, planning, notas, setNotas } = useApp();
  const results = calcularResultados(inventory, sampling, planning);

  const [addingNota, setAddingNota] = useState(false);
  const [form, setForm] = useState<Omit<NotaValidacion, 'id'>>({
    fecha: new Date().toISOString().slice(0, 10),
    etapa: 'general',
    titulo: '',
    contenido: '',
  });

  function handleAddNota() {
    if (!form.titulo.trim()) return;
    const nueva: NotaValidacion = { id: generateId(), ...form };
    setNotas(prev => ({ ...prev, notas: [nueva, ...prev.notas] }));
    setForm({ fecha: new Date().toISOString().slice(0, 10), etapa: 'general', titulo: '', contenido: '' });
    setAddingNota(false);
  }

  function handleDeleteNota(id: string) {
    setNotas(prev => ({ ...prev, notas: prev.notas.filter(n => n.id !== id) }));
  }

  function handleResultadosReales(field: string, value: string | number) {
    setNotas(prev => ({ ...prev, resultadosReales: { ...prev.resultadosReales, [field]: value } }));
  }

  const kgHaReal = notas.resultadosReales.hectareasSembradas > 0 && notas.resultadosReales.toneladasUsadas > 0
    ? (notas.resultadosReales.toneladasUsadas * 1000) / notas.resultadosReales.hectareasSembradas
    : notas.resultadosReales.kgHaReal;

  const haResultados = notas.resultadosReales.hectareasSembradas > 0;

  return (
    <div className="space-y-4">

      {/* Cabecera */}
      <div className="bg-gray-800 text-white rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList size={18} />
          <h2 className="text-base font-bold">Notas de Validación</h2>
        </div>
        <p className="text-gray-300 text-xs">
          Registre observaciones durante la temporada para comparar las proyecciones con los resultados reales.
        </p>
      </div>

      {/* Temporada */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={16} className="text-gray-600" />
          <h3 className="font-semibold text-gray-800">Temporada</h3>
        </div>
        <div className="max-w-xs">
          <Input
            label="Identificador de temporada"
            type="text"
            placeholder="Ej: 2025-2026"
            value={notas.temporada}
            onChange={e => setNotas(prev => ({ ...prev, temporada: e.target.value }))}
          />
        </div>
      </Card>

      {/* Proyecciones actuales (solo lectura) */}
      <Card variant="blue">
        <h3 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">
          Proyecciones Actuales (referencia)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-white rounded-lg p-2 border border-blue-100">
            <p className="text-gray-500">Kg disponibles</p>
            <p className="font-bold text-gray-800">{results.kgTotales.toLocaleString('es-MX', { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-white rounded-lg p-2 border border-blue-100">
            <p className="text-gray-500">Ha Histórico</p>
            <p className="font-bold text-green-700">{results.historico.hectareas.toFixed(2)}</p>
          </div>
          {results.poblacional.disponible && (
            <div className="bg-white rounded-lg p-2 border border-blue-100">
              <p className="text-gray-500">Ha Poblacional</p>
              <p className="font-bold text-blue-700">{results.poblacional.hectareas.toFixed(2)}</p>
            </div>
          )}
          <div className="bg-white rounded-lg p-2 border border-blue-100">
            <p className="text-gray-500">Meta</p>
            <p className="font-bold text-gray-700">{results.hectareasObjetivo} ha</p>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Estos valores se calculan desde el inventario y muestreos actuales. Exportar el JSON guarda una copia del estado completo.
        </p>
      </Card>

      {/* Notas */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList size={16} className="text-gray-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Observaciones</h3>
              <p className="text-xs text-gray-500">{notas.notas.length} nota(s) registrada(s)</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setAddingNota(!addingNota)}>
            <Plus size={15} />
            Nueva Nota
          </Button>
        </div>

        {addingNota && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 space-y-3">
            <p className="text-sm font-medium text-gray-700">Nueva observación</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Fecha"
                type="date"
                value={form.fecha}
                onChange={e => setForm(prev => ({ ...prev, fecha: e.target.value }))}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Etapa</label>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  value={form.etapa}
                  onChange={e => setForm(prev => ({ ...prev, etapa: e.target.value as EtapaNota }))}
                >
                  {ETAPAS.map(e => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input
              label="Título"
              type="text"
              placeholder="Resumen breve de la observación"
              value={form.titulo}
              onChange={e => setForm(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Contenido</label>
              <textarea
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
                placeholder="Descripción detallada, condiciones del lote, observaciones del muestreo..."
                value={form.contenido}
                onChange={e => setForm(prev => ({ ...prev, contenido: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddNota} disabled={!form.titulo.trim()}>
                Guardar Nota
              </Button>
              <Button variant="secondary" onClick={() => setAddingNota(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {notas.notas.length === 0 && !addingNota && (
          <p className="text-center text-gray-400 text-sm py-6">
            Sin observaciones registradas. Haga clic en "Nueva Nota" para comenzar.
          </p>
        )}

        {notas.notas.length > 0 && (
          <div className="space-y-3">
            {notas.notas.map(nota => (
              <div key={nota.id} className="border border-gray-200 rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${etapaColor(nota.etapa)}`}>
                      {etapaLabel(nota.etapa)}
                    </span>
                    <span className="text-xs text-gray-500">{nota.fecha}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteNota(nota.id)}
                    className="text-red-400 hover:text-red-600 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className="font-semibold text-gray-800 mt-2 text-sm">{nota.titulo}</p>
                {nota.contenido && (
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{nota.contenido}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Resultados reales */}
      <Card variant={haResultados ? 'green' : 'default'}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className={haResultados ? 'text-green-600' : 'text-gray-500'} />
          <h3 className="font-semibold text-gray-800">Resultados Reales de la Temporada</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Complete estos campos al finalizar la temporada para comparar las proyecciones con lo que realmente ocurrió.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Hectáreas sembradas (real)"
            type="number"
            min={0}
            step={0.1}
            unit="ha"
            value={notas.resultadosReales.hectareasSembradas || ''}
            placeholder="0"
            onChange={e => handleResultadosReales('hectareasSembradas', parseFloat(e.target.value) || 0)}
          />
          <Input
            label="Toneladas de semilla usadas (real)"
            type="number"
            min={0}
            step={0.1}
            unit="ton"
            value={notas.resultadosReales.toneladasUsadas || ''}
            placeholder="0"
            onChange={e => handleResultadosReales('toneladasUsadas', parseFloat(e.target.value) || 0)}
          />
        </div>

        {haResultados && notas.resultadosReales.toneladasUsadas > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Ha proyectadas (histórico)</p>
              <p className="font-bold text-green-700">{results.historico.hectareas.toFixed(2)} ha</p>
            </div>
            {results.poblacional.disponible && (
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">Ha proyectadas (poblacional)</p>
                <p className="font-bold text-blue-700">{results.poblacional.hectareas.toFixed(2)} ha</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Ha reales sembradas</p>
              <p className="font-bold text-gray-800">{notas.resultadosReales.hectareasSembradas} ha</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">kg/ha proyectados (histórico)</p>
              <p className="font-bold text-yellow-700">{results.historico.kgPorHa.toLocaleString()} kg/ha</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">kg/ha reales calculados</p>
              <p className="font-bold text-yellow-800">{kgHaReal.toLocaleString('es-MX', { maximumFractionDigits: 0 })} kg/ha</p>
            </div>
            <div className={`rounded-lg p-3 text-center ${Math.abs(kgHaReal - results.historico.kgPorHa) / results.historico.kgPorHa < 0.05 ? 'bg-green-100' : 'bg-red-50'}`}>
              <p className="text-xs text-gray-500">Diferencia kg/ha</p>
              <p className="font-bold text-gray-800">
                {kgHaReal > 0
                  ? `${kgHaReal > results.historico.kgPorHa ? '+' : ''}${(kgHaReal - results.historico.kgPorHa).toLocaleString('es-MX', { maximumFractionDigits: 0 })} kg/ha`
                  : '—'}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 block mb-1">Observaciones finales de la temporada</label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            placeholder="Condiciones climáticas, incidencias, calidad de semilla, comparación con proyecciones..."
            value={notas.resultadosReales.observaciones}
            onChange={e => handleResultadosReales('observaciones', e.target.value)}
          />
        </div>
      </Card>

    </div>
  );
}
