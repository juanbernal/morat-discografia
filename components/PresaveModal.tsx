import React, { useEffect, useRef, useState } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';
import TiktokIcon from './TiktokIcon';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface PresaveModalProps {
    release: UpcomingRelease;
    onClose: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
    </svg>
);

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

const PresaveModal: React.FC<PresaveModalProps> = ({ release, onClose }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(release.releaseDate));
    const [animateProgress, setAnimateProgress] = useState(false);
    
    const currentPreSaves = 842;
    const targetPreSaves = 1000;
    const progressPercentage = (currentPreSaves / targetPreSaves) * 100;

    const targetDate = parseDate(release.releaseDate);
    const formattedDate = targetDate.toLocaleDateString('es-ES', { 
        weekday: 'short', 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(release.releaseDate));
        }, 1000);
        setTimeout(() => setAnimateProgress(true), 500);
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(timer);
        };
    }, [release.releaseDate]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-slate-950 overflow-hidden animate-fade-in font-sans">
            <div className="absolute inset-0 z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-25 blur-[100px] scale-125"
                    style={{ backgroundImage: `url(${release.coverImageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950 to-slate-950"></div>
            </div>

            <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar flex flex-col items-center pt-6 pb-20 px-6">
                
                <div className="w-full flex justify-end mb-6">
                    <button 
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all border border-white/20 backdrop-blur-3xl shadow-xl"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="w-full max-w-lg flex flex-col items-center">
                    
                    <div className="relative w-full aspect-square max-w-[280px] xs:max-w-[320px] md:max-w-[400px] mb-8 group">
                        <div className="absolute -inset-8 bg-blue-600/40 blur-[80px] rounded-full opacity-60 animate-pulse"></div>
                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] border border-white/30">
                            <img src={release.coverImageUrl} alt={release.name} className="w-full h-full object-cover" />
                            
                            {release.audioPreviewUrl && (
                                <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all">
                                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-2xl border border-white/40 rounded-full flex items-center justify-center shadow-3xl transform group-active:scale-90 transition-transform">
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="text-center w-full mb-8">
                        <h1 className="text-4xl md:text-7xl font-black text-white leading-[1] tracking-tighter mb-3 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                            {release.name}
                        </h1>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-black text-[10px] uppercase tracking-[0.3em]">
                            ESTRENO: {formattedDate}
                        </div>
                    </div>

                    <div className="w-full space-y-4 mb-10">
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-between bg-[#1DB954] hover:bg-[#1ed760] p-5 rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(29,185,84,0.4)] active:scale-[0.97] group border border-white/20"
                        >
                            <div className="flex items-center gap-4">
                                <SpotifyIcon className="w-8 h-8 text-white" />
                                <span className="text-white font-black text-lg tracking-tight">Pre-Save Spotify</span>
                            </div>
                            <span className="text-white bg-black/20 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 group-hover:bg-white group-hover:text-[#1DB954]">GUARDAR</span>
                        </a>
                        
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-5 rounded-[1.5rem] transition-all backdrop-blur-3xl active:scale-[0.97] group border border-white/10"
                        >
                            <div className="flex items-center gap-4 text-[#FA243C]">
                                <AppleMusicIcon className="w-8 h-8" />
                                <span className="text-white font-black text-lg tracking-tight">Pre-Add Apple Music</span>
                            </div>
                            <span className="text-white bg-white/5 font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black">AÑADIR</span>
                        </a>
                    </div>

                    <div className="w-full bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/10 shadow-2xl mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <div className="text-left">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Misión Comunidad</p>
                                <h4 className="text-white font-black text-sm">Libera el Adelanto Exclusivo</h4>
                            </div>
                            <p className="text-white font-black text-xl">{currentPreSaves} <span className="text-white/30 text-xs">/ {targetPreSaves}</span></p>
                        </div>
                        <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-600 via-emerald-400 to-blue-400 shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-all duration-[2500ms] ease-out rounded-full"
                                style={{ width: animateProgress ? `${progressPercentage}%` : '0%' }}
                            ></div>
                        </div>
                        <p className="text-center text-[9px] text-white/50 mt-4 uppercase font-black tracking-[0.3em] animate-pulse">¡Corre la voz para desbloquear el contenido!</p>
                    </div>

                    <div className="w-full flex flex-col items-center mb-12">
                         <div className="scale-90 xs:scale-100 opacity-90">
                             {timeLeft.hasReleased ? (
                                <div className="text-2xl font-black text-green-400 tracking-tighter animate-bounce flex items-center gap-3">
                                   <span>🔥</span> ¡YA DISPONIBLE! <span>🔥</span>
                                </div>
                            ) : (
                                <CountdownTimer {...timeLeft} />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 py-6 px-10 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                        <a href="https://tiktok.com/@diosmasgym" target="_blank" className="text-white/40 hover:text-white transition-all hover:scale-125 active:scale-90"><TiktokIcon className="w-7 h-7" /></a>
                        <a href="https://youtube.com/@diosmasgym" target="_blank" className="text-white/40 hover:text-red-500 transition-all hover:scale-125 active:scale-90"><YoutubeMusicIcon className="w-7 h-7" /></a>
                        <a href="https://www.instagram.com/diosmasgym" target="_blank" className="text-white/40 hover:text-pink-500 transition-all hover:scale-125 active:scale-90">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            {release.audioPreviewUrl && (
                <audio ref={audioRef} src={release.audioPreviewUrl} onEnded={() => setIsPlaying(false)} />
            )}
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
};

export default PresaveModal;