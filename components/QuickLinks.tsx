
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface QuickLinksProps {
    albums: Album[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ albums }) => {
    if (!albums || albums.length === 0) return null;

    return (
        <section className="mb-12 animate-fade-in px-2">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>⚡ Acceso Rápido a Discografía</span>
            </h3>
            
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 md:gap-4">
                {albums.map((album) => {
                    const spotifyUrl = album.external_urls.spotify;
                    const youtubeUrl = album.external_urls.youtube;
                    // Prioritize Spotify, fallback to YouTube
                    const link = spotifyUrl || youtubeUrl || '#';
                    const isSpotify = !!spotifyUrl;

                    return (
                        <a
                            key={`quick-${album.id}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden shadow-lg border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:scale-110 hover:z-10 hover:shadow-blue-500/30"
                            title={`Escuchar ${album.name}`}
                        >
                            <img
                                src={album.images[0]?.url || 'https://picsum.photos/100'}
                                alt={album.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                loading="lazy"
                            />
                            
                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[1px]">
                                {isSpotify ? (
                                    <SpotifyIcon className="w-8 h-8 text-[#1DB954]" />
                                ) : (
                                    <YoutubeMusicIcon className="w-8 h-8 text-[#FF0000]" />
                                )}
                            </div>
                        </a>
                    );
                })}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center sm:text-left italic">
                Clic en la miniatura para ir directo a la plataforma.
            </p>
        </section>
    );
};

export default QuickLinks;
