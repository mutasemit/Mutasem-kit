
import React from 'react';
import { LangType } from '../../translations';

interface Props {
  lang: LangType;
  t: any;
}

const AboutTab: React.FC<Props> = ({ lang, t }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="relative overflow-hidden rounded-3xl p-10 lg:p-16 border border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-purple-950/20 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <i className="fa-solid fa-sparkles"></i> AI Powered Visual Design
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {lang === 'ar' ? 'ارتقِ بـ ' : 'Elevate your '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              {lang === 'ar' ? 'سردك البصري' : 'visual storytelling'}
            </span>
            {lang === 'ar' ? ' في ثوانٍ.' : ' in seconds.'}
          </h2>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
             {t.welcomeDesc}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <i className="fa-solid fa-bolt text-xl"></i>
              </div>
              <div>
                <div className="text-white font-bold">{t.fastGen}</div>
                <div className="text-slate-500 text-xs">Powered by Gemini 2.5</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl glass-card">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <i className="fa-solid fa-camera text-xl"></i>
              </div>
              <div>
                <div className="text-white font-bold">{t.studioQual}</div>
                <div className="text-slate-500 text-xs">Up to 4K resolution</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 blur-[120px] -z-10 rounded-full"></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard icon="fa-cube" title={t.studioPro} desc={t.compositeDesc} color="indigo" />
        <FeatureCard icon="fa-camera-rotate" title={t.virtualShoot} desc={t.virtualShootDesc} color="purple" />
        <FeatureCard icon="fa-layer-group" title={t.imageBlender} desc={t.blenderDesc} color="blue" />
      </div>

      <footer className="pt-12 border-t border-slate-900">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm">{lang === 'ar' ? 'تم التطوير بواسطة' : 'Created by'} {t.developerName}</div>
          <div className="flex gap-4">
            <SocialLink icon="fa-instagram" href="https://www.instagram.com/mutasembwhjr?igsh=bGZ6ajN3NWwydTJl" />
            <SocialLink icon="fa-linkedin" href="https://www.linkedin.com/in/mutasem-ahmad-234089211/" />
            <SocialLink icon="fa-behance" href="https://www.behance.net/mutasem_ahme" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; desc: string; color: string }> = ({ icon, title, desc, color }) => (
  <div className="p-6 rounded-3xl border border-slate-900 bg-slate-900/40 hover:bg-slate-900 transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 mb-6 group-hover:scale-110 transition-transform`}>
      <i className={`fa-solid ${icon} text-xl`}></i>
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const SocialLink: React.FC<{ icon: string; href: string }> = ({ icon, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition-all">
    <i className={`fa-brands ${icon}`}></i>
  </a>
);

export default AboutTab;
