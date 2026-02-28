
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface AlbumCardProps {
    album: Album;
    onSelect: (album: Album) => void;
    isNewest?: boolean;
}

const ListIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="8" y1="6" x2="21" y2="6"></line>
        <line x1="8" y1="12" x2="21" y2="12"></line>
        <line x1="8" y1="18" x2="21" y2="18"></line>
        <line x1="3" y1="6" x2="3.01" y2="6"></line>
        <line x1="3" y1="12" x2="3.01" y2="12"></line>
        <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
);

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSelect, isNewest }) => {
    const imageUrl = album.images.length > 0 ? album.images[0].url : 'https://picsum.photos/800/800';
    const artistNames = album.artists.map(a => a.name).join(', ');
    const isJuan614 = artistNames.toLowerCase().includes('614');
    
    const spotifyUrl = album.external_urls.spotify;
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + artistNames)}`;

    return (
        <div className="group flex flex-col gap-2 animate-fade-in">
            <div 
                className={`
                    relative aspect-square w-full overflow-hidden rounded-[1.5rem] md:rounded-[2.2rem] bg-slate-900 border transition-all duration-500
                    ${isNewest 
                        ? (isJuan614 ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]')
                        : 'border-white/5 shadow-xl'}
                    group-hover:scale-[1.03] group-hover:border-white/20
                `}
            >
                {/* Imagen de la Portada (Miniatura) */}
                <img 
                    src={imageUrl} 
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer transition-transform duration-700 group-hover:scale-110" 
                    loading="lazy"
                    onClick={() => onSelect(album)}
                />

                {/* Overlay de Enlaces Directos */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 md:gap-3 z-10 p-2">
                    {spotifyUrl && (
                        <a 
                            href={spotifyUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`p-2.5 md:p-3 text-white rounded-full shadow-2xl transform hover:scale-110 transition-transform ${isJuan614 ? 'bg-amber-600' : 'bg-[#1DB954]'}`}
                            title="Escuchar en Spotify"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SpotifyIcon className="w-4 h-4 md:w-5 md:h-5" />
                        </a>
                    )}
                    
                    {/* Botón para ver Tracks (Modal Interno) */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); onSelect(album); }}
                        className="p-2.5 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/20 shadow-2xl transform hover:scale-110 transition-transform"
                        title="Ver canciones"
                    >
                        <ListIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </button>

                    <a 
                        href={youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2.5 md:p-3 bg-[#FF0000] text-white rounded-full shadow-2xl transform hover:scale-110 transition-transform"
                        title="Escuchar en YouTube Music"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <YoutubeMusicIcon className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                </div>

                {/* Indicador de Nuevo */}
                {isNewest && (
                    <div className="absolute top-3 left-3 z-20">
                        <div className={`${isJuan614 ? 'bg-amber-500' : 'bg-blue-600'} text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-white/20 shadow-lg`}>
                            NUEVO
                        </div>
                    </div>
                )}
            </div>

            {/* Información y Enlaces Rápidos (Siempre visibles en móvil o hover) */}
            <div className="px-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelect(album)}>
                        <h3 className="font-black text-[11px] md:text-sm text-white leading-tight truncate group-hover:text-blue-400 transition-colors">
                            {album.name}
                        </h3>
                        <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-wider opacity-60 ${isJuan614 ? 'text-amber-500' : 'text-blue-400'}`}>
                            {isJuan614 ? 'Juan 614' : 'Diosmasgym'}
                        </p>
                    </div>
                    {/* Iconos de acceso rápido pequeños debajo de la miniatura para móvil */}
                    <div className="flex gap-1.5 md:hidden items-center">
                         <button onClick={() => onSelect(album)} className="text-white/40"><ListIcon className="w-3.5 h-3.5" /></button>
                         <a href={spotifyUrl} target="_blank" className={`${isJuan614 ? 'text-amber-500' : 'text-[#1DB954]'} opacity-80`}><SpotifyIcon className="w-3.5 h-3.5" /></a>
                         <a href={youtubeUrl} target="_blank" className="text-[#FF0000] opacity-80"><YoutubeMusicIcon className="w-3.5 h-3.5" /></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
