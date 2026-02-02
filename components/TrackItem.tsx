import React from 'react';
import type { Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';
import LyricsIcon from './LyricsIcon';

interface TrackItemProps {
    track: Track;
    index: number;
    onSelect?: () => void;
    isPlaying: boolean;
}

const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
};

const PlayIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
        <path d="M8 5v14l11-7z"></path>
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
    </svg>
);

const SoundWaveIcon: React.FC = () => (
     <div className="flex items-end gap-[2px] h-3 w-4">
        <div className="w-[3px] bg-blue-500 animate-[wave_0.5s_ease-in-out_infinite_alternate]"></div>
        <div className="w-[3px] bg-blue-500 animate-[wave_0.7s_ease-in-out_infinite_alternate_0.2s]"></div>
        <div className="w-[3px] bg-blue-500 animate-[wave_0.6s_ease-in-out_infinite_alternate_0.4s]"></div>
        <style>{`
            @keyframes wave {
                from { height: 20%; }
                to { height: 100%; }
            }
        `}</style>
    </div>
)

const TrackItem: React.FC<TrackItemProps> = ({ track, index, onSelect, isPlaying }) => {
    const hasPreview = !!track.preview_url;
    const lyricsSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(track.artists.map(a => a.name).join(' ') + ' ' + track.name + ' lyrics')}`;
    const youtubeUrl = track.external_urls.youtube?.includes('/channel/') 
        ? `https://music.youtube.com/search?q=${encodeURIComponent(track.artists[0].name + " " + track.name)}`
        : (track.external_urls.youtube || `https://music.youtube.com/search?q=${encodeURIComponent(track.artists[0].name + " " + track.name)}`);
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(track.artists[0].name + " " + track.name)}`;
    const spotifyUrl = track.external_urls.spotify || `https://open.spotify.com/search/${encodeURIComponent(track.artists[0].name + " " + track.name)}`;

    return (
        <div
            onClick={() => onSelect?.()}
            className={`
                group flex items-center gap-3 md:gap-5 p-3 md:p-4 rounded-2xl transition-all duration-500
                ${hasPreview ? 'cursor-pointer hover:bg-white/10 active:scale-[0.98]' : 'cursor-default'}
                ${isPlaying ? 'bg-blue-500/20 border border-blue-500/40 shadow-xl' : 'bg-white/[0.02] border border-white/5'}
            `}
        >
            <div className="w-5 md:w-8 flex-shrink-0 text-center text-[10px] md:text-xs font-black text-white/30">
                {isPlaying ? <SoundWaveIcon /> : String(index + 1).padStart(2, '0')}
            </div>

            <div className="relative w-10 h-10 md:w-14 md:h-14 flex-shrink-0">
                <img
                    src={track.album.images?.[2]?.url || track.album.images?.[0]?.url || 'https://picsum.photos/100'}
                    alt={track.name}
                    className="w-full h-full object-cover rounded-xl shadow-lg border border-white/10"
                />
                {hasPreview && (
                    <div className={`absolute inset-0 bg-blue-600/40 rounded-xl flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}>
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className={`text-sm md:text-lg font-black truncate leading-tight tracking-tight ${isPlaying ? 'text-blue-400' : 'text-white'}`}>
                    {track.name}
                </p>
                <p className="text-[9px] md:text-[11px] text-white/30 font-black uppercase tracking-[0.2em] truncate mt-1">
                    {track.artists.map(a => a.name).join(', ')}
                </p>
            </div>

            {/* Plataformas de escucha */}
            <div className="flex items-center gap-1 md:gap-2 ml-auto">
                <a 
                    href={spotifyUrl} 
                    target="_blank" 
                    rel="noopener" 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 md:p-2.5 text-white/20 hover:text-[#1DB954] hover:bg-[#1DB954]/10 rounded-full transition-all active:scale-125" 
                    title="Spotify"
                >
                    <SpotifyIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
                <a 
                    href={appleMusicUrl} 
                    target="_blank" 
                    rel="noopener" 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 md:p-2.5 text-white/20 hover:text-[#FA243C] hover:bg-[#FA243C]/10 rounded-full transition-all active:scale-125" 
                    title="Apple Music"
                >
                    <AppleMusicIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
                <a 
                    href={youtubeUrl} 
                    target="_blank" 
                    rel="noopener" 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 md:p-2.5 text-white/20 hover:text-[#FF0000] hover:bg-[#FF0000]/10 rounded-full transition-all active:scale-125" 
                    title="YouTube Music"
                >
                    <YoutubeMusicIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
                <a 
                    href={lyricsSearchUrl} 
                    target="_blank" 
                    rel="noopener" 
                    onClick={(e) => e.stopPropagation()} 
                    className="p-2 md:p-2.5 text-white/20 hover:text-blue-400 hover:bg-blue-400/10 rounded-full transition-all active:scale-125" 
                    title="Letras"
                >
                    <LyricsIcon className="w-5 h-5 md:w-6 md:h-6"/>
                </a>
            </div>

            <div className="hidden lg:block w-12 text-right text-[11px] font-black text-white/20 ml-2">
                {track.duration_ms > 0 && formatDuration(track.duration_ms)}
            </div>
        </div>
    );
};

export default TrackItem;