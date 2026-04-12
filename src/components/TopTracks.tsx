import React from 'react';
import { motion } from 'framer-motion';
import { Play, Share2, MoreHorizontal, TrendingUp } from 'lucide-react';
import type { Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface TopTracksProps {
    tracks: Track[];
    onTrackSelect: (track: Track) => void;
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks, onTrackSelect }) => {
    return (
        <div className="space-y-4">
            {tracks.map((track, index) => {
                const isJuan614 = track.artists.some(a => a.name.toLowerCase().includes('614'));
                const youtubeUrl = track.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(track.name + " " + track.artists.map(a => a.name).join(' '))}`;

                return (
                    <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative flex items-center gap-6 p-4 rounded-[1.5rem] hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5"
                    >
                        {/* Rank Number */}
                        <div className="w-12 flex-shrink-0 text-center">
                            <span className="text-3xl font-black text-white/10 group-hover:text-blue-500/40 transition-colors uppercase tracking-widest leading-none">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Thumbnail */}
                        <div 
                            className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer shadow-lg"
                            onClick={() => onTrackSelect(track)}
                        >
                            <img 
                                src={track.album?.images[0]?.url || '/track-placeholder.png'} 
                                alt={track.name} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play size={20} className="text-white fill-current" />
                            </div>
                        </div>

                        {/* Title & Artist */}
                        <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-black text-white uppercase tracking-tight truncate group-hover:text-blue-400 transition-colors">
                                {track.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest truncate max-w-[150px]">
                                    {track.artists.map(a => a.name).join(', ')}
                                </p>
                                {isJuan614 && (
                                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-widest">
                                        V.I.P
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Popularity / Trending */}
                        <div className="hidden md:flex flex-col items-end gap-2 w-32 flex-shrink-0 px-4">
                            <div className="flex gap-0.5 h-1 items-end">
                                {[...Array(8)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-1 rounded-full transition-all duration-700 ${i < (8 - index) ? (isJuan614 ? 'bg-amber-500' : 'bg-blue-500') : 'bg-white/10'}`}
                                        style={{ height: `${20 + (Math.random() * 80)}%` }}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <TrendingUp size={10} className={isJuan614 ? 'text-amber-500' : 'text-blue-500'} />
                                <span className="text-[8px] font-black uppercase tracking-widest">Hot Track</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="flex gap-3">
                                {track.external_urls.spotify && (
                                    <a 
                                        href={track.external_urls.spotify} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-white/20 hover:text-[#1DB954] transition-colors"
                                    >
                                        <SpotifyIcon className="w-4 h-4" />
                                    </a>
                                )}
                                <a 
                                    href={youtubeUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-white/20 hover:text-[#FF0000] transition-colors"
                                >
                                    <YoutubeMusicIcon className="w-4 h-4" />
                                </a>
                            </div>
                            <button className="text-white/10 hover:text-white transition-colors">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default TopTracks;