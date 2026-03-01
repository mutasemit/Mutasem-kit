
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent, suggestPrompt } from '../../geminiService';
import ImageUploader from '../shared/ImageUploader';
import ResultArea from '../shared/ResultArea';

const StudioProTab: React.FC<{ controls: ControlState; t: any; lang: string }> = ({ controls, t, lang }) => {
  const [productImg, setProductImg] = useState<string | null>(null);
  const [refImg, setRefImg] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [negPrompt, setNegPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const handleSuggest = async () => {
    if (!productImg) return;
    setSuggestLoading(true);
    const suggestion = await suggestPrompt(productImg, "Studio Pro composite engine");
    setPrompt(suggestion);
    setSuggestLoading(false);
  };

  const handleGenerate = async () => {
    if (!productImg || !prompt) return;
    setLoading(true);
    try {
      const images = [{ data: productImg, mimeType: 'image/png' }];
      if (refImg) images.push({ data: refImg, mimeType: 'image/png' });
      
      const fullPrompt = `Composite creation: ${prompt}. Lighting: ${controls.lightingStyle}. Perspective: ${controls.cameraPerspective}. Quality: ${controls.quality}. Negative prompt: ${negPrompt}`;
      const img = await generateImageContent(fullPrompt, images);
      setResult(img);
    } catch (err) {
      alert(lang === 'ar' ? "فشل التوليد. تأكد من مفتاح API." : "Generation failed. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader label={t.productImage} image={productImg} setImage={setProductImg} icon="fa-cube" />
        <ImageUploader label={t.referenceImage} image={refImg} setImage={setRefImg} icon="fa-image" />
      </div>

      <div className="space-y-6">
        <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/40 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.desiredTransformation}</h3>
            <button 
              onClick={handleSuggest}
              disabled={!productImg || suggestLoading}
              className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
            >
              {suggestLoading ? <div className="spinner w-3 h-3"></div> : <i className="fa-solid fa-lightbulb"></i>}
              {t.suggestPrompt}
            </button>
          </div>
          <textarea 
            className="w-full h-32 bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            placeholder={t.promptPlaceholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <input 
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all text-sm"
            placeholder={t.negativePrompt}
            value={negPrompt}
            onChange={(e) => setNegPrompt(e.target.value)}
          />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !productImg || !prompt}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100"
        >
          {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-bolt"></i> {t.generateComposite}</>}
        </button>
      </div>

      <ResultArea result={result} loading={loading} t={t} />
    </div>
  );
};

export default StudioProTab;
