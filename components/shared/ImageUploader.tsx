
import React, { useRef } from 'react';

interface Props {
  label: string;
  image: string | null;
  setImage: (img: string | null) => void;
  icon: string;
}

const ImageUploader: React.FC<Props> = ({ label, image, setImage, icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3 group">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{label}</label>
      <div 
        onClick={() => inputRef.current?.click()}
        className={`relative aspect-video rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center ${
          image ? 'border-indigo-500/50' : 'border-slate-800 hover:border-slate-600 bg-slate-900/40 hover:bg-slate-900'
        }`}
      >
        <input type="file" ref={inputRef} className="hidden" accept="image/*" onChange={handleFile} />
        
        {image ? (
          <>
            <img src={image} className="w-full h-full object-cover" alt="Preview" />
            <button 
              onClick={(e) => { e.stopPropagation(); setImage(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </>
        ) : (
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4 mx-auto group-hover:scale-110 transition-transform">
              <i className={`fa-solid ${icon} text-xl`}></i>
            </div>
            <p className="text-slate-400 text-sm font-medium">Click to upload or drag & drop</p>
            <p className="text-slate-600 text-xs mt-1">PNG, JPG or WebP up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
