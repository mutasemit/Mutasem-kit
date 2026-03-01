
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ImageUploader from '../shared/ImageUploader';
import ResultArea from '../shared/ResultArea';

const VirtualShootTab: React.FC<{ controls: ControlState; t: any; lang: string }> = ({ controls, t, lang }) => {
  const [productImg, setProductImg] = useState<string | null>(null);
  const [brandVibe, setBrandVibe] = useState('');
  const [selectedScenarios, setSelectedScenarios] = useState<{label: string, prompt: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{url: string, label: string}[]>([]);

  const scenarioGroups = [
    {
      title: t.scenarios.standardAngles,
      items: [
        { id: 'front', label: t.scenarios.frontView, prompt: 'professional front view, studio lighting' },
        { id: 'back', label: t.scenarios.backView, prompt: 'professional back view showing product details' },
        { id: 'side', label: t.scenarios.sideProfile, prompt: 'side profile view, commercial depth' },
        { id: 'top', label: t.scenarios.topDown, prompt: 'top-down flat lay composition' },
        { id: 'low', label: t.scenarios.lowAngle, prompt: 'heroic low angle shot, powerful look' },
        { id: 'high', label: t.scenarios.highAngle, prompt: 'high angle view, elegant perspective' },
        { id: '45deg', label: t.scenarios.deg45, prompt: '45-degree angle professional product shot' },
        { id: 'isometric', label: t.scenarios.isometric, prompt: 'clean isometric projection view' }
      ]
    },
    {
      title: t.scenarios.cinematicArtistic,
      items: [
        { id: 'bokeh', label: t.scenarios.bokeh, prompt: 'shallow depth of field, creamy bokeh background, cinematic' },
        { id: 'wide', label: t.scenarios.wideAngle, prompt: 'wide-angle dynamic lens distortion, immersive' },
        { id: 'reflect', label: t.scenarios.reflection, prompt: 'resting on a clean mirror surface with soft reflection' },
        { id: 'shadow', label: t.scenarios.longShadow, prompt: 'harsh directional lighting with long dramatic shadows' },
        { id: 'float', label: t.scenarios.floating, prompt: 'zero-gravity floating in air, levitating product' }
      ]
    },
    {
      title: t.scenarios.commercialLifestyle,
      items: [
        { id: 'pack', label: t.scenarios.packaging, prompt: 'commercial packaging shot, branding focused' },
        { id: 'splash', label: t.scenarios.splash, prompt: 'dynamic water splash surrounding the product' },
        { id: 'kitchen', label: t.scenarios.kitchen, prompt: 'placed on a modern high-end marble kitchen counter' },
        { id: 'rustic', label: t.scenarios.rusticTable, prompt: 'lifestyle on a textured rustic wooden table' },
        { id: 'beach', label: t.scenarios.beach, prompt: 'vacation vibe on a sandy sunny beach' },
        { id: 'forest', label: t.scenarios.forest, prompt: 'organic shot in a lush green tropical forest' },
        { id: 'window', label: t.scenarios.windowsill, prompt: 'natural morning light through a window on a sill' },
        { id: 'nature', label: t.scenarios.natureDew, prompt: 'macro shot in nature with delicate dew drops' },
        { id: 'cafe', label: t.scenarios.cafeTable, prompt: 'casual cafe table setting with hands in frame' },
        { id: 'unboxing', label: t.scenarios.unboxing, prompt: 'first-person unboxing scene perspective' },
        { id: 'held', label: t.scenarios.heldModel, prompt: 'held by a fashion model, close-up lifestyle' }
      ]
    }
  ];

  const toggleScenario = (item: {label: string, prompt: string}) => {
    setSelectedScenarios(prev => 
      prev.some(p => p.prompt === item.prompt) 
        ? prev.filter(p => p.prompt !== item.prompt) 
        : [...prev, item]
    );
  };

  const handleShoot = async () => {
    if (!productImg || selectedScenarios.length === 0) return;
    setLoading(true);
    setResults([]);
    setProgress({ current: 0, total: selectedScenarios.length });
    
    try {
      const generatedImages: {url: string, label: string}[] = [];
      
      for (let i = 0; i < selectedScenarios.length; i++) {
        const scenario = selectedScenarios[i];
        setProgress(prev => ({ ...prev, current: i + 1 }));
        
        const fullPrompt = `Professional commercial photoshoot for the product in the image. Scene: ${scenario.prompt}. Brand Vibe: ${brandVibe}. Lighting: ${controls.lightingStyle}. Quality: ${controls.quality}. Masterpiece, highly detailed, photorealistic.`;
        
        const img = await generateImageContent(fullPrompt, [{ data: productImg, mimeType: 'image/png' }]);
        if (img) {
          generatedImages.push({ url: img, label: scenario.label });
          // Update UI progressively
          setResults([...generatedImages]);
        }
      }
    } catch (err) {
      alert(lang === 'ar' ? "فشلت جلسة التصوير لبعض الصور" : "Photoshoot failed for some images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ImageUploader label={t.productImage} image={productImg} setImage={setProductImg} icon="fa-camera" />
      
      <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/40 space-y-8">
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">{t.brandIdentity}</h3>
          <input 
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-4 py-3 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            placeholder={lang === 'ar' ? "مثال: فاخر، بسيط، عضوي..." : "e.g., Minimalist, luxury, organic, eco-friendly"}
            value={brandVibe}
            onChange={(e) => setBrandVibe(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.selectScenarios}</h3>
          
          <div className="space-y-6">
            {scenarioGroups.map((group, gIdx) => (
              <div key={gIdx} className="relative p-5 rounded-2xl border border-slate-800/60 bg-slate-950/30">
                <span className={`absolute -top-3 ${lang === 'ar' ? 'right-4' : 'left-4'} px-2 bg-slate-900 text-[10px] font-bold text-indigo-400 uppercase tracking-widest`}>
                  {group.title}
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-2">
                  {group.items.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => toggleScenario(item)}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all border group ${
                        selectedScenarios.some(p => p.prompt === item.prompt) 
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-100' 
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                        selectedScenarios.some(p => p.prompt === item.prompt) 
                        ? 'bg-indigo-500 border-indigo-400 text-white' 
                        : 'border-slate-700 group-hover:border-slate-500'
                      }`}>
                        {selectedScenarios.some(p => p.prompt === item.prompt) && <i className="fa-solid fa-check text-[10px]"></i>}
                      </div>
                      <span className="text-xs font-semibold leading-tight">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleShoot}
        disabled={loading || !productImg || selectedScenarios.length === 0}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:scale-100"
      >
        {loading ? (
          <div className="flex items-center gap-3">
             <div className="spinner"></div>
             <span>{lang === 'ar' ? `جاري التوليد (${progress.current}/${progress.total})` : `Generating (${progress.current}/${progress.total})`}</span>
          </div>
        ) : (
          <><i className="fa-solid fa-camera-rotate"></i> {t.startVirtualShoot} ({selectedScenarios.length})</>
        )}
      </button>

      {/* Results Gallery */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.finalResult}</h3>
        </div>
        
        {results.length > 0 || loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {results.map((res, idx) => (
              <div key={idx} className="group relative rounded-3xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
                <img src={res.url} className="w-full aspect-square object-cover" alt={res.label} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                  <p className="text-white font-bold mb-2">{res.label}</p>
                  <button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = res.url;
                      link.download = `shoot-${res.label}-${Date.now()}.png`;
                      link.click();
                    }}
                    className="w-full py-2 rounded-xl bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/30 hover:bg-white/40 transition-all"
                  >
                    <i className="fa-solid fa-download mr-2"></i> {t.downloadImage}
                  </button>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                  {res.label}
                </div>
              </div>
            ))}
            
            {loading && results.length < progress.total && (
               <div className="aspect-square rounded-3xl border border-slate-900 bg-slate-900/40 flex flex-col items-center justify-center gap-4 animate-pulse">
                  <div className="spinner w-10 h-10"></div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    {lang === 'ar' ? 'جاري المعالجة...' : 'Processing...'}
                  </p>
               </div>
            )}
          </div>
        ) : (
          <div className="relative aspect-square lg:aspect-video rounded-3xl border border-slate-900 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center">
             <div className="text-center p-8">
                <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-700 mb-4 mx-auto">
                  <i className="fa-solid fa-images text-3xl"></i>
                </div>
                <p className="text-slate-600 font-medium">{t.masterpiecePlaceholder}</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualShootTab;
