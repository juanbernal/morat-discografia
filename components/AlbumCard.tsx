import React from 'react';
import type { Album } from '../types';

interface AlbumCardProps {
    album: Album;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
    const imageUrl = album.images.length > 0 ? album.images[0].url : 'https://picsum.photos/300';
    const releaseYear = new Date(album.release_date).getFullYear();

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
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md">{album.name}</h3>
                <p className="text-xs text-gray-300 drop-shadow-sm">{releaseYear}</p>
            </div>
        </a>
    );
};

export default AlbumCard;