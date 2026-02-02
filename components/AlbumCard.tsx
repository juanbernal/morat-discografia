
import React from 'react';
import type { Album } from '../types';

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

    return (
        <div className={`group relative w-full transition-all duration-500 ${isNewest ? 'scale-[1.02]' : ''}`}>
            <div 
                className={`
                    relative aspect-square w-full overflow-hidden rounded-[1.2rem] md:rounded-[2rem] bg-slate-900 border cursor-pointer transition-all duration-700
                    ${isNewest 
                        ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
                        : 'border-white/10 shadow-xl group-hover:border-white/30'}
                `}
                onClick={() => onSelect(album)}
            >
                {/* Imagen de fondo */}
                <img 
                    src={imageUrl} 
                    alt={album.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    loading="lazy"
                />

                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80"></div>
                
                {/* Badge de Nuevo */}
                {isNewest && (
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                        <span className="bg-blue-600 text-white text-[7px] md:text-[9px] font-black px-2 py-0.5 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest border border-white/20 shadow-xl">
                            NUEVO
                        </span>
                    </div>
                )}

                {/* Contenido Frontal */}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 transition-all duration-500">
                    <span className="text-[7px] md:text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-1 block">
                        {releaseYear}
                    </span>
                    <h3 className="font-black text-[10px] md:text-xl text-white leading-tight tracking-tight drop-shadow-xl line-clamp-2">
                        {album.name}
                    </h3>
                </div>

                {/* Play Icon central hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 hidden md:flex">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl border border-white/20 group-hover:rotate-[360deg] duration-700">
                        <PlayIcon className="w-5 h-5 md:w-7 md:h-7 text-white ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
