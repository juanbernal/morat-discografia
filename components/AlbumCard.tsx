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
            aria-label={album.name}
        >
            <img 
                src={imageUrl} 
                alt={album.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute top-2 right-2">
                 <span className="bg-black/50 text-white text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full backdrop-blur-sm">{getAlbumTypeLabel(album.album_type)}</span>
            </div>
            
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-white">
                <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                    <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md">{album.name}</h3>
                    <p className="text-xs text-gray-300 drop-shadow-sm">{releaseYear}</p>
                </div>

                <div className="mt-2 flex items-center gap-2 opacity-0 transform transition-all duration-300 delay-100 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                    {album.external_urls.spotify && (
                        <a
                            href={album.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:bg-white/20 backdrop-blur-sm"
                            aria-label={`Escuchar ${album.name} en Spotify`}
                        >
                            <SpotifyIcon className="w-4 h-4 text-[#1DB954]" />
                            Spotify
                        </a>
                    )}
                    {album.external_urls.youtube && (
                        <a
                            href={album.external_urls.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full transition-colors hover:bg-white/20 backdrop-blur-sm"
                            aria-label={`Escuchar ${album.name} en YouTube Music`}
                        >
                            <YoutubeMusicIcon className="w-4 h-4 text-[#FF0000]" />
                            YouTube
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;