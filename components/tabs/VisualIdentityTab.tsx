import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ResultArea from '../shared/ResultArea';

const VisualIdentityTab: React.FC<{ controls: ControlState; t: any; lang: string }> = ({ controls, t, lang }) => {
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('modern');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    concept: string | null;
    palette: string | null;
    pattern: string | null;
    mockup1: string | null;
    mockup2: string | null;
    mockup3: string | null;
    flatLogo: string | null;
  }>({ concept: null, palette: null, pattern: null, mockup1: null, mockup2: null, mockup3: null, flatLogo: null });

  const handleGenerate = async () => {
    if (!brandName || !description) return;
    setLoading(true);
    setResults({ concept: null, palette: null, pattern: null, mockup1: null, mockup2: null, mockup3: null, flatLogo: null });

    try {
      const basePrompt = `Brand Name: "${brandName}". Brand Description: ${description}. Visual Style: ${style}.`;

      // 1. Logo Concept
      const conceptPrompt = `Creative logo design concept sketch and ideation for ${basePrompt}
      Show the thought process, geometry, and construction lines. Artistic sketch style.`;

      // 2. Color Palette
      const palettePrompt = `A beautiful color palette card for ${basePrompt}
      Show 5 distinct color swatches with hex codes. Clean, minimal layout on white background.`;

      // 3. Brand Pattern
      const patternPrompt = `A seamless brand pattern design for ${basePrompt}
      Repeatable texture using brand elements. High resolution wallpaper style.`;

      // 4. Mockups
      const mockup1Prompt = `A photorealistic close-up mockup of premium business cards and stationery branding for ${basePrompt}
      Elegant office desk setting, soft lighting, depth of field. High resolution 8k.`;

      const mockup2Prompt = `A photorealistic mockup of a 3D office signage or building facade logo for ${basePrompt}
      Modern architecture, glass and steel, daylight. High resolution 8k.`;

      const mockup3Prompt = `A photorealistic mockup of branded merchandise (tote bag, t-shirt, or coffee cup) for ${basePrompt}
      Lifestyle photography, natural lighting, urban setting. High resolution 8k.`;

      // 5. Flat Logo (for PDF)
      const flatLogoPrompt = `A professional, high-quality vector-style logo for ${basePrompt}
      The logo should be on a solid white background. Minimalist, clean, high contrast.
      Focus on a scalable, memorable icon or wordmark. High resolution 4k. No shadows, no effects.`;

      // Run generations in parallel
      const [conceptRes, paletteRes, patternRes, m1Res, m2Res, m3Res, flatLogoRes] = await Promise.all([
        generateImageContent(conceptPrompt, [], { aspectRatio: '16:9' }),
        generateImageContent(palettePrompt, [], { aspectRatio: '16:9' }),
        generateImageContent(patternPrompt, [], { aspectRatio: '16:9' }),
        generateImageContent(mockup1Prompt, [], { aspectRatio: '4:3' }),
        generateImageContent(mockup2Prompt, [], { aspectRatio: '4:3' }),
        generateImageContent(mockup3Prompt, [], { aspectRatio: '4:3' }),
        generateImageContent(flatLogoPrompt, [], { aspectRatio: '1:1' })
      ]);

      setResults({
        concept: conceptRes,
        palette: paletteRes,
        pattern: patternRes,
        mockup1: m1Res,
        mockup2: m2Res,
        mockup3: m3Res,
        flatLogo: flatLogoRes
      });

    } catch (err) {
      alert("Identity generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const downloadLogoPdf = () => {
    if (!results.flatLogo) return;
    const doc = new jsPDF();
    
    const imgProps = doc.getImageProperties(results.flatLogo);
    const pdfWidth = doc.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    doc.addImage(results.flatLogo, 'PNG', 0, 0, pdfWidth, pdfHeight);
    doc.save(`${brandName.replace(/\s+/g, '_')}_logo.pdf`);
  };

  const styles = [
    { id: 'modern', label: t.styles.modern },
    { id: 'classic', label: t.styles.classic },
    { id: 'playful', label: t.styles.playful },
    { id: 'tech', label: t.styles.tech },
    { id: 'organic', label: t.styles.organic },
    { id: 'luxury', label: t.styles.luxury },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.brandName}</label>
            <input
              type="text"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
              placeholder={t.identityPlaceholder.split(' ')[0] + '...'}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.brandStyle}</label>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all border ${
                    style === s.id 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                      : 'bg-slate-900/30 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.brandDescription}</label>
            <textarea
              className="w-full h-32 bg-slate-900/50 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
              placeholder={t.identityPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !brandName || !description}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-xl shadow-indigo-900/20 hover:shadow-indigo-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-wand-magic-sparkles"></i> {t.generateIdentity}</>}
          </button>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Logo Concept */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">1</span>
              {t.logoConcept}
            </h3>
            <ResultArea result={results.concept} loading={loading} t={t} />
          </div>

          {/* 2. Colors */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
              {t.colorPalette}
            </h3>
            <ResultArea result={results.palette} loading={loading} t={t} />
          </div>

          {/* 3. Pattern */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">3</span>
              {t.brandPattern}
            </h3>
            <ResultArea result={results.pattern} loading={loading} t={t} />
          </div>

          {/* 4. Mockups */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">4</span>
              {t.mockups}
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.mockupStationery}</h4>
                <ResultArea result={results.mockup1} loading={loading} t={t} />
              </div>
              
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.mockupSignage}</h4>
                <ResultArea result={results.mockup2} loading={loading} t={t} />
              </div>
              
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{t.mockupMerch}</h4>
                <ResultArea result={results.mockup3} loading={loading} t={t} />
              </div>
            </div>
          </div>

          {/* 5. Flat Logo (PDF) */}
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">5</span>
                {t.flatLogo}
              </h3>
              {results.flatLogo && (
                <button 
                  onClick={downloadLogoPdf}
                  className="text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                >
                  <i className="fa-solid fa-file-pdf"></i> {t.downloadPdf}
                </button>
              )}
            </div>
            <div className="max-w-md mx-auto">
              <ResultArea result={results.flatLogo} loading={loading} t={t} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VisualIdentityTab;
