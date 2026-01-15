
import React, { useState, useMemo } from 'react';
import * as Icons from './components/Icons.tsx';

const App = () => {
  const [state, setState] = useState({
    width: 300,
    height: 200,
    bgColor: '#cccccc',
    textColor: '#ffffff',
    label: '',
    fontSize: 20,
  });

  const [copied, setCopied] = useState(false);

  const svgCode = useMemo(() => {
    const labelText = state.label || `${state.width} × ${state.height}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${state.width}" height="${state.height}" viewBox="0 0 ${state.width} ${state.height}">
  <rect width="100%" height="100%" fill="${state.bgColor}" />
  <text 
    x="50%" 
    y="50%" 
    font-family="system-ui, sans-serif" 
    font-size="${state.fontSize}" 
    fill="${state.textColor}" 
    text-anchor="middle" 
    dominant-baseline="central"
  >${labelText}</text>
</svg>`;
  }, [state]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(svgCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placeholder-${state.width}x${state.height}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setState(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const inputClasses = "w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm";

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center bg-slate-50">
      <div className="max-w-2xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Icons.PhotoIcon className="w-8 h-8 text-blue-600" />
            SVG Placeholder
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Crea segnaposto leggeri e personalizzati istantaneamente.</p>
        </header>

        <main className="bg-white rounded-2xl shadow-2xl shadow-slate-300/50 border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white">
            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <Icons.ArrowsPointingOutIcon className="w-4 h-4 text-slate-500" /> Dimensioni (px)
                </span>
                <div className="flex gap-3">
                  <input type="number" name="width" value={state.width} onChange={handleChange} className={inputClasses} placeholder="L" />
                  <input type="number" name="height" value={state.height} onChange={handleChange} className={inputClasses} placeholder="A" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <Icons.SwatchIcon className="w-4 h-4 text-slate-500" /> Colore Sfondo
                </span>
                <div className="flex gap-3">
                  <input type="color" name="bgColor" value={state.bgColor} onChange={handleChange} className="h-10 w-16 bg-white border border-slate-300 p-1 rounded-lg cursor-pointer flex-shrink-0" />
                  <input type="text" name="bgColor" value={state.bgColor} onChange={handleChange} className={`${inputClasses} font-mono uppercase text-sm`} />
                </div>
              </label>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">
                  <Icons.TypeIcon className="w-4 h-4 text-slate-500" /> Testo Etichetta (Label)
                </span>
                <input type="text" name="label" value={state.label} onChange={handleChange} className={inputClasses} placeholder="Esempio: Immagine Hero" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">Colore Testo</span>
                  <input type="color" name="textColor" value={state.textColor} onChange={handleChange} className="w-full h-10 bg-white border border-slate-300 p-1 rounded-lg cursor-pointer" />
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-2">Dim. Font</span>
                  <input type="number" name="fontSize" value={state.fontSize} onChange={handleChange} className={inputClasses} />
                </label>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50/80 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Live Preview
            </h2>
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-2xl bg-white min-h-[300px] overflow-auto shadow-inner">
              <div dangerouslySetInnerHTML={{ __html: svgCode }} className="drop-shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]" />
            </div>
          </div>

          <div className="p-8 bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Icons.CodeBracketIcon className="w-4 h-4 text-blue-400" /> Codice Sorgente
              </h2>
              <div className="flex gap-3">
                <button onClick={handleDownload} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95">
                  <Icons.ArrowDownTrayIcon className="w-4 h-4" /> SVG
                </button>
                <button onClick={handleCopy} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${copied ? 'bg-emerald-500 text-white shadow-emerald-900/20' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white shadow-black/20 active:scale-95'}`}>
                  {copied ? <><Icons.ClipboardDocumentCheckIcon className="w-4 h-4" /> Copiato!</> : <><Icons.ClipboardIcon className="w-4 h-4" /> Copia</>}
                </button>
              </div>
            </div>
            <textarea readOnly value={svgCode} className="w-full h-36 bg-slate-950 text-blue-400 font-mono text-sm p-5 rounded-2xl border border-slate-800 focus:outline-none resize-none shadow-2xl" spellCheck="false" />
          </div>
        </main>

        <footer className="mt-8 text-center text-slate-400 text-sm font-medium">
          <p>© {new Date().getFullYear()} SVG Placeholder Tool • Generazione istantanea</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
