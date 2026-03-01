
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ResultArea from '../shared/ResultArea';

// Added t: any to the Props interface for the component
const ImagineTab: React.FC<{ controls: ControlState; t: any }> = ({ controls, t }) => {
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const fullPrompt = `${prompt}. Style: ${controls.lightingStyle}. Quality: ${controls.quality}. Negative: ${negPrompt}`;
      const res = await generateImageContent(fullPrompt);
      setResult(res);
    } catch (err) {
      alert("Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/40 space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Describe your vision</h3>
          <textarea 
            className="w-full h-48 bg-slate-950/50 border border-slate-800 rounded-3xl p-6 text-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none leading-relaxed transition-all"
            placeholder="An astronaut riding a horse on Mars in a cinematic cyberpunk style, vivid neon colors, 8k resolution..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        
        <input 
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none"
          placeholder="Negative Prompt (optional)"
          value={negPrompt}
          onChange={(e) => setNegPrompt(e.target.value)}
        />

        <button 
          onClick={handleGenerate}
          disabled={loading || !prompt}
          className="w-full py-5 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] hover:bg-[100%_0] text-white text-lg font-bold flex items-center justify-center gap-3 transition-all duration-500 shadow-xl shadow-indigo-600/20"
        >
          {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-wand-sparkles"></i> Bring to Life</>}
        </button>
      </div>

      {/* Added t prop to ResultArea */}
      <ResultArea result={result} loading={loading} t={t} />
    </div>
  );
};

export default ImagineTab;
