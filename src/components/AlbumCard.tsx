import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music, ExternalLink, Calendar, List } from 'lucide-react';
import type { Album, Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface AlbumCardProps {
    album: Album;
    onSelect: (album: Album) => void;
    onTrackSelect: (track: Track) => void;
    isNewest?: boolean;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onSelect, onTrackSelect, isNewest }) => {
    const artistNames = album.artists.map(a => a.name).join(', ');
    const isJuan614 = artistNames.toLowerCase().includes('614');
    const spotifyUrl = album.external_urls.spotify;
    const youtubeUrl = album.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + artistNames)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative h-full flex flex-col"
        >
            {/* Glow effect on hover */}
            <div className={`absolute -inset-0.5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${isJuan614 ? 'bg-amber-500' : 'bg-blue-600'}`} />
            
            <div 
                className="relative flex flex-col h-full glass rounded-[2rem] p-4 border border-white/5 transition-all duration-500 hover:border-white/10 shadow-2xl overflow-hidden"
                onClick={() => onSelect(album)}
                onKeyDown={(e) => e.key === 'Enter' && onSelect(album)}
                tabIndex={0}
                role="button"
                aria-label={`Ver detalles del álbum ${album.name} por ${artistNames}`}
            >
                {/* Image Section */}
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-5">
                    <img 
                        src={album.images[0]?.url || '/album-placeholder.png'} 
                        alt={album.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Hover Platform Overlay */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-4">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTrackSelect({
                                    id: album.id,
                                    name: album.name,
                                    album,
                                    artists: album.artists,
                                    duration_ms: 0,
                                    explicit: false,
                                    external_urls: { youtube: youtubeUrl },
                                    preview_url: '',
                                    source: 'youtube',
                                });
                            }}
                            className={`${isJuan614 ? 'bg-amber-500' : 'bg-blue-600'} p-4 rounded-full shadow-2xl cursor-pointer`}
                        >
                            <Play className="text-white w-6 h-6 fill-current" />
                        </motion.div>
                        
                        <div className="flex gap-3">
                            {spotifyUrl && (
                                <motion.a
                                    href={spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.2 }}
                                    className="p-3 glass rounded-full hover:text-[#1DB954]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <SpotifyIcon className="w-5 h-5" />
                                </motion.a>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.2 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onTrackSelect({
                                        id: album.id,
                                        name: album.name,
                                        album,
                                        artists: album.artists,
                                        duration_ms: 0,
                                        explicit: false,
                                        external_urls: { youtube: youtubeUrl },
                                        preview_url: '',
                                        source: 'youtube',
                                    });
                                }}
                                className="p-3 glass rounded-full hover:text-[#FF0000]"
                            >
                                <YoutubeMusicIcon className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </div>

                    {/* Badge */}
                    {isNewest && (
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-white shadow-lg flex items-center gap-1.5 border border-white/10">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Latest
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-grow space-y-1">
                    <h3 className="line-clamp-1 font-black text-[13px] uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                        {album.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${isJuan614 ? 'text-amber-500/60' : 'text-blue-500/60'}`}>
                            {isJuan614 ? 'Juan 614' : 'Diosmasgym'}
                        </p>
                        <div className="flex items-center gap-1 opacity-20">
                            <Calendar size={10} />
                            <span className="text-[8px] font-black">{new Date(album.release_date).getFullYear()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Platforms (Mobile/Always visible fallback) */}
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between lg:hidden md:hidden">
                    <div className="flex gap-2">
                        <SpotifyIcon className="w-3.5 h-3.5 opacity-30" />
                        <YoutubeMusicIcon className="w-3.5 h-3.5 opacity-30" />
                    </div>
                    <List size={12} className="opacity-20" />
                </div>
            </div>
        </motion.div>
    );
};

export default AlbumCard;
