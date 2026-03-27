import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const EdifyingGenreRecommendation: React.FC = () => {
    const { t } = useLanguage();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 rounded-[2.5rem] md:rounded-[4rem] border border-white/5 p-8 md:p-16 shadow-2xl group mb-20">
            {/* Background elements for that "Bélico" feel */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full group-hover:bg-red-500/20 transition-colors duration-1000"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full group-hover:bg-amber-400/20 transition-colors duration-1000"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-3 mb-6 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-inner">
                    <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
                        {t('recommendation.label')}
                    </span>
                </div>

                <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase leading-none italic">
                    {t('recommendation.title.1')}<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        {t('recommendation.title.2')}
                    </span>
                </h2>

                <p className="text-gray-400 text-sm md:text-xl mb-12 max-w-2xl font-medium leading-relaxed">
                    {t('recommendation.description')}
                </p>

                <div className="flex flex-col md:flex-row gap-6 items-center">
                    <a 
                        href="https://juan614.diosmasgym.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group/btn relative inline-flex items-center justify-center px-10 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                        <span className="relative z-10 group-hover/btn:text-black transition-colors">
                            {t('recommendation.cta')}
                        </span>
                        <svg className="relative z-10 ml-3 w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    <div className="text-[9px] font-black uppercase tracking-widest text-white/30 flex items-center gap-3">
                        <span className="w-8 h-[1px] bg-white/10"></span>
                        {t('recommendation.footer')}
                        <span className="w-8 h-[1px] bg-white/10"></span>
                    </div>
                </div>
            </div>

            {/* Decorative border bottom */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
        </section>
    );
};

export default EdifyingGenreRecommendation;
