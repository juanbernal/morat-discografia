import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface AlbumCardProps {
    album: Album;
    onSelect: (album: Album) => void;
    isNewest?: boolean;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSelect, isNewest }) => {
    const imageUrl = album.images.length > 0 ? album.images[0].url : 'https://picsum.photos/400';
    const releaseYear = new Date(album.release_date).getFullYear();

    const spotifyUrl = album.external_urls.spotify;
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + (album.artists?.[0]?.name || "Diosmasgym"))}`;
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(album.name + " " + (album.artists?.[0]?.name || "Diosmasgym"))}`;

    return (
        <div className={`group relative w-full transition-all duration-500 ${isNewest ? 'scale-[1.02]' : ''}`}>
            {/* Contenedor con brillo si es nuevo */}
            <div 
                className={`
                    relative aspect-[1/1.2] w-full overflow-hidden rounded-[2rem] bg-slate-900 border cursor-pointer transition-all duration-700
                    ${isNewest 
                        ? 'border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.25)] ring-2 ring-blue-500/50 animate-pulse-slow' 
                        : 'border-white/10 shadow-2xl group-hover:border-white/30'}
                `}
                onClick={() => onSelect(album)}
            >
                {/* Imagen de fondo */}
                <img 
                    src={imageUrl} 
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                    loading="lazy"
                />

                {/* Overlays de diseño */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90"></div>
                
                {/* Badge de NOVEDAD más impactante */}
                {isNewest && (
                    <div className="absolute top-4 left-4 z-20">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-md opacity-50 animate-pulse"></div>
                            <span className="relative bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] border border-white/20 shadow-xl">
                                RECIENTE
                            </span>
                        </div>
                    </div>
                )}

                {/* Info superior (Año/Tipo) */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <span className="px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[8px] font-bold text-white/60 border border-white/10">
                        {releaseYear}
                    </span>
                </div>

                {/* Botón Play Central (Desktop) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 hidden md:flex">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl border border-white/20 group-hover:rotate-[360deg] duration-700">
                        <PlayIcon className="w-7 h-7 text-white ml-1" />
                    </div>
                </div>

                {/* Área inferior: Título e Iconos */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex flex-col justify-end">
                    <h3 className="font-black text-xl md:text-2xl text-white leading-none tracking-tighter mb-4 drop-shadow-xl line-clamp-2">
                        {album.name}
                    </h3>

                    {/* Barra de Plataformas - VISIBLES EN HOVER PC Y SIEMPRE EN MOVIL */}
                    <div className="flex items-center gap-2 md:translate-y-4 md:opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <a 
                            href={spotifyUrl} 
                            target="_blank" 
                            rel="noopener" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex justify-center py-2 bg-black/40 hover:bg-[#1DB954] rounded-xl border border-white/10 transition-all active:scale-90"
                        >
                            <SpotifyIcon className="w-4 h-4 text-white" />
                        </a>
                        <a 
                            href={appleMusicUrl} 
                            target="_blank" 
                            rel="noopener" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex justify-center py-2 bg-black/40 hover:bg-[#FA243C] rounded-xl border border-white/10 transition-all active:scale-90"
                        >
                            <AppleMusicIcon className="w-4 h-4 text-white" />
                        </a>
                        <a 
                            href={youtubeUrl} 
                            target="_blank" 
                            rel="noopener" 
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex justify-center py-2 bg-black/40 hover:bg-[#FF0000] rounded-xl border border-white/10 transition-all active:scale-90"
                        >
                            <YoutubeMusicIcon className="w-4 h-4 text-white" />
                        </a>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1.02); }
                    50% { transform: scale(1.03); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default AlbumCard;