import React from 'react';
import type { Track } from '../types';

interface TrackItemProps {
    track: Track;
    index: number;
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


const TrackItem: React.FC<TrackItemProps> = ({ track, index }) => {
    const imageUrl = track.album.images?.[2]?.url || track.album.images?.[0]?.url || 'https://picsum.photos/100';

    return (
        <a
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="group grid grid-cols-[auto,60px,1fr,auto] sm:grid-cols-[auto,60px,1fr,1fr,auto] items-center gap-4 p-2 rounded-lg transition-colors hover:bg-white/10"
        >
            <div className="w-6 text-right text-gray-400 font-medium">{index + 1}</div>
            <div className="relative w-12 h-12 flex-shrink-0">
                <img
                    src={imageUrl}
                    alt={track.album.name}
                    className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayIcon />
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{track.name}</p>
                <p className="text-gray-400 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
            </div>
            <div className="hidden sm:block text-gray-400 text-sm min-w-0 truncate">{track.album.name}</div>
            <div className="w-12 text-right text-gray-400 text-sm">{formatDuration(track.duration_ms)}</div>
        </a>
    );
};

export default TrackItem;