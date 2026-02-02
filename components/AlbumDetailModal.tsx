
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

            {/* Contenedor del Modal */}
            <div 
                className="relative w-full h-full md:h-[85vh] md:max-w-7xl bg-slate-950 md:rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] border-t md:border border-white/10 flex flex-col md:flex-row animate-pop-in"
            >
                {/* Iluminación Dinámica de fondo */}
                <div 
                    className="absolute inset-0 opacity-30 blur-[120px] pointer-events-none scale-150 transition-all duration-1000"
                    style={{ backgroundImage: `url(${album.images?.[0]?.url})`, backgroundSize: 'cover' }}
                ></div>

                {/* PANEL IZQUIERDO: ARTE Y CONTROLES */}
                <div className="relative z-20 w-full md:w-[40%] p-8 md:p-12 flex flex-col items-center md:items-start justify-center md:border-r border-white/5 bg-gradient-to-br from-black/40 to-transparent">
                    
                    <button onClick={onClose} className="absolute top-6 right-6 md:hidden p-3 bg-white/10 rounded-full border border-white/20 z-50">
                        <CloseIcon className="w-5 h-5 text-white" />
                    </button>

                    <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-full md:aspect-square mb-8 group">
                        <div className="absolute -inset-6 bg-blue-600/30 blur-[60px] rounded-full opacity-60"></div>
                        <img 
                            src={album.images?.[0]?.url} 
                            alt={album.name} 
                            className="relative w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,1)] border border-white/20"
                        />
                    </div>

                    <div className="text-center md:text-left w-full">
                        <div className="inline-flex items-center gap-2 mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
                            <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                {album.album_type === 'single' ? 'Sencillo' : 'Álbum Oficial'}
                            </span>
                        </div>
                        
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tighter leading-tight drop-shadow-2xl">
                            {album.name}
                        </h2>
                        <p className="text-lg text-blue-500/80 font-black mb-8 uppercase tracking-[0.4em]">Diosmasgym</p>
                        
                        {/* Pequeña info adicional solo en PC */}
                        <div className="hidden md:block space-y-2 opacity-40 text-[10px] font-black uppercase tracking-widest">
                            <p>Fecha: {new Date(album.release_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p>Tracks: {album.total_tracks} canciones</p>
                        </div>
                    </div>
                </div>

                {/* PANEL DERECHO: ENLACES Y LISTADO */}
                <div className="relative z-20 flex-1 flex flex-col min-h-0 bg-black/60 backdrop-blur-3xl">
                    
                    {/* Area de Scroll */}
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:px-12 md:py-10">
                        
                        {/* SECCIÓN ESCUCHAR EN (Estilo Destacado) */}
                        <section className="mb-12 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Escuchar en Plataformas</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                <a href={spotifyUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <SpotifyIcon className="w-5 h-5" /> Spotify
                                </a>
                                <a href={appleMusicUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#FA243C] hover:bg-[#fa3c52] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <AppleMusicIcon className="w-5 h-5" /> Apple
                                </a>
                                <a href={youtubeUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#FF0000] hover:bg-[#ff3333] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <YoutubeMusicIcon className="w-5 h-5" /> YouTube
                                </a>
                            </div>
                        </section>

                        <div className="h-px w-full bg-white/5 mb-10"></div>

                        {/* LISTADO DE CANCIONES */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Contenido del Disco</h3>
                                <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                    {tracks.length} Pistas
                                </span>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <Spinner />
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500 animate-pulse">Cargando pistas...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 pb-12">
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
                        </section>
                    </div>

                    {/* Botón Cerrar (PC) */}
                    <button 
                        onClick={onClose} 
                        className="hidden md:flex absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/10 shadow-2xl z-[60]"
                    >
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-pop-in {
                    animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(255, 255, 255, 0.1); 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
};

export default AlbumDetailModal;
