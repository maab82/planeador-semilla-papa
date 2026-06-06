import { useApp } from '../../context/AppContext';
import { evaluarTercera, evaluarCuarta, NIVEL_LABEL, NIVEL_COLOR, NIVEL_DOT } from '../../utils/samplingQuality';

export function ComparadorMuestreos() {
  const { sampling } = useApp();

  const terceras = sampling.muestreosTercera.map((s, i) => ({ ...evaluarTercera(s), idx: i + 1 }));
  const cuartas = sampling.muestreosCuarta.map((s, i) => ({ ...evaluarCuarta(s), idx: i + 1 }));
  const todas = [...terceras, ...cuartas].sort((a, b) => b.pctUtil - a.pctUtil);

  if (todas.length === 0) return null;

  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-3">Comparación de Muestreos</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <th className="text-left px-3 py-2">Muestra</th>
              <th className="text-left px-3 py-2">Calibre</th>
              <th className="text-left px-3 py-2">Origen</th>
              <th className="text-left px-3 py-2">Variedad</th>
              <th className="text-right px-3 py-2">Útil %</th>
              <th className="text-right px-3 py-2">Merma %</th>
              {todas.some((c) => c.pctQuinta !== undefined) && (
                <th className="text-right px-3 py-2">Quinta %</th>
              )}
              <th className="text-left px-3 py-2">Calidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {todas.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-gray-500">#{c.idx}</td>
                <td className="px-3 py-2 capitalize">{c.calibre}</td>
                <td className="px-3 py-2 capitalize text-gray-600">
                  {c.origen ? (c.origen === 'navojoa' ? 'Navojoa' : 'Caborca') : '—'}
                </td>
                <td className="px-3 py-2 capitalize text-gray-600">{c.variedad ?? '—'}</td>
                <td className="px-3 py-2 text-right font-semibold">{c.pctUtil.toFixed(1)}%</td>
                <td className="px-3 py-2 text-right text-red-600">{c.pctMerma.toFixed(1)}%</td>
                {todas.some((x) => x.pctQuinta !== undefined) && (
                  <td className="px-3 py-2 text-right text-violet-600">
                    {c.pctQuinta !== undefined ? `${c.pctQuinta.toFixed(1)}%` : '—'}
                  </td>
                )}
                <td className="px-3 py-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${NIVEL_COLOR[c.nivel]}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${NIVEL_DOT[c.nivel]} mr-1`} />
                    {NIVEL_LABEL[c.nivel]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
