import React from 'react';
import type { Album } from '../types';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface AlbumCardProps {
    album: Album;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-1.28a1.5 1.5 0 00-1.897-1.703l-4.502 2.252a1.5 1.5 0 000 2.992l4.502 2.252a1.5 1.5 0 001.897-1.703l-.001-5.09z" clipRule="evenodd" />
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
            className="group relative block aspect-[4/5] overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/30 hover:scale-105 border-2 border-transparent hover:border-amber-400"
            aria-label={`Escuchar ${album.name} en Spotify`}
        >
            <img 
                src={imageUrl} 
                alt={album.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayIcon className="w-16 h-16 text-white/90 drop-shadow-lg" />
            </div>
            
            <div className="absolute top-2 right-2">
                 <span className="bg-black/50 text-white text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full backdrop-blur-sm">{getAlbumTypeLabel(album.album_type)}</span>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end text-white">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                    <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md">{album.name}</h3>
                    <p className="text-xs text-gray-300 drop-shadow-sm">{releaseYear}</p>
                </div>
                
                {album.external_urls.youtube && (
                    <a
                        href={album.external_urls.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gray-300 hover:text-white"
                        aria-label={`Ver ${album.name} en YouTube Music`}
                    >
                        <YoutubeMusicIcon className="w-6 h-6" />
                    </a>
                )}
            </div>
        </a>
    );
};

export default AlbumCard;