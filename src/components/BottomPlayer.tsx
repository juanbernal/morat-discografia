import React, { useState, useEffect, useRef } from 'react';
import type { Track } from '../types';

interface BottomPlayerProps {
    track: Track | null;
    onClose: () => void;
}

const BottomPlayer: React.FC<BottomPlayerProps> = ({ track, onClose }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    
    if (!track) return null;

    const youtubeUrl = track.external_urls.youtube || '';
    let videoId = '';
    if (youtubeUrl.includes('v=')) videoId = youtubeUrl.split('v=')[1].split('&')[0];
    else if (youtubeUrl.includes('youtu.be/')) videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
    else if (youtubeUrl.includes('embed/')) videoId = youtubeUrl.split('embed/')[1].split('?')[0];
    else if (youtubeUrl.includes('shorts/')) videoId = youtubeUrl.split('shorts/')[1].split('?')[0];

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&rel=0&origin=${window.location.origin}`;

    return (
        <div 
            className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out transform ${
                track ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div className={`max-w-screen-2xl mx-auto px-4 pb-4`}>
                <div className={`bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 ${isExpanded ? 'h-[70vh]' : 'h-24 md:h-28'}`}>
                    <div className="flex h-full relative">
                        {/* Video Layer */}
                        <div className={`transition-all duration-500 overflow-hidden bg-black ${isExpanded ? 'w-full h-full' : 'w-24 md:w-40 h-full'}`}>
                            <iframe 
                                src={embedUrl}
                                className="w-full h-full border-none"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Info & Controls Layer */}
                        {!isExpanded && (
                            <div className="flex-1 flex items-center justify-between px-4 md:px-8 gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-sm md:text-base font-black truncate tracking-tight">{track.name}</h4>
                                    <p className="text-blue-500 text-[10px] md:text-xs font-black uppercase tracking-widest truncate">
                                        {track.artists.map(a => a.name).join(', ')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4">
                                    <button 
                                        onClick={() => setIsExpanded(true)}
                                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/40 hover:text-white transition-all"
                                        title="Expandir"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </button>
                                    <button 
                                        onClick={onClose}
                                        className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full text-white/40 hover:text-red-500 transition-all font-bold"
                                        title="Cerrar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Expanded Close/Collapse Button */}
                        {isExpanded && (
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => setIsExpanded(false)}
                                    className="p-3 bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-white transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="p-3 bg-black/50 hover:bg-red-500/20 backdrop-blur-md border border-white/10 rounded-full text-white transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomPlayer;
