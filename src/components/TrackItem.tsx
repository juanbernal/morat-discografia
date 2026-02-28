
import React from 'react';
import type { Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';
import LyricsIcon from './LyricsIcon';

interface TrackItemProps {
    track: Track;
    index: number;
    isPlaying?: boolean;
    onSelect?: () => void;
    onShowLyrics?: (track: Track) => void;
}

const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
};

const TrackItem: React.FC<TrackItemProps> = ({ track, index, isPlaying, onSelect, onShowLyrics }) => {
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(track.artists[0].name + " " + track.name)}`;
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(track.artists[0].name + " " + track.name)}`;
    const spotifyUrl = track.external_urls.spotify || `https://open.spotify.com/search/${encodeURIComponent(track.artists[0].name + " " + track.name)}`;

    return (
        <div
            onClick={onSelect}
            className={`group flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-2xl transition-all duration-500 bg-white/[0.02] border border-white/5 hover:bg-white/10 ${onSelect ? 'cursor-pointer' : ''} ${isPlaying ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
        >
            <div className="w-5 md:w-8 flex-shrink-0 text-center text-[10px] md:text-xs font-black text-white/30">
                {isPlaying ? (
                    <span className="text-blue-500 animate-pulse">▶</span>
                ) : (
                    String(index + 1).padStart(2, '0')
                )}
            </div>

            <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
                <img
                    src={track.album.images?.[2]?.url || track.album.images?.[0]?.url || 'https://picsum.photos/100'}
                    alt={track.name}
                    className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10"
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-sm md:text-lg font-black truncate leading-tight tracking-tight transition-colors ${isPlaying ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
                    {track.name}
                </p>
                <p className="text-[9px] md:text-[11px] text-white/30 font-black uppercase tracking-[0.2em] truncate mt-1">
                    {track.artists.map(a => a.name).join(', ')}
                </p>
            </div>

            <div className="flex items-center gap-1 md:gap-2 ml-auto">
                {onShowLyrics && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onShowLyrics(track); }}
                        className="p-2 md:p-2.5 text-white/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-all"
                        title="Ver Letra"
                    >
                        <LyricsIcon className="w-5 h-5 md:w-6 md:h-6"/>
                    </button>
                )}
                <a onClick={(e) => e.stopPropagation()} href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 text-white/20 hover:text-[#1DB954] hover:bg-[#1DB954]/10 rounded-full transition-all" title="Spotify">
                    <SpotifyIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
                <a onClick={(e) => e.stopPropagation()} href={appleMusicUrl} target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 text-white/20 hover:text-[#FA243C] hover:bg-[#FA243C]/10 rounded-full transition-all" title="Apple Music">
                    <AppleMusicIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
                <a onClick={(e) => e.stopPropagation()} href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-2 md:p-2.5 text-white/20 hover:text-[#FF0000] hover:bg-[#FF0000]/10 rounded-full transition-all" title="YouTube Music">
                    <YoutubeMusicIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
            </div>

            <div className="hidden lg:block w-12 text-right text-[11px] font-black text-white/20 ml-2">
                {track.duration_ms > 0 && formatDuration(track.duration_ms)}
            </div>
        </div>
    );
};

export default TrackItem;
