import React from 'react';
import type { Track } from '../types';
import TrackItem from './TrackItem';

interface TopTracksProps {
    tracks: Track[];
    onTrackSelect: (track: Track) => void;
    playingTrackId?: string | null;
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks, onTrackSelect, playingTrackId }) => {
    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 px-2">Éxitos Populares</h2>
            <div className="flex flex-col gap-2">
                {tracks.map((track, index) => (
                    <TrackItem 
                        key={track.id} 
                        track={track} 
                        index={index}
                        onSelect={() => onTrackSelect(track)}
                        isPlaying={playingTrackId === track.id}
                    />
                ))}
            </div>
        </section>
    );
};

export default TopTracks;