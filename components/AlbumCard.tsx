
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
    const artistNames = album.artists.map(a => a.name).join(', ');
    const isJuan614 = artistNames.toLowerCase().includes('614');
    
    const spotifyUrl = album.external_urls.spotify;
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + artistNames)}`;

    return (
        <div className="group flex flex-col gap-3 animate-fade-in">
            <div 
                className={`
                    relative aspect-square w-full overflow-hidden rounded-[1.2rem] md:rounded-[2rem] bg-slate-900 border transition-all duration-700
                    ${isNewest 
                        ? (isJuan614 ? 'border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.1)] group-hover:border-amber-500' : 'border-blue-500/40 shadow-[0_0_40px_rgba(59,130,246,0.1)] group-hover:border-blue-500')
                        : 'border-white/5 shadow-2xl group-hover:border-white/20'}
                    group-hover:scale-[1.05]
                `}
            >
                {/* Imagen Principal */}
                <img 
                    src={imageUrl} 
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-all duration-1000 group-hover:scale-110" 
                    loading="lazy"
                    onClick={() => onSelect(album)}
                />

                {/* Botones de Acceso Directo visibles en Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-500 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 z-20">
                    <div className="flex gap-2">
                        {spotifyUrl && (
                            <a 
                                href={spotifyUrl} 
                                target="_blank" 
                                className="p-3 bg-[#1DB954] text-white rounded-xl shadow-xl hover:scale-110 transition-transform"
                                title="Escuchar en Spotify"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SpotifyIcon className="w-5 h-5" />
                            </a>
                        )}
                        <a 
                            href={youtubeUrl} 
                            target="_blank" 
                            className="p-3 bg-[#FF0000] text-white rounded-xl shadow-xl hover:scale-110 transition-transform"
                            title="Escuchar en YouTube Music"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <YoutubeMusicIcon className="w-5 h-5" />
                        </a>
                    </div>
                    <button 
                        onClick={() => onSelect(album)}
                        className="text-[8px] font-black text-white uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20"
                    >
                        Ver Tracklist
                    </button>
                </div>

                {isNewest && (
                    <div className="absolute top-2 left-2 z-30">
                        <div className={`${isJuan614 ? 'bg-amber-500' : 'bg-blue-600'} text-white text-[6px] md:text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 shadow-2xl`}>
                            NUEVO
                        </div>
                    </div>
                )}
            </div>

            <div className="px-1 text-center md:text-left">
                <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-0.5 truncate opacity-70 ${isJuan614 ? 'text-amber-500' : 'text-blue-500'}`}>
                    {artistNames}
                </p>
                <h3 className="font-black text-[10px] md:text-sm text-white leading-tight tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                    {album.name}
                </h3>
            </div>
        </div>
    );
};

export default AlbumCard;
