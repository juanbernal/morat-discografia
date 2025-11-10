import React from 'react';
import type { Track } from '../types';
import TrackItem from './TrackItem';

interface TopTracksProps {
    tracks: Track[];
}

const TopTracks: React.FC<TopTracksProps> = ({ tracks }) => {
    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 px-2">Éxitos de la Semana</h2>
            <div className="flex flex-col gap-2">
                {tracks.map((track, index) => (
                    <TrackItem key={track.id} track={track} index={index} />
                ))}
            </div>
        </section>
    );
};

export default TopTracks;