
import React, { useState, useEffect } from 'react';
import { TabType, ControlState } from './types';
import { translations, LangType } from './translations';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AboutTab from './components/tabs/AboutTab';
import StudioProTab from './components/tabs/StudioProTab';
import VirtualShootTab from './components/tabs/VirtualShootTab';
import ImageBlenderTab from './components/tabs/ImageBlenderTab';
import Shifter3DTab from './components/tabs/Shifter3DTab';
import ImagineTab from './components/tabs/ImagineTab';
import MockupStudioTab from './components/tabs/MockupStudioTab';
import VisualIdentityTab from './components/tabs/VisualIdentityTab';

const INITIAL_CONTROLS: ControlState = {
  visualWizard: true,
  referenceUsage: 'full_scene_emulation',
  lightingStyle: 'soft_studio',
  cameraPerspective: 'front_view',
  shotType: 'hero',
  lightingShadowStyle: 'soft_natural',
  timeOfDay: 'keep_original',
  weather: 'clear_skies',
  season: 'keep_original',
  quality: '4k',
  cameraKit: '',
  productDetailer: '',
  creativeFX: '',
  portraitEnhance: ''
};

const LayerIcon = ({ className = "", color = "#9333ea", ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48.65 27.59" className={className} {...props}>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Layer_1-2" data-name="Layer 1">
          <g>
            <polygon fill={color} points="16.03 1.57 0 14.48 0 27.59 16.24 13.7 16.03 1.57" />
            <polygon fill={color} points="32.2 .82 16.17 13.73 16.17 26.84 32.41 12.95 32.2 .82" />
            <polygon fill={color} points="48.44 0 32.41 12.91 32.41 26.02 48.65 12.13 48.44 0" />
          </g>
        </g>
      </g>
    </svg>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<LangType>('ar');
  const [activeTab, setActiveTab] = useState<TabType>(TabType.ABOUT);
  const [controls, setControls] = useState<ControlState>(INITIAL_CONTROLS);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const renderContent = () => {
    const props = { controls, lang, t };
    switch (activeTab) {
      case TabType.ABOUT: return <AboutTab lang={lang} t={t} />;
      case TabType.STUDIO_PRO: return <StudioProTab {...props} />;
      case TabType.VIRTUAL_SHOOT: return <VirtualShootTab {...props} />;
      case TabType.IMAGE_BLENDER: return <ImageBlenderTab {...props} />;
      case TabType.SHIFTER_3D: return <Shifter3DTab {...props} />;
      case TabType.IMAGINE: return <ImagineTab {...props} />;
      case TabType.MOCKUP_STUDIO: return <MockupStudioTab {...props} />;
      case TabType.VISUAL_IDENTITY: return <VisualIdentityTab {...props} />;
      default: return <AboutTab lang={lang} t={t} />;
    }
  };

  const hasControls = [
    TabType.STUDIO_PRO, 
    TabType.VIRTUAL_SHOOT, 
    TabType.IMAGE_BLENDER, 
    TabType.SHIFTER_3D, 
    TabType.MOCKUP_STUDIO,
    TabType.VISUAL_IDENTITY
  ].includes(activeTab);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsNavOpen(false);
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 overflow-hidden text-slate-100">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 h-[60px] glass border-b border-slate-800 z-[65] fixed top-0 left-0 right-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center"><LayerIcon /></div>
          <span className="font-bold text-sm">{t.developerName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleLang} className="px-2 py-1 text-[10px] font-bold border border-slate-700 rounded bg-slate-800">{t.switchLang}</button>
          <button onClick={() => setIsNavOpen(!isNavOpen)} className="w-10 h-10 flex items-center justify-center text-slate-400">
            <i className={`fa-solid ${isNavOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Left Sidebar Nav */}
      <nav className={`fixed top-[60px] lg:top-0 bottom-0 ${lang === 'ar' ? 'right-0' : 'left-0'} w-72 glass border-r border-slate-800 flex flex-col p-4 z-[55] transition-transform duration-300 lg:static lg:translate-x-0 ${isNavOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 flex items-center"><LayerIcon /></div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
           {t.developerName}
          </h1>
        </div>

        <div className="space-y-1 overflow-y-auto pr-2">
          <TabButton active={activeTab === TabType.ABOUT} onClick={() => handleTabChange(TabType.ABOUT)} icon="fa-circle-info" label={t.dashboard} />
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-6 mb-2 px-3">{t.creativeTools}</div>
          <TabButton active={activeTab === TabType.STUDIO_PRO} onClick={() => handleTabChange(TabType.STUDIO_PRO)} icon="fa-cube" label={t.studioPro} />
          <TabButton active={activeTab === TabType.VIRTUAL_SHOOT} onClick={() => handleTabChange(TabType.VIRTUAL_SHOOT)} icon="fa-camera-rotate" label={t.virtualShoot} />
          <TabButton active={activeTab === TabType.IMAGE_BLENDER} onClick={() => handleTabChange(TabType.IMAGE_BLENDER)} icon="fa-layer-group" label={t.imageBlender} />
          <TabButton active={activeTab === TabType.SHIFTER_3D} onClick={() => handleTabChange(TabType.SHIFTER_3D)} icon="fa-cubes" label={t.shifter3D} />
          <TabButton active={activeTab === TabType.IMAGINE} onClick={() => handleTabChange(TabType.IMAGINE)} icon="fa-wand-magic-sparkles" label={t.imagine} />
          <TabButton active={activeTab === TabType.MOCKUP_STUDIO} onClick={() => handleTabChange(TabType.MOCKUP_STUDIO)} icon="fa-shirt" label={t.mockupStudio} />
          <TabButton active={activeTab === TabType.VISUAL_IDENTITY} onClick={() => handleTabChange(TabType.VISUAL_IDENTITY)} icon="fa-fingerprint" label={t.visualIdentity} />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 px-2">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-[11px] text-slate-400">
            <p>{t.poweringVisuals}</p>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col min-w-0 bg-slate-950/50">
        <div className="lg:hidden h-[60px] w-full shrink-0"></div>
        <Header 
          activeTab={activeTab} 
          hasControls={hasControls} 
          onToggleControls={() => setIsSidebarOpen(!isSidebarOpen)} 
          lang={lang}
          onToggleLang={toggleLang}
        />
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>

      {hasControls && (
        <Sidebar 
          controls={controls} 
          setControls={setControls} 
          activeTab={activeTab} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          lang={lang}
        />
      )}

      {isNavOpen && <div onClick={() => setIsNavOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"></div>}
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
      active ? 'active-tab' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
    }`}
  >
    <i className={`fa-solid ${icon} w-5 text-center group-hover:scale-110 transition-transform`}></i>
    <span className="font-medium">{label}</span>
  </button>
);

export default App;
