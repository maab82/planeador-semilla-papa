import { Scissors } from 'lucide-react';
import { Card } from '../common/Card';
import type { SamplingResultsTercera, SamplingResultsCuarta } from '../../types/sampling';

interface ProyeccionPostCribaProps {
  arpillasTercera: number;
  arpillasCuarta: number;
  resTercera: SamplingResultsTercera;
  resCuarta: SamplingResultsCuarta;
}

interface FilaCalibr {
  label: string;
  valor: number;
  pct: number;
  color: string;
}

function TablaProyeccion({ titulo, arpillas, filas, color }: {
  titulo: string;
  arpillas: number;
  filas: FilaCalibr[];
  color: string;
}) {
  return (
    <div className={`rounded-xl border-2 ${color} p-4`}>
      <p className="font-semibold text-gray-800 mb-1">{titulo}</p>
      <p className="text-xs text-gray-500 mb-3">Base: {arpillas.toLocaleString()} arpillas</p>
      <div className="space-y-2">
        {filas.map((f) => (
          <div key={f.label} className="flex items-center gap-2">
            <div className="w-24 text-xs text-gray-600 font-medium shrink-0">{f.label}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-4 rounded-full ${f.color}`}
                style={{ width: `${Math.min(f.pct, 100)}%` }}
              />
            </div>
            <div className="w-20 text-right text-xs font-bold text-gray-800 shrink-0">
              {f.valor.toFixed(0)} arp
            </div>
            <div className="w-10 text-right text-xs text-gray-500 shrink-0">
              {f.pct.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProyeccionPostCriba({
  arpillasTercera,
  arpillasCuarta,
  resTercera,
  resCuarta,
}: ProyeccionPostCribaProps) {
  const hasTercera = resTercera.pctTercera + resTercera.pctSegunda + resTercera.pctCuarta + resTercera.pctMerma > 0;
  const hasCuarta = resCuarta.pctCuarta + resCuarta.pctTercera + resCuarta.pctCuartaChica + resCuarta.pctMerma > 0;

  if (!hasTercera && !hasCuarta) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Scissors size={18} className="text-purple-700" />
          </div>
          <h3 className="font-semibold text-gray-800">Proyección Post-Criba</h3>
        </div>
        <p className="text-sm text-gray-500">
          Registre muestreos en la pestaña <strong>Muestreos</strong> para ver la proyección post-criba.
        </p>
      </Card>
    );
  }

  const terceraFilas: FilaCalibr[] = [
    { label: 'Segunda',  valor: arpillasTercera * resTercera.pctSegunda / 100,  pct: resTercera.pctSegunda,  color: 'bg-yellow-400' },
    { label: 'Tercera',  valor: arpillasTercera * resTercera.pctTercera / 100,  pct: resTercera.pctTercera,  color: 'bg-green-500' },
    { label: 'Cuarta',   valor: arpillasTercera * resTercera.pctCuarta / 100,   pct: resTercera.pctCuarta,   color: 'bg-blue-400' },
    { label: 'Merma',    valor: arpillasTercera * resTercera.pctMerma / 100,    pct: resTercera.pctMerma,    color: 'bg-red-400' },
  ];

  const cuartaFilas: FilaCalibr[] = [
    { label: 'Tercera',     valor: arpillasCuarta * resCuarta.pctTercera / 100,     pct: resCuarta.pctTercera,     color: 'bg-green-500' },
    { label: 'Cuarta',      valor: arpillasCuarta * resCuarta.pctCuarta / 100,      pct: resCuarta.pctCuarta,      color: 'bg-blue-400' },
    { label: 'Cuarta Chica',valor: arpillasCuarta * resCuarta.pctCuartaChica / 100, pct: resCuarta.pctCuartaChica, color: 'bg-indigo-400' },
    { label: 'Merma',       valor: arpillasCuarta * resCuarta.pctMerma / 100,       pct: resCuarta.pctMerma,       color: 'bg-red-400' },
  ];

  // Totales post-criba consolidados
  const terceraPostCriba = arpillasTercera * resTercera.pctTercera / 100;
  const cuartaDesTercera  = arpillasTercera * resTercera.pctCuarta / 100;
  const terceraDesCuarta  = arpillasCuarta  * resCuarta.pctTercera / 100;
  const cuartaPostCriba   = arpillasCuarta  * resCuarta.pctCuarta / 100 + arpillasCuarta * resCuarta.pctCuartaChica / 100;
  const totalTerceraFinal = terceraPostCriba + terceraDesCuarta;
  const totalCuartaFinal  = cuartaDesTercera + cuartaPostCriba;
  const totalSegunda      = arpillasTercera * resTercera.pctSegunda / 100;
  const totalMerma        = arpillasTercera * resTercera.pctMerma / 100 + arpillasCuarta * resCuarta.pctMerma / 100;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Scissors size={18} className="text-purple-700" />
        </div>
        <h3 className="font-semibold text-gray-800">Proyección Post-Criba</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {hasTercera && (
          <TablaProyeccion
            titulo="Lote Tercera"
            arpillas={arpillasTercera}
            filas={terceraFilas}
            color="border-green-200 bg-green-50"
          />
        )}
        {hasCuarta && (
          <TablaProyeccion
            titulo="Lote Cuarta"
            arpillas={arpillasCuarta}
            filas={cuartaFilas}
            color="border-blue-200 bg-blue-50"
          />
        )}
      </div>

      {/* Resumen consolidado */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">Inventario Estimado Post-Criba</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-700 font-medium">Segunda</p>
            <p className="text-xl font-black text-yellow-800">{totalSegunda.toFixed(0)}</p>
            <p className="text-xs text-yellow-600">arpillas</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <p className="text-xs text-green-700 font-medium">Tercera</p>
            <p className="text-xl font-black text-green-800">{totalTerceraFinal.toFixed(0)}</p>
            <p className="text-xs text-green-600">arpillas</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs text-blue-700 font-medium">Cuarta</p>
            <p className="text-xl font-black text-blue-800">{totalCuartaFinal.toFixed(0)}</p>
            <p className="text-xs text-blue-600">arpillas</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <p className="text-xs text-red-700 font-medium">Merma</p>
            <p className="text-xl font-black text-red-800">{totalMerma.toFixed(0)}</p>
            <p className="text-xs text-red-600">arpillas</p>
          </div>
        </div>
        <div className="mt-3 flex justify-between text-xs text-gray-500">
          <span>Inventario original: {(arpillasTercera + arpillasCuarta).toLocaleString()} arpillas</span>
          <span>Semilla aprovechable: {(totalTerceraFinal + totalCuartaFinal).toFixed(0)} arpillas</span>
        </div>
      </div>
    </Card>
  );
}
