import { Sprout, Download, Upload } from 'lucide-react';
import { Button } from '../common/Button';
import { exportarDatos, importarDatos } from '../../utils/exportImport';
import { useApp } from '../../context/AppContext';
import { useRef } from 'react';

export function Header() {
  const { inventory, sampling, planning, setInventory, setSampling, setPlanning } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    exportarDatos(inventory, sampling, planning);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importarDatos(file);
      setInventory(data.inventory);
      setSampling(data.sampling);
      setPlanning(data.planning);
      alert('Datos importados correctamente');
    } catch {
      alert('Error al importar el archivo. Verifique que sea un archivo válido.');
    }
    e.target.value = '';
  }

  return (
    <header className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 rounded-xl p-2">
            <Sprout size={28} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Planeador de Semilla de Papa</h1>
            <p className="text-green-200 text-xs hidden sm:block">Estimación de disponibilidad y capacidad de siembra</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 border border-green-600"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={15} />
            <span className="hidden sm:inline">Importar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-green-700 border border-green-600"
            onClick={handleExport}
          >
            <Download size={15} />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
