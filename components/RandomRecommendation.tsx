
import React, { useState, useEffect } from 'react';
import type { Track, Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface RandomRecommendationProps {
    albums: Album[];
    tracks: Track[];
    onTrackSelect: (track: Track) => void;
    onAlbumSelect: (album: Album) => void;
}

const RandomRecommendation: React.FC<RandomRecommendationProps> = ({ albums, tracks, onTrackSelect, onAlbumSelect }) => {
    const [randomItem, setRandomItem] = useState<{ type: 'album' | 'track'; data: Album | Track } | null>(null);
    const [showLinks, setShowLinks] = useState(false);

    const pickRandom = () => {
        if (albums.length === 0 && tracks.length === 0) return;
        setShowLinks(false);
        
        // Peso la probabilidad: 60% álbumes, 40% canciones top
        const useAlbum = Math.random() > 0.4;
        
        if (useAlbum && albums.length > 0) {
            const randomIndex = Math.floor(Math.random() * albums.length);
            setRandomItem({ type: 'album', data: albums[randomIndex] });
        } else if (tracks.length > 0) {
            const randomIndex = Math.floor(Math.random() * tracks.length);
            setRandomItem({ type: 'track', data: tracks[randomIndex] });
        } else {
             const randomIndex = Math.floor(Math.random() * albums.length);
             setRandomItem({ type: 'album', data: albums[randomIndex] });
        }
    };

    useEffect(() => {
        if (!randomItem && (albums.length > 0 || tracks.length > 0)) {
            pickRandom();
        }
    }, [albums, tracks, randomItem]);

    if (!randomItem) return null;

    const isAlbum = randomItem.type === 'album';
    const data = randomItem.data;
    const coverUrl = isAlbum 
        ? (data as Album).images[0]?.url 
        : (data as Track).album.images[0]?.url;
    
    const title = data.name;
    const subtitle = isAlbum ? 'Álbum / LP' : 'Sencillo / Canción';

    // Links construction
    const spotifyUrl = data.external_urls.spotify || '';
    const youtubeUrl = data.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(data.name + " " + "Diosmasgym")}`;
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(data.name + " " + "Diosmasgym")}`;

    const handleAction = () => {
        setShowLinks(true);
    };

    return (
        <div className="relative group overflow-hidden bg-slate-900/40 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 p-5 md:p-10 backdrop-blur-3xl animate-fade-in mb-12 md:mb-16 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -z-10"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                <div className="relative w-36 h-36 md:w-56 md:h-56 shrink-0">
                    <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <img 
                        src={coverUrl} 
                        alt={title} 
                        className="relative w-full h-full object-cover rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 bg-blue-600 text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl transform rotate-12 group-hover:rotate-0 transition-transform">
                        <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 mb-3 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">{isAlbum ? 'RECOMENDACIÓN DE ÁLBUM' : 'CANCIÓN DESTACADA'}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-5xl font-black text-white mb-2 tracking-tighter leading-tight">{title}</h3>
                    <p className="text-gray-400 text-xs md:text-lg mb-6 leading-relaxed max-w-xl">
                        Descubre este {subtitle.toLowerCase()} esencial de la discografía oficial.
                    </p>
                    
                    {!showLinks ? (
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                            <button 
                                onClick={handleAction}
                                className="bg-white text-black font-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
                            >
                                Escuchar Ahora
                            </button>
                            <button 
                                onClick={() => { setRandomItem(null); }}
                                className="bg-white/5 hover:bg-white/10 text-white font-black px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95"
                            >
                                Ver Otro
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 animate-fade-in">
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-center md:text-left">Selecciona una plataforma:</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <a href={spotifyUrl} target="_blank" rel="noopener" className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 border border-white/10">
                                    <SpotifyIcon className="w-4 h-4" /> Spotify
                                </a>
                                <a href={appleMusicUrl} target="_blank" rel="noopener" className="flex items-center gap-3 bg-[#FA243C] hover:bg-[#fa3c52] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 border border-white/10">
                                    <AppleMusicIcon className="w-4 h-4" /> Apple
                                </a>
                                <a href={youtubeUrl} target="_blank" rel="noopener" className="flex items-center gap-3 bg-[#FF0000] hover:bg-[#ff3333] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95 border border-white/10">
                                    <YoutubeMusicIcon className="w-4 h-4" /> YouTube
                                </a>
                                <button onClick={() => setShowLinks(false)} className="bg-white/10 text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10">
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RandomRecommendation;
