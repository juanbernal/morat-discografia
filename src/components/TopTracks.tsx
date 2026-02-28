import React from 'react';
import type { Track } from '../types';
import TrackItem from './TrackItem';

interface TopTracksProps {
    tracks: Track[];
    onTrackSelect?: (track: Track) => void;
    playingTrackId?: string | null;
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks, onTrackSelect, playingTrackId }) => {
    return (
        <div className="flex flex-col gap-2">
            {tracks.map((track, index) => (
                <TrackItem 
                    key={track.id} 
                    track={track} 
                    index={index}
                    onSelect={onTrackSelect ? () => onTrackSelect(track) : undefined}
                    isPlaying={playingTrackId === track.id}
                />
            ))}
        </div>
    );
};

export default TopTracks;