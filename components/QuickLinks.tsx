
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface QuickLinksProps {
    albums: Album[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ albums }) => {
    if (!albums || albums.length === 0) return null;

    // Ordenar por fecha para que las miniaturas tengan sentido cronológico
    const sortedAlbums = [...albums].sort((a, b) => 
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    );

    return (
        <section className="mb-20 animate-fade-in px-1">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
                    Discografía <span className="text-blue-500">Rápida</span>
                </h3>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 md:gap-4">
                {sortedAlbums.map((album) => {
                    const spotifyUrl = album.external_urls.spotify;
                    const youtubeUrl = album.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " Diosmasgym")}`;
                    const finalLink = spotifyUrl || youtubeUrl;

                    return (
                        <a
                            key={`thumb-${album.id}`}
                            href={finalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-lg md:rounded-2xl overflow-hidden bg-slate-900 border border-white/5 hover:border-blue-500/50 transition-all duration-500 hover:scale-110 hover:z-30 hover:shadow-[0_15px_35px_rgba(59,130,246,0.3)]"
                            title={album.name}
                        >
                            <img
                                src={album.images[0]?.url || 'https://picsum.photos/300'}
                                alt={album.name}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-50"
                                loading="lazy"
                            />
                            
                            {/* Icono de Plataforma al Hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100">
                                {spotifyUrl ? (
                                    <SpotifyIcon className="w-6 h-6 text-[#1DB954] drop-shadow-lg" />
                                ) : (
                                    <YoutubeMusicIcon className="w-6 h-6 text-[#FF0000] drop-shadow-lg" />
                                )}
                            </div>
                            
                            {/* Tooltip con nombre solo en hover */}
                            <div className="absolute inset-x-0 bottom-0 p-1 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[7px] font-black text-center truncate text-white uppercase">{album.name}</p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default QuickLinks;
