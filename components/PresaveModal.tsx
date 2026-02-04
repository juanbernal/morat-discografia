
import React, { useEffect, useState } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';
import SpotifyIcon from './SpotifyIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface PresaveModalProps {
    releases: UpcomingRelease[];
    onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const parseDate = (dateStr: string) => {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        let year = parseInt(parts[3], 10);
        if (year < 100) year += 2000;
        return new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
    }
    return new Date(dateStr);
};

const calculateTimeLeft = (releaseDate: string) => {
    const target = parseDate(releaseDate);
    const difference = +target - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, hasReleased: true };
    
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        hasReleased: false
    };
};

const PresaveModal: React.FC<PresaveModalProps> = ({ releases, onClose }) => {
    const [timers, setTimers] = useState<Record<string, any>>({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const interval = setInterval(() => {
            const newTimers: Record<string, any> = {};
            releases.forEach(r => {
                newTimers[r.name] = calculateTimeLeft(r.releaseDate);
            });
            setTimers(newTimers);
        }, 1000);
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(interval);
        };
    }, [releases]);

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950 overflow-hidden animate-fade-in font-sans">
            {/* Background Blur effects */}
            <div className="absolute inset-0 z-0 flex">
                {releases.slice(0, 2).map((r, i) => (
                    <div 
                        key={`bg-${i}`} 
                        className="flex-1 bg-cover bg-center opacity-20 blur-[120px] scale-150"
                        style={{ backgroundImage: `url(${r.coverImageUrl})` }}
                    />
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950 to-slate-950" />
            </div>

            <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center px-6 py-10">
                <div className="w-full flex justify-between items-center mb-12 max-w-6xl mx-auto">
                    <h2 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em]">Diosmasgym Records • Estrenos Mundiales</h2>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/10 shadow-2xl backdrop-blur-xl"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className={`grid grid-cols-1 ${releases.length > 1 ? 'lg:grid-cols-2' : 'max-w-xl'} gap-12 lg:gap-24 items-start w-full max-w-7xl mx-auto`}>
                    {releases.slice(0, 2).map((release, index) => {
                        const timeLeft = timers[release.name] || calculateTimeLeft(release.releaseDate);
                        const isJuan = release.artistName.toLowerCase().includes('614');

                        return (
                            <div key={`modal-rel-${index}`} className="flex flex-col items-center text-center animate-fade-in group">
                                <div className="relative w-full aspect-square max-w-[320px] md:max-w-[400px] mb-8">
                                    <div className={`absolute -inset-8 ${isJuan ? 'bg-amber-500/30' : 'bg-blue-600/30'} blur-[80px] rounded-full opacity-60 animate-pulse`} />
                                    <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/20 transform group-hover:scale-[1.02] transition-transform duration-700">
                                        <img src={release.coverImageUrl} alt={release.name} className="w-full h-full object-cover" />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <span className={`inline-block px-4 py-1.5 rounded-full mb-4 text-[9px] font-black uppercase tracking-[0.3em] border ${isJuan ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                        {release.artistName}
                                    </span>
                                    <h3 className="text-4xl lg:text-6xl font-black text-white leading-tight tracking-tighter mb-6 drop-shadow-2xl">
                                        {release.name}
                                    </h3>
                                    
                                    <div className="mb-10 scale-90 md:scale-100">
                                        {timeLeft.hasReleased ? (
                                            <span className="text-2xl font-black text-emerald-400 animate-bounce block uppercase">¡YA DISPONIBLE!</span>
                                        ) : (
                                            <CountdownTimer {...timeLeft} />
                                        )}
                                    </div>
                                </div>

                                <div className="w-full max-w-sm space-y-4">
                                    <a 
                                        href={release.preSaveLink} 
                                        target="_blank" 
                                        className="flex items-center justify-between bg-[#1DB954] hover:bg-[#1ed760] p-5 rounded-[1.5rem] transition-all group shadow-xl active:scale-95"
                                    >
                                        <div className="flex items-center gap-4 text-white">
                                            <SpotifyIcon className="w-8 h-8" />
                                            <span className="font-black text-lg tracking-tight">Pre-Save</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white bg-black/20 px-5 py-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-[#1DB954]">GUARDAR</span>
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-20">
                    <button 
                        onClick={onClose}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors py-4 border-b border-white/5"
                    >
                        Entrar al Sitio Oficial
                    </button>
                </div>
            </div>
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default PresaveModal;
