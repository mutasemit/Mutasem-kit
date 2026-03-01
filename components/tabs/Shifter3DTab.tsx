
import React, { useState } from 'react';
import { ControlState } from '../../types';
import { generateImageContent } from '../../geminiService';
import ImageUploader from '../shared/ImageUploader';
import ResultArea from '../shared/ResultArea';

// Added t: any to the Props interface for the component
const Shifter3DTab: React.FC<{ controls: ControlState; t: any }> = ({ controls, t }) => {
  const [image, setImage] = useState<string | null>(null);
  const [style, setStyle] = useState('photorealistic_render');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const STYLES = [
    { label: 'Photorealistic Render', value: 'photorealistic_render' },
    { label: 'Disney / Pixar Animation', value: 'disney_pixar' },
    { label: 'Claymation', value: 'claymation' },
    { label: 'Cyberpunk 3D', value: 'cyberpunk' },
    { label: 'Low Poly', value: 'low_poly' }
  ];

  const handleTransform = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const fullPrompt = `Transform this 2D illustration into a 3D ${style}. Lighting: ${controls.lightingStyle}. Quality: ${controls.quality}`;
      const res = await generateImageContent(fullPrompt, [{ data: image, mimeType: 'image/png' }]);
      setResult(res);
    } catch (err) {
      alert("Transformation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <ImageUploader label="1. Upload 2D Illustration" image={image} setImage={setImage} icon="fa-cubes" />
      
      <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/40 space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">2. Choose 3D Style</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {STYLES.map(s => (
            <button 
              key={s.value}
              onClick={() => setStyle(s.value)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                style === s.value 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-950/50 border border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={handleTransform}
        disabled={loading || !image}
        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-3"
      >
        {loading ? <div className="spinner"></div> : <><i className="fa-solid fa-cube"></i> Transform to 3D Style</>}
      </button>

      {/* Added t prop to ResultArea */}
      <ResultArea result={result} loading={loading} t={t} />
    </div>
  );
};

export default Shifter3DTab;
