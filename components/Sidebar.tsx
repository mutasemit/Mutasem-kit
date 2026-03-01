
import React from 'react';
import { ControlState, TabType } from '../types';
import { translations, LangType } from '../translations';

interface SidebarProps {
  controls: ControlState;
  setControls: React.Dispatch<React.SetStateAction<ControlState>>;
  activeTab: TabType;
  isOpen?: boolean;
  onClose?: () => void;
  lang: LangType;
}

const Sidebar: React.FC<SidebarProps> = ({ controls, setControls, activeTab, isOpen, onClose, lang }) => {
  const t = translations[lang];
  const updateField = (field: keyof ControlState, value: any) => {
    setControls(prev => ({ ...prev, [field]: value }));
  };

  const sidePos = lang === 'ar' ? 'left-0 border-r' : 'right-0 border-l';

  return (
    <div >
      <div 
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] xl:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>

      <aside className={`fixed top-[60px] xl:top-0 bottom-0 ${sidePos} w-[85%] sm:w-80 glass border-slate-800 h-auto overflow-y-auto z-[70] transition-transform duration-300 ease-in-out xl:static xl:block xl:h-full xl:translate-x-0 ${isOpen ? 'translate-x-0' : (lang === 'ar' ? '-translate-x-full' : 'translate-x-full')}`}>
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between mb-2 xl:hidden">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">{t.settings}</h3>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:text-white">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div>
            <h3 className="hidden xl:block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">{t.masterControls}</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-wand-magic text-indigo-400"></i>
                  <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">{t.visualWizard}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={controls.visualWizard} onChange={(e) => updateField('visualWizard', e.target.checked)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <ControlGroup label={t.lightingAtmosphere}>
                <Select 
                  label={t.lightingStyle} 
                  value={controls.lightingStyle} 
                  onChange={(v) => updateField('lightingStyle', v)}
                  options={[
                    { label: lang === 'ar' ? 'استوديو ناعم' : 'Soft Studio', value: 'soft_studio' },
                    { label: lang === 'ar' ? 'سينمائي' : 'Cinematic', value: 'cinematic' },
                    { label: lang === 'ar' ? 'ضوء نهار طبيعي' : 'Natural Daylight', value: 'natural_daylight' },
                    { label: lang === 'ar' ? 'ساعة ذهبية' : 'Golden Hour', value: 'golden_hour' },
                    { label: lang === 'ar' ? 'توهج نيون' : 'Neon Glow', value: 'neon' }
                  ]} 
                />
                <Select 
                  label={t.weather} 
                  value={controls.weather} 
                  onChange={(v) => updateField('weather', v)}
                  options={[
                    { label: lang === 'ar' ? 'سماء صافية' : 'Clear Skies', value: 'clear_skies' },
                    { label: lang === 'ar' ? 'غائم' : 'Overcast', value: 'overcast' },
                    { label: lang === 'ar' ? 'ضبابي' : 'heavy_fog', value: 'heavy_fog' }
                  ]} 
                />
              </ControlGroup>

              <ControlGroup label={t.cameraComposition}>
                <Select 
                  label={t.perspective} 
                  value={controls.cameraPerspective} 
                  onChange={(v) => updateField('cameraPerspective', v)}
                  options={[
                    { label: lang === 'ar' ? 'منظور أمامي' : 'Front View', value: 'front_view' },
                    { label: lang === 'ar' ? 'زاوية منخفضة' : 'Low Angle', value: 'low_angle' },
                    { label: lang === 'ar' ? 'من الأعلى' : 'Top Down', value: 'top_down' }
                  ]} 
                />
              </ControlGroup>

              <ControlGroup label={t.outputQuality}>
                <Select 
                  label={t.resolution} 
                  value={controls.quality} 
                  onChange={(v) => updateField('quality', v)}
                  options={[
                    { label: 'Standard (1K)', value: '1k' },
                    { label: 'High (2K)', value: '2k' },
                    { label: 'Ultra (4K)', value: '4k' }
                  ]} 
                />
              </ControlGroup>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

const ControlGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-3">
    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const Select: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    <label className="text-xs text-slate-400 block px-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export default Sidebar;
