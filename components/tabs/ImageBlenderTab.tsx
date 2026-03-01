
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ResultArea from '../shared/ResultArea';

// Added t: any to the Props interface for the component
const ImageBlenderTab: React.FC<{ controls: ControlState; t: any }> = ({ controls, t }) => {
  const [images, setImages] = useState<{ id: number, data: string | null, role: string }[]>(
    Array.from({ length: 4 }).map((_, i) => ({ id: i, data: null, role: 'Subject' }))
  );
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const ROLES = ['Subject', 'Background', 'Style', 'Lighting', 'Color Palette'];

  const handleUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => prev.map(img => img.id === id ? { ...img, data: reader.result as string } : img));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const activeImages = images.filter(img => img.data !== null);
    if (activeImages.length < 2) return;
    setLoading(true);
    try {
      const parts = activeImages.map(img => ({ data: img.data!, mimeType: 'image/png' }));
      const rolesInfo = activeImages.map(img => `Image with role ${img.role}`).join(', ');
      const fullPrompt = `Synthesize a new image by blending: ${rolesInfo}. Final description: ${prompt}. Quality: ${controls.quality}`;
      const res = await generateImageContent(fullPrompt, parts);
      setResult(res);
    } catch (err) {
      alert("Blending failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="space-y-2">
            <div 
              onClick={() => document.getElementById(`blender-input-${img.id}`)?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center relative"
            >
              <input 
                id={`blender-input-${img.id}`} 
                type="file" 
                className="hidden" 
                onChange={(e) => handleUpload(img.id, e)} 
              />
              {img.data ? (
                <img src={img.data} className="w-full h-full object-cover" alt="Source" />
              ) : (
                <i className="fa-solid fa-plus text-slate-700"></i>
              )}
            </div>
            <select 
              value={img.role}
              onChange={(e) => setImages(prev => prev.map(i => i.id === img.id ? { ...i, role: e.target.value } : i))}
              className="w-full bg-slate-900 border border-slate-800 text-slate-400 rounded-lg py-1 px-2 text-[10px] uppercase font-bold tracking-tighter"
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/40 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Synthesis Instructions</h3>
        <textarea 
          className="w-full h-24 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none"
          placeholder="e.g., Place the subject in the background of image 2, using the vibrant color palette and cinematic style of image 3."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading || images.filter(i => i.data).length < 2}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-3"
      >
        {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-bolt"></i> Synthesize Image</>}
      </button>

      {/* Added t prop to ResultArea */}
      <ResultArea result={result} loading={loading} t={t} />
    </div>
  );
};

export default ImageBlenderTab;
