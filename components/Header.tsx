
import React from 'react';
import { TabType } from '../types';
import { translations, LangType } from '../translations';

interface HeaderProps {
  activeTab: TabType;
  hasControls?: boolean;
  onToggleControls?: () => void;
  lang: LangType;
  onToggleLang: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, hasControls, onToggleControls, lang, onToggleLang }) => {
  const t = translations[lang];
  
  const getTabMeta = () => {
    switch(activeTab) {
      case TabType.ABOUT: return { title: t.dashboard, desc: t.welcomeDesc };
      case TabType.STUDIO_PRO: return { title: t.studioPro, desc: t.compositeDesc };
      case TabType.VIRTUAL_SHOOT: return { title: t.virtualShoot, desc: t.virtualShootDesc };
      case TabType.IMAGE_BLENDER: return { title: t.imageBlender, desc: t.blenderDesc };
      case TabType.SHIFTER_3D: return { title: t.shifter3D, desc: t.shifterDesc };
      case TabType.IMAGINE: return { title: t.imagine, desc: t.imagineDesc };
      case TabType.MOCKUP_STUDIO: return { title: t.mockupStudio, desc: t.mockupDesc };
      default: return { title: '', desc: '' };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="px-4 lg:px-8 py-4 lg:py-6 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-0.5 truncate">{meta.title}</h2>
          <p className="text-slate-400 text-xs lg:text-sm max-w-2xl truncate lg:whitespace-normal">{meta.desc}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLang}
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-xs hover:border-indigo-500/50 transition-all"
          >
            <i className="fa-solid fa-language"></i>
            {t.switchLang}
          </button>
          {hasControls && (
            <button 
              onClick={onToggleControls}
              className="xl:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all whitespace-nowrap"
            >
              <i className="fa-solid fa-sliders"></i>
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">{t.settings}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
