
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ImageUploader from '../shared/ImageUploader';
import ResultArea from '../shared/ResultArea';

// Added t: any to the Props interface for the component
const MockupStudioTab: React.FC<{ controls: ControlState; t: any }> = ({ controls, t }) => {
  const [mode, setMode] = useState<'apply' | 'generate'>('apply');
  const [designImg, setDesignImg] = useState<string | null>(null);
  const [productImg, setProductImg] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!designImg || (mode === 'apply' && !productImg) || (mode === 'generate' && !description)) return;
    setLoading(true);
    try {
      const imgs = [{ data: designImg, mimeType: 'image/png' }];
      if (productImg && mode === 'apply') imgs.push({ data: productImg, mimeType: 'image/png' });
      
      const fullPrompt = mode === 'apply' 
        ? `Apply the first design onto the second product image realistically. Lighting: ${controls.lightingStyle}. Quality: ${controls.quality}`
        : `Generate a photorealistic mockup of ${description} featuring the uploaded logo design. High quality commercial photography.`;
      
      const res = await generateImageContent(fullPrompt, imgs);
      setResult(res);
    } catch (err) {
      alert("Mockup generation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex p-1 bg-slate-900 rounded-2xl w-fit mx-auto">
        <button 
          onClick={() => setMode('apply')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'apply' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Apply to Image
        </button>
        <button 
          onClick={() => setMode('generate')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'generate' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Generate Scene
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader label="1. Logo / Design (PNG)" image={designImg} setImage={setDesignImg} icon="fa-stamp" />
        {mode === 'apply' ? (
          <ImageUploader label="2. Target Product" image={productImg} setImage={setProductImg} icon="fa-shirt" />
        ) : (
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/40 space-y-4 flex flex-col justify-center">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">2. Describe the Mockup</h3>
            <textarea 
              className="w-full h-full min-h-[120px] bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none"
              placeholder="e.g., A minimalist black cotton t-shirt worn by a male model in a bright urban street setting."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading || !designImg}
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-3"
      >
        {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-shirt"></i> Generate Mockup</>}
      </button>

      {/* Added t prop to ResultArea */}
      <ResultArea result={result} loading={loading} t={t} />
    </div>
  );
};

export default MockupStudioTab;
