
import React, { useState, useEffect } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';
import SpotifyIcon from './SpotifyIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface UpcomingReleaseCardProps {
    release: UpcomingRelease;
    isModalView?: boolean;
}

const parseCustomDateString = (dateStr: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return new Date(dateStr);
    }
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
    let timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    };

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
    
    // Completely redesigned to match the Hyperfollow (PresaveModal) aesthetic
    return (
        <section className="animate-fade-in mb-12 relative w-full overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl group mx-auto">
             {/* Background Blur Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-40 blur-xl scale-110"
                style={{ backgroundImage: `url(${release.coverImageUrl})` }}
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Content Container */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-8 lg:gap-16 text-center lg:text-left">
                
                {/* Album Art */}
                <div className="relative w-64 h-64 md:w-72 md:h-72 flex-shrink-0 group-hover:scale-105 transition-transform duration-500 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20">
                     <img 
                        src={release.coverImageUrl} 
                        alt={release.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>

                {/* Text & Actions */}
                <div className="flex-1 flex flex-col items-center lg:items-start max-w-2xl">
                    <div className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1 mb-4 backdrop-blur-md">
                        <span className="text-gray-200 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                            Próximo Lanzamiento
                        </span>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-xl tracking-tight">
                        {release.name}
                    </h3>

                    {/* Timer */}
                    <div className="mb-8 scale-90 md:scale-100 origin-center lg:origin-left">
                         {hasReleased ? (
                            <div className="bg-green-500/20 text-green-400 border border-green-500/50 font-bold py-3 px-8 rounded-lg text-center text-xl backdrop-blur-md">
                                ¡Ya disponible en todas las plataformas!
                            </div>
                        ) : (
                            <CountdownTimer {...timeLeft} />
                        )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold py-3 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-green-900/20 border border-white/10"
                        >
                            <SpotifyIcon className="w-6 h-6" />
                            <span>Pre-Save</span>
                        </a>
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FA243C] hover:bg-[#ff3650] text-white font-bold py-3 px-8 rounded-full text-lg transition-all hover:scale-105 shadow-lg shadow-red-900/20 border border-white/10"
                        >
                            <AppleMusicIcon className="w-6 h-6" />
                            <span>Pre-Add</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpcomingReleaseCard;
