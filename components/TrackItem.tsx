
import React from 'react';
import type { Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
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
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
        <path d="M8 5v14l11-7z"></path>
    </svg>
);

const PauseIcon: React.FC = () => (
    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
    </svg>
);

const SoundWaveIcon: React.FC = () => (
     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="2" y1="8" x2="2" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="y1" values="8;4;8" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="16;20;16" dur="0.5s" repeatCount="indefinite" />
        </line>
        <line x1="7" y1="5" x2="7" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="y1" values="5;10;5" dur="0.7s" repeatCount="indefinite" />
            <animate attributeName="y2" values="19;14;19" dur="0.7s" repeatCount="indefinite" />
        </line>
        <line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="y1" values="2;8;2" dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="y2" values="22;16;22" dur="0.6s" repeatCount="indefinite" />
        </line>
         <line x1="17" y1="5" x2="17" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="y1" values="5;10;5" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="y2" values="19;14;19" dur="0.8s" repeatCount="indefinite" />
        </line>
         <line x1="22" y1="8" x2="22" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="y1" values="8;4;8" dur="0.5s" repeatCount="indefinite" />
            <animate attributeName="y2" values="16;20;16" dur="0.5s" repeatCount="indefinite" />
        </line>
    </svg>
)


const TrackItem: React.FC<TrackItemProps> = ({ track, index, onSelect, isPlaying }) => {
    const imageUrl = track.album.images?.[2]?.url || track.album.images?.[0]?.url || 'https://picsum.photos/100';
    const hasPreview = !!track.preview_url;
    const lyricsSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(track.artists.map(a => a.name).join(' ') + ' ' + track.name + ' lyrics')}`;

    // Determine YouTube Link: Use specific URL if available (and not just channel), otherwise search
    const isGenericChannelLink = track.external_urls.youtube && track.external_urls.youtube.includes('/channel/');
    const youtubeUrl = (track.external_urls.youtube && !isGenericChannelLink)
        ? track.external_urls.youtube 
        : `https://music.youtube.com/search?q=${encodeURIComponent(track.artists[0].name + " " + track.name)}`;


    const handleItemClick = () => {
        if (onSelect && hasPreview) {
            onSelect();
        }
    };

    return (
        <div
            onClick={handleItemClick}
            className={`
                group grid grid-cols-[auto,60px,1fr,auto,auto] sm:grid-cols-[auto,60px,1fr,1fr,auto,auto] items-center gap-4 p-2 rounded-lg transition-colors
                ${hasPreview ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}
                ${isPlaying ? 'bg-blue-500/20' : ''}
            `}
        >
            <div className="w-6 text-right text-gray-400 font-medium">
                {isPlaying ? <SoundWaveIcon /> : index + 1}
            </div>
            <div className="relative w-12 h-12 flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={track.album.name}
                    className="w-full h-full object-cover rounded"
                />
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${!hasPreview ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isPlaying ? 'text-blue-500' : 'text-white'}`}>{track.name}</p>
                <p className="text-gray-400 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <div className="hidden sm:block text-gray-400 text-sm min-w-0 truncate">{track.album.name}</div>
            <div className="w-12 text-right text-gray-400 text-sm">
                {track.duration_ms > 0 && formatDuration(track.duration_ms)}
            </div>
            <div className="flex items-center justify-end gap-1">
                 <a
                    href={lyricsSearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 transition-colors hover:text-blue-500"
                    aria-label="Buscar letras en Google"
                    title="Buscar letras en Google"
                >
                    <LyricsIcon className="w-5 h-5"/>
                </a>
                {track.external_urls.spotify && (
                    <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 transition-colors hover:text-[#1DB954]"
                        aria-label="Escuchar en Spotify"
                    >
                        <SpotifyIcon className="w-5 h-5"/>
                    </a>
                )}
                
                <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 transition-colors hover:text-[#FF0000]"
                    aria-label="Escuchar en YouTube Music"
                    title="Buscar en YouTube Music"
                >
                    <YoutubeMusicIcon className="w-5 h-5"/>
                </a>
                
            </div>
        </div>
    );
};

export default TrackItem;
