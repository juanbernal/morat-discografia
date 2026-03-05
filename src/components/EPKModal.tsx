import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SpotifyIcon from './SpotifyIcon';

interface EPKModalProps {
    onClose: () => void;
}

const EPKModal: React.FC<EPKModalProps> = ({ onClose }) => {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>

            <div className="relative w-full max-w-4xl bg-[#0a0f1d] border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.2)] h-[90vh] md:h-auto overflow-y-auto no-scrollbar">

                <div className="sticky top-0 bg-[#0a0f1d]/90 backdrop-blur-md p-6 flex justify-between items-center border-b border-white/5 z-20">
                    <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-[0.5em]">{t('footer.epk')}</h3>
                    <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 md:p-12">
                    <header className="mb-12 text-center">
                        <div className="w-24 h-24 mx-auto bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">Electronic Press Kit</h2>
                        <p className="text-gray-400 font-medium max-w-xl mx-auto">Diosmasgym Records is an independent hybrid electronic/urban music label leading the new wave of latin global sounds.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 text-center">
                            <h4 className="text-blue-500 text-3xl font-black mb-1">+2.5M</h4>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Streams Globales</p>
                        </div>
                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 text-center">
                            <h4 className="text-blue-500 text-3xl font-black mb-1">+150K</h4>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Oyentes Mensuales</p>
                        </div>
                        <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 text-center">
                            <h4 className="text-blue-500 text-3xl font-black mb-1">Top 50</h4>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">Playlists Virales</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-white font-black text-xl tracking-tighter uppercase mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                                Medios & Prensa
                            </h3>
                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-gray-400 text-sm">Descarga logotipos oficiales en alta resolución (PNG, SVG) y fotos de prensa libres de derechos para publicaciones.</p>
                                <button className="shrink-0 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                    Descargar Assets (.ZIP)
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-black text-xl tracking-tighter uppercase mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#1DB954] rounded-full"></span>
                                Pitching
                            </h3>
                            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                <p className="text-gray-400 text-sm">Escucha nuestra selección especial ("Focus Tracks") para curadores de playlists y radio.</p>
                                <a href="https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" target="_blank" rel="noreferrer" className="shrink-0 bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                                    <SpotifyIcon className="w-4 h-4" /> Escuchar Focus
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-white font-black text-xl tracking-tighter uppercase mb-4 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
                                Booking Nacional / Internacional
                            </h3>
                            <div className="bg-amber-500/5 rounded-3xl p-6 border border-amber-500/20 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <p className="text-amber-500/80 text-sm font-medium mb-1">Contacto Directo Management:</p>
                                    <a href="mailto:booking@diosmasgym.com" className="text-white font-black text-lg hover:text-amber-400 transition-colors">booking@diosmasgym.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EPKModal;
