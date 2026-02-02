
import React from 'react';
import type { Track } from '../types';
import TrackItem from './TrackItem';

interface HiddenGemsProps {
    tracks: Track[];
    onTrackSelect: (track: Track) => void;
    playingTrackId?: string | null;
}

const HiddenGems: React.FC<HiddenGemsProps> = ({ tracks, onTrackSelect, playingTrackId }) => {
    // Tomamos solo los últimos 3 tracks para representar los "tesoros ocultos"
    const gems = tracks.slice(-3).reverse();

    if (gems.length === 0) return null;

    return (
        <section className="animate-fade-in relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-12 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
                            Tesoros <span className="text-emerald-500">Ocultos</span>
                        </h2>
                        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-2">
                            Joyas que merecen ser escuchadas de nuevo
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {gems.map((track, index) => (
                    <div key={track.id} className="group transition-all duration-300 hover:translate-x-2">
                        <TrackItem 
                            track={track}
                            index={index}
                            onSelect={() => onTrackSelect(track)}
                            isPlaying={playingTrackId === track.id}
                        />
                    </div>
                ))}
            </div>
            
            {/* Sutil gradiente de fondo para la sección */}
            <div className="absolute -inset-x-4 -inset-y-6 bg-emerald-500/5 blur-[80px] rounded-full -z-10 pointer-events-none"></div>
        </section>
    );
};

export default HiddenGems;
