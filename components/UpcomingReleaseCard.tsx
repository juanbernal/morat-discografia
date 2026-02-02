import React, { useState, useEffect } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';
import SpotifyIcon from './SpotifyIcon';
import AppleMusicIcon from './AppleMusicIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface UpcomingReleaseCardProps {
    release: UpcomingRelease;
}

const parseCustomDateString = (dateStr: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1; 
        let year = parseInt(parts[3], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day);
    }
    return new Date(dateStr);
};

const calculateTimeLeft = (releaseDate: string) => {
    const difference = +parseCustomDateString(releaseDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return { timeLeft, hasReleased: difference <= 0 };
};

const UpcomingReleaseCard: React.FC<UpcomingReleaseCardProps> = ({ release }) => {
    const [{ timeLeft, hasReleased }, setTimeLeft] = useState(calculateTimeLeft(release.releaseDate));

    useEffect(() => {
        if (hasReleased) return;
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(release.releaseDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [release.releaseDate, hasReleased]);

    const targetDate = parseCustomDateString(release.releaseDate);
    const formattedDate = targetDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <section className="relative w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] group animate-fade-in mb-20 md:mb-32">
            {/* Background Layer: Immersive Blur */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-40 blur-[100px] scale-125 transition-transform duration-[10s] group-hover:scale-100"
                    style={{ backgroundImage: `url(${release.coverImageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-blue-950/40"></div>
                <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            </div>

            <div className="relative z-10 p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                
                {/* Visual Art Side */}
                <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[500px] shrink-0">
                    <div className="absolute -inset-12 bg-blue-600/30 blur-[100px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-1000"></div>
                    <div className="relative aspect-square rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1)] border border-white/20 transition-all duration-1000 group-hover:scale-[1.02] group-hover:rotate-1">
                        <img 
                            src={release.coverImageUrl} 
                            alt={release.name} 
                            className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                </div>

                {/* Content Details Side */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 mb-8 bg-blue-500/10 border border-blue-500/20 px-5 py-2 rounded-full backdrop-blur-3xl shadow-lg">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        <span className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-[0.3em]">
                            PRÓXIMO LANZAMIENTO
                        </span>
                    </div>
                    
                    <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.85] tracking-tighter drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
                        {release.name}
                    </h2>

                    <p className="text-white/40 font-black uppercase tracking-[0.4em] text-xs md:text-sm mb-12">
                        DISPONIBLE EL {formattedDate}
                    </p>

                    <div className="w-full max-w-xl mb-12">
                        {hasReleased ? (
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-3xl font-black py-6 px-10 rounded-[2rem] text-xl md:text-2xl animate-pulse flex items-center justify-center gap-4">
                                <span>🔥</span> ¡DISPONIBLE AHORA! <span>🔥</span>
                            </div>
                        ) : (
                            <div className="p-6 md:p-10 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 w-full shadow-2xl">
                                <CountdownTimer {...timeLeft} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-center gap-4 bg-[#1DB954] hover:bg-[#1ed760] text-white font-black py-5 px-10 md:px-14 rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-xl transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(29,185,84,0.4)] border border-white/10"
                        >
                            <SpotifyIcon className="w-7 h-7" />
                            Pre-Save
                        </a>
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 text-white font-black py-5 px-10 md:px-14 rounded-[1.5rem] md:rounded-[2rem] text-lg md:text-xl transition-all hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-3xl shadow-2xl"
                        >
                            <AppleMusicIcon className="w-7 h-7" />
                            Pre-Add
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingReleaseCard;