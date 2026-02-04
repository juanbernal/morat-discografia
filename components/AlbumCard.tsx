
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface AlbumCardProps {
    album: Album;
    onSelect: (album: Album) => void;
    isNewest?: boolean;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSelect, isNewest }) => {
    const imageUrl = album.images.length > 0 ? album.images[0].url : 'https://picsum.photos/800/800';
    const artistName = album.artists.map(a => a.name).join(', ');
    const spotifyUrl = album.external_urls.spotify;
    const youtubeUrl = album.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + artistName)}`;
    
    const mainLink = spotifyUrl || youtubeUrl;

    return (
        <div 
            className="group relative flex flex-col gap-4 animate-fade-in cursor-pointer"
            onClick={() => onSelect(album)}
        >
            {/* Contenedor de la Imagen / Miniatura */}
            <div 
                className={`
                    relative aspect-square w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 border transition-all duration-700
                    ${isNewest 
                        ? 'border-blue-500/40 shadow-[0_0_50px_rgba(59,130,246,0.15)]' 
                        : 'border-white/5 shadow-2xl group-hover:border-white/20'}
                    group-hover:translate-y-[-8px]
                `}
            >
                <img 
                    src={imageUrl} 
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
                    loading="lazy"
                />

                {/* Overlay dinámico */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                
                {/* Botón de acción flotante */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="p-5 bg-white text-black rounded-full shadow-2xl shadow-blue-500/20 mb-3 transform group-hover:rotate-12 transition-transform duration-500">
                        {spotifyUrl ? <SpotifyIcon className="w-8 h-8" /> : <YoutubeMusicIcon className="w-8 h-8" />}
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] bg-blue-600/90 px-6 py-2 rounded-full backdrop-blur-xl shadow-xl border border-white/20">
                        Ver Álbum
                    </span>
                </div>

                {isNewest && (
                    <div className="absolute top-5 left-5 z-20">
                        <span className="bg-blue-600 text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest border border-white/20 shadow-2xl">
                            New
                        </span>
                    </div>
                )}
            </div>

            {/* Información del Álbum debajo de la miniatura */}
            <div className="px-2 transition-transform duration-500 group-hover:translate-x-1">
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] mb-1 truncate">
                    {artistName}
                </p>
                <h3 className="font-black text-sm md:text-xl text-white leading-tight tracking-tighter group-hover:text-blue-400 transition-colors line-clamp-2">
                    {album.name}
                </h3>
            </div>
        </div>
    );
};

export default AlbumCard;
