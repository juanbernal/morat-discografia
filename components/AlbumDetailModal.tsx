import React, { useState, useEffect, useRef } from 'react';
import type { Album, Track } from '../types';
import { getAlbumTracks } from '../services/spotifyService';
import TrackItem from './TrackItem';
import Spinner from './Spinner';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface AlbumDetailModalProps {
    album: Album | null;
    onClose: () => void;
    onTrackSelect: (track: Track) => void;
    playingTrackId: string | null | undefined;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({ album, onClose, onTrackSelect, playingTrackId }) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (album) {
            document.body.style.overflow = 'hidden';
            setLoading(true);
            setTracks([]);
            getAlbumTracks(album.id)
                .then(simplifiedTracks => {
                    const fullTracks: Track[] = simplifiedTracks.map(st => ({
                        ...st,
                        album: album,
                        source: 'spotify',
                    }));
                    setTracks(fullTracks);
                })
                .catch(err => {
                    console.error("Failed to load album tracks:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [album]);

    if (!album) return null;
    
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + album.artists[0].name)}`;
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(album.name + " " + album.artists[0].name)}`;
    const spotifyUrl = album.external_urls.spotify || '';

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 animate-fade-in overflow-hidden">
            {/* Backdrop Inmersivo */}
            <div className="absolute inset-0 bg-slate-950/95 md:backdrop-blur-2xl transition-all duration-700" onClick={onClose}></div>

            {/* Contenedor del Modal - DISEÑO TIPO APP NATIVA */}
            <div 
                className="relative w-full h-full md:h-[85vh] md:max-w-7xl bg-slate-950 md:rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] border-t md:border border-white/10 flex flex-col md:flex-row animate-pop-in"
            >
                {/* Iluminación Dinámica de fondo basada en la portada */}
                <div 
                    className="absolute inset-0 opacity-30 blur-[120px] pointer-events-none scale-150 transition-all duration-1000"
                    style={{ backgroundImage: `url(${album.images?.[0]?.url})`, backgroundSize: 'cover' }}
                ></div>

                {/* PANEL IZQUIERDO: ARTE Y CONTROLES (FIJO EN PC) */}
                <div className="relative z-20 w-full md:w-[45%] p-8 md:p-16 flex flex-col items-center md:items-start justify-center md:border-r border-white/5 bg-gradient-to-br from-black/40 to-transparent">
                    
                    <button onClick={onClose} className="absolute top-6 right-6 md:hidden p-3 bg-white/10 rounded-full border border-white/20 z-50">
                        <CloseIcon className="w-6 h-6 text-white" />
                    </button>

                    <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-full md:aspect-square mb-10 group">
                        <div className="absolute -inset-8 bg-blue-600/30 blur-[80px] rounded-full opacity-60 animate-pulse"></div>
                        <img 
                            src={album.images?.[0]?.url} 
                            alt={album.name} 
                            className="relative w-full h-full object-cover rounded-[2rem] md:rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,1)] border border-white/20 transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div className="text-center md:text-left w-full">
                        <div className="inline-flex items-center gap-2 mb-6 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
                            <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                                {album.album_type === 'single' ? 'Sencillo' : 'Álbum Oficial'}
                            </span>
                            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                                {new Date(album.release_date).getFullYear()}
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 tracking-tighter leading-[0.85] drop-shadow-2xl">
                            {album.name}
                        </h2>
                        <p className="text-xl text-blue-500/80 font-black mb-10 uppercase tracking-[0.4em]">Diosmasgym</p>

                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {spotifyUrl && (
                                <a href={spotifyUrl} target="_blank" rel="noopener" className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-[#1DB954] text-white rounded-[1.2rem] border border-white/10 transition-all hover:scale-115 active:scale-90 shadow-2xl group">
                                    <SpotifyIcon className="w-6 h-6 group-hover:scale-125 transition-transform" />
                                </a>
                            )}
                            <a href={appleMusicUrl} target="_blank" rel="noopener" className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-[#FA243C] text-white rounded-[1.2rem] border border-white/10 transition-all hover:scale-115 active:scale-90 shadow-2xl group">
                                <AppleMusicIcon className="w-6 h-6 group-hover:scale-125 transition-transform" />
                            </a>
                            <a href={youtubeUrl} target="_blank" rel="noopener" className="w-14 h-14 flex items-center justify-center bg-white/5 hover:bg-[#FF0000] text-white rounded-[1.2rem] border border-white/10 transition-all hover:scale-115 active:scale-90 shadow-2xl group">
                                <YoutubeMusicIcon className="w-6 h-6 group-hover:scale-125 transition-transform" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO: LISTADO DE CANCIONES (SCROLLABLE) */}
                <div className="relative z-20 flex-1 flex flex-col min-h-0 bg-black/60 backdrop-blur-3xl">
                    
                    {/* Header Pistas (PC) */}
                    <div className="hidden md:flex items-center justify-between px-12 py-10 border-b border-white/5">
                        <div>
                             <h3 className="text-xs font-black uppercase tracking-[0.5em] text-white/30 mb-2">Lista de Reproducción</h3>
                             <p className="text-white font-black text-2xl tracking-tighter">{tracks.length} Canciones Disponibles</p>
                        </div>
                        <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-transparent hover:border-white/10">
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Area de Scroll Optimizado */}
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:px-12 md:py-8">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-8 min-h-[400px]">
                                <Spinner />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Sincronizando...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3 pb-20">
                                {tracks.map((track, index) => (
                                    <TrackItem
                                        key={track.id}
                                        track={track}
                                        index={index}
                                        onSelect={() => onTrackSelect(track)}
                                        isPlaying={playingTrackId === track.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9) translateY(40px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-pop-in {
                    animation: popIn 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(255, 255, 255, 0.1); 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.25);
                }
            `}</style>
        </div>
    );
};

export default AlbumDetailModal;