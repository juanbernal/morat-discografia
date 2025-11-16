
import React, { useState, useEffect } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';

interface UpcomingReleaseCardProps {
    release: UpcomingRelease;
}

const parseCustomDateString = (dateStr: string): Date => {
    // Check for ISO format first (YYYY-MM-DD), which is the most reliable
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return new Date(dateStr);
    }

    // Try to parse DD/MM/YY or DD/MM/YYYY with slashes or hyphens
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        // parts will be [full_match, day, month, year]
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1; // Month is 0-indexed in JS Date
        let year = parseInt(parts[3], 10);

        // Handle 2-digit year, assume 21st century
        if (year < 100) {
            year += 2000;
        }
        
        return new Date(year, month, day);
    }

    // Fallback to browser's default parsing if no specific format matches
    console.warn(`El formato de fecha "${dateStr}" no es estándar. Se intentará un análisis genérico. Se recomienda el formato AAAA-MM-DD o DD/MM/AAAA.`);
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
    
    return (
        <section className="mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 px-2">Próximo Estreno</h2>
            <div className="relative rounded-lg overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-[#282828] border border-gray-700 shadow-xl">
                <div className="absolute inset-0">
                    <img src={release.coverImageUrl} alt={`Cover for ${release.name}`} className="w-full h-full object-cover opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#282828] via-[#282828] to-transparent"></div>
                </div>
                
                <div className="relative w-40 h-40 md:w-48 md:h-48 flex-shrink-0">
                     <img src={release.coverImageUrl} alt={release.name} className="w-full h-full object-cover rounded-lg shadow-lg shadow-black/50" />
                </div>

                <div className="relative flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{release.name}</h3>
                    {hasReleased ? (
                        <div className="bg-amber-400 text-black font-bold py-3 px-6 rounded-lg text-center text-xl">
                            ¡Ya disponible!
                        </div>
                    ) : (
                        <CountdownTimer {...timeLeft} />
                    )}
                    <a 
                        href={release.preSaveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-block bg-amber-400 text-black font-bold py-3 px-8 rounded-full text-lg transition-transform duration-300 hover:scale-105 hover:bg-amber-300 shadow-lg"
                    >
                        {hasReleased ? 'Escuchar ahora' : 'Pre-guardar'}
                    </a>
                </div>
            </div>
        </section>
    );
};

export default UpcomingReleaseCard;
