import React from 'react';
import type { Album } from '../types';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import SpotifyIcon from './SpotifyIcon';

interface AlbumCardProps {
    album: Album;
}

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
        <div
            className="group relative block aspect-square overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/30 hover:scale-105 border-2 border-transparent hover:border-amber-400"
        >
            <img 
                src={imageUrl} 
                alt={album.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {album.external_urls.spotify && (
                    <a
                        href={album.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-[#1DB954] transition-colors duration-300 transform hover:scale-110"
                        aria-label="Escuchar en Spotify"
                    >
                        <SpotifyIcon className="w-12 h-12 drop-shadow-lg" />
                    </a>
                )}
                 {album.external_urls.youtube && (
                    <a
                        href={album.external_urls.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-[#FF0000] transition-colors duration-300 transform hover:scale-110"
                        aria-label="Escuchar en YouTube Music"
                    >
                        <YoutubeMusicIcon className="w-12 h-12 drop-shadow-lg" />
                    </a>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute top-2 right-2">
                 <span className="bg-black/50 text-white text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full backdrop-blur-sm">{getAlbumTypeLabel(album.album_type)}</span>
            </div>
            
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md transition-transform duration-300 translate-y-4 group-hover:translate-y-0">{album.name}</h3>
                <p className="text-xs text-gray-300 drop-shadow-sm transition-transform duration-300 translate-y-4 group-hover:translate-y-0 delay-75">{releaseYear}</p>
            </div>
        </div>
    );
};

export default AlbumCard;
