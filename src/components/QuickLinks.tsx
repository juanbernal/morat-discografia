
import React from 'react';
import type { Album } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface QuickLinksProps {
    albums: Album[];
}

const QuickLinks: React.FC<QuickLinksProps> = ({ albums }) => {
    if (!albums || albums.length === 0) return null;

    // Solo mostramos los 8 álbumes más recomendados (por fecha de lanzamiento)
    const recommendedAlbums = [...albums]
        .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
        .slice(0, 8);

    return (
        <section className="mb-24 animate-fade-in px-1">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Selección <span className="text-blue-500">Recomendada</span>
                        </h3>
                        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-1">
                            Acceso directo a los mejores lanzamientos
                        </p>
                    </div>
                </div>
                <div className="hidden md:block">
                   <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Escucha en tu plataforma favorita</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {recommendedAlbums.map((album) => {
                    const spotifyUrl = album.external_urls.spotify;
                    const youtubeUrl = album.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " Diosmasgym")}`;
                    const finalLink = spotifyUrl || youtubeUrl;
                    const isSpotify = !!spotifyUrl;

                    return (
                        <a
                            key={`quick-${album.id}`}
                            href={finalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 transition-all duration-500 hover:scale-110 hover:z-20 hover:shadow-[0_20px_50px_rgba(59,130,246,0.4)]"
                            title={`Escuchar ${album.name}`}
                        >
                            {/* Cover */}
                            <img
                                src={album.images[0]?.url || 'https://picsum.photos/400'}
                                alt={album.name}
                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                loading="lazy"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                            
                            {/* Platform Icon on Hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-2xl mb-2">
                                    {isSpotify ? (
                                        <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
                                    ) : (
                                        <YoutubeMusicIcon className="w-6 h-6 text-[#FF0000]" />
                                    )}
                                </div>
                                <span className="text-[7px] font-black text-white uppercase tracking-widest bg-blue-600/80 px-2 py-1 rounded-full backdrop-blur-sm">
                                    IR AHORA
                                </span>
                            </div>

                            {/* Album Label (Always visible but subtle) */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <p className="text-[9px] font-black text-white truncate drop-shadow-md uppercase tracking-wider group-hover:opacity-0 transition-opacity">
                                    {album.name}
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </section>
    );
};

export default QuickLinks;
