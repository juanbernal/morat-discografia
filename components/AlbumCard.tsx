import React from 'react';
import type { Album } from '../types';

interface AlbumCardProps {
    album: Album;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M8 5v14l11-7z"></path>
    </svg>
);

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
    const imageUrl = album.images.length > 0 ? album.images[0].url : 'https://picsum.photos/300';
    const releaseYear = new Date(album.release_date).getFullYear();

    const getAlbumTypeLabel = (type: Album['album_type']) => {
        switch (type) {
            case 'album':
                return 'Álbum';
            case 'single':
                return 'Sencillo';
            case 'compilation':
                return 'Recopilación';
            default:
                return '';
        }
    };

    return (
        <a
            href={album.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/30 hover:scale-105 border-2 border-transparent hover:border-amber-400"
        >
            <img 
                src={imageUrl} 
                alt={album.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-12 h-12 text-white drop-shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute top-2 right-2">
                 <span className="bg-black/50 text-white text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full backdrop-blur-sm">{getAlbumTypeLabel(album.album_type)}</span>
            </div>
            
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md transition-transform duration-300 translate-y-4 group-hover:translate-y-0">{album.name}</h3>
                <p className="text-xs text-gray-300 drop-shadow-sm transition-transform duration-300 translate-y-4 group-hover:translate-y-0 delay-75">{releaseYear}</p>
            </div>
        </a>
    );
};

export default AlbumCard;