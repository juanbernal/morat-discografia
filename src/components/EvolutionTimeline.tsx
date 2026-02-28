
import React, { useEffect, useRef, useState } from 'react';
import type { Album } from '../types';

interface EvolutionTimelineProps {
    albums: Album[];
    onSelect: (album: Album) => void;
}

const EvolutionTimeline: React.FC<EvolutionTimelineProps> = ({ albums, onSelect }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Ordenar álbumes por fecha (del más antiguo al más reciente)
    const sortedAlbums = [...albums].sort((a, b) => 
        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.5
        };

        const handleIntersect = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index') || '0');
                    setActiveIndex(index);
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        const elements = containerRef.current?.querySelectorAll('.timeline-item');
        elements?.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [sortedAlbums]);

    if (sortedAlbums.length === 0) return null;

    return (
        <section className="relative py-32 overflow-hidden" ref={containerRef}>
            <div className="flex flex-col items-center mb-24 text-center px-4">
                <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Legacy</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">
                    Nuestra <span className="text-blue-600">Evolución</span>
                </h2>
                <div className="w-24 h-1.5 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-4">
                {/* Vertical Line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block">
                    <div 
                        className="absolute top-0 w-full bg-gradient-to-b from-blue-600 via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-700 ease-out"
                        style={{ height: `${((activeIndex + 1) / sortedAlbums.length) * 100}%` }}
                    />
                </div>

                <div className="space-y-24 md:space-y-32">
                    {sortedAlbums.map((album, index) => {
                        const year = new Date(album.release_date).getFullYear();
                        const isEven = index % 2 === 0;
                        const isActive = activeIndex === index;

                        return (
                            <div 
                                key={album.id}
                                data-index={index}
                                className={`timeline-item relative flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Year background decoration */}
                                <div className={`absolute -z-10 text-[10rem] md:text-[18rem] font-black opacity-[0.03] select-none pointer-events-none transition-all duration-1000 ${isActive ? 'opacity-[0.08] scale-110 text-blue-500' : ''} ${isEven ? 'left-0' : 'right-0'}`}>
                                    {year}
                                </div>

                                {/* Content Box */}
                                <div className={`w-full md:w-[45%] ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                                    <div 
                                        onClick={() => onSelect(album)}
                                        className={`
                                            group cursor-pointer p-6 md:p-8 rounded-[2.5rem] border transition-all duration-700 backdrop-blur-3xl
                                            ${isActive 
                                                ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.1)] scale-105' 
                                                : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}
                                        `}
                                    >
                                        <span className={`text-[10px] font-black uppercase tracking-widest mb-2 block ${isActive ? 'text-blue-400' : 'text-white/30'}`}>
                                            {year} • {album.album_type === 'single' ? 'Single' : 'Álbum'}
                                        </span>
                                        <h3 className={`text-2xl md:text-3xl font-black tracking-tighter mb-4 ${isActive ? 'text-white' : 'text-white/60'}`}>
                                            {album.name}
                                        </h3>
                                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-blue-500/50 transition-colors">
                                            Click para explorar
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline Marker (Dot) */}
                                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 items-center justify-center">
                                    <div className={`
                                        w-4 h-4 rounded-full transition-all duration-500 border-2
                                        ${isActive ? 'bg-blue-600 border-white scale-150 shadow-[0_0_20px_rgba(59,130,246,1)]' : 'bg-slate-900 border-white/20 scale-100'}
                                    `} />
                                </div>

                                {/* Image Box */}
                                <div className={`w-full md:w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`
                                        relative w-48 h-48 md:w-64 md:h-64 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-1000
                                        ${isActive ? 'scale-110 rotate-3' : 'scale-90 opacity-40 grayscale'}
                                    `}>
                                        <img 
                                            src={album.images[0]?.url} 
                                            alt={album.name} 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Background Glows */}
            <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        </section>
    );
};

export default EvolutionTimeline;
