
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
    const formattedDate = targetDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

    return (
        <section className="relative w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] group animate-fade-in mb-16 md:mb-32">
            {/* Background Layer: Immersive Blur */}
            <div className="absolute inset-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30 blur-[60px] md:blur-[100px] scale-125 transition-transform duration-[10s] group-hover:scale-100"
                    style={{ backgroundImage: `url(${release.coverImageUrl})` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/95 to-blue-950/40"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-8 md:gap-16 lg:gap-24">
                
                {/* Visual Art Side */}
                <div className="relative w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[460px] shrink-0">
                    <div className="absolute -inset-8 bg-blue-600/20 blur-[60px] rounded-full opacity-40"></div>
                    <div className="relative aspect-square rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 transition-all duration-700 group-hover:scale-[1.02]">
                        <img 
                            src={release.coverImageUrl} 
                            alt={release.name} 
                            className="w-full h-full object-cover" 
                        />
                    </div>
                </div>

                {/* Content Details Side */}
                <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 mb-6 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full backdrop-blur-3xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[9px] md:text-xs font-black text-blue-400 uppercase tracking-[0.2em]">
                            PRÓXIMO ESTRENO
                        </span>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-tight lg:leading-[0.85] tracking-tighter drop-shadow-2xl">
                        {release.name}
                    </h2>

                    <p className="text-white/40 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-8">
                        DISPONIBLE EL {formattedDate}
                    </p>

                    <div className="w-full max-w-md mb-8">
                        {hasReleased ? (
                            <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 backdrop-blur-3xl font-black py-4 px-6 rounded-2xl text-lg animate-pulse">
                                ¡YA DISPONIBLE!
                            </div>
                        ) : (
                            <div className="p-4 md:p-6 bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-white/10 w-full">
                                <CountdownTimer {...timeLeft} />
                            </div>
                        )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-black py-4 px-8 rounded-2xl text-sm md:text-base transition-all hover:scale-105 active:scale-95 shadow-xl"
                        >
                            <SpotifyIcon className="w-5 h-5" />
                            Pre-Save
                        </a>
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener"
                            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-black py-4 px-8 rounded-2xl text-sm md:text-base transition-all hover:scale-105 active:scale-95 border border-white/10"
                        >
                            <AppleMusicIcon className="w-5 h-5" />
                            Pre-Add
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingReleaseCard;
