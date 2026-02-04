
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface QuickLinksProps {
    albums: Album[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ albums }) => {
    if (!albums || albums.length === 0) return null;

    // Show more thumbnails for a rich visual catalog
    const featuredAlbums = albums.slice(0, 24);

    return (
        <section className="mb-16 md:mb-24 animate-fade-in px-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 md:mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-blue-600 rounded-full"></div>
                    <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                        Catálogo <span className="text-blue-500">Visual</span>
                    </h3>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Acceso Directo</span>
                    <div className="h-px w-12 bg-white/10"></div>
                </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-4 md:gap-5">
                {featuredAlbums.map((album) => {
                    const link = album.external_urls.spotify || album.external_urls.youtube || '#';
                    const isSpotify = !!album.external_urls.spotify;

                    return (
                        <a
                            key={`quick-${album.id}`}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:scale-110 hover:z-20 hover:shadow-[0_15px_40px_rgba(59,130,246,0.3)]"
                            title={`Escuchar ${album.name}`}
                        >
                            <img
                                src={album.images[0]?.url || 'https://picsum.photos/100'}
                                alt={album.name}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:rotate-2 group-hover:scale-110"
                                loading="lazy"
                            />
                            
                            {/* Inmersive Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                <div className="p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
                                    {isSpotify ? (
                                        <SpotifyIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#1DB954]" />
                                    ) : (
                                        <YoutubeMusicIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#FF0000]" />
                                    )}
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default QuickLinks;
