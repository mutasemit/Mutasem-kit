
import React from 'react';

interface Props {
  result: string | null;
  loading: boolean;
  onDownload?: () => void;
  t: any;
}

const ResultArea: React.FC<Props> = ({ result, loading, t }) => {
  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `syoufi-design-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.finalResult}</h3>
        {result && (
          <button 
            onClick={handleDownload}
            className="text-xs font-bold text-indigo-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <i className="fa-solid fa-download"></i> {t.downloadImage}
          </button>
        )}
      </div>
      
      <div className="relative aspect-square lg:aspect-video rounded-3xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 animate-pulse">
            <div className="spinner w-12 h-12"></div>
            <p className="text-slate-400 font-medium">{t.synthesizing}</p>
          </div>
        ) : result ? (
          <img src={result} className="w-full h-full object-contain" alt="Generated result" />
        ) : (
          <div className="text-center p-8">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-700 mb-4 mx-auto">
              <i className="fa-solid fa-image text-3xl"></i>
            </div>
            <p className="text-slate-600 font-medium">{t.masterpiecePlaceholder}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultArea;
