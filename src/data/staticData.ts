import type { Album, Artist, Track, SimplifiedTrack } from '../types';
import diosmasgymData from './diosmasgym.json';

export interface SpotifyStaticData {
    artist: Artist;
    topTracks: Track[];
    albums: Album[];
    albumTracks: Record<string, SimplifiedTrack[]>;
    lastUpdated: string;
}

export const STATIC_DATA: Record<string, SpotifyStaticData> = {
    "2mEoedcjDJ7x6SCVLMI4Do": diosmasgymData as unknown as SpotifyStaticData
};

export const getImageUrlFromStaticData = (spotifyUrl: string, artistId: string): string | null => {
    if (!spotifyUrl) return null;
    const staticData = STATIC_DATA[artistId];
    if (!staticData) return null;

    // Search in topTracks
    const track = staticData.topTracks?.find(t => t.external_urls?.spotify === spotifyUrl);
    if (track && track.album?.images?.[0]?.url) {
        return track.album.images[0].url;
    }

    // Search in albums directly if it's an album URL (less likely for tracks but good to have)
    const album = staticData.albums?.find(a => a.external_urls?.spotify === spotifyUrl);
    if (album && album.images?.[0]?.url) {
        return album.images[0].url;
    }

    // Fallback to artist's profile image
    if (staticData.artist?.images?.[0]?.url) {
        return staticData.artist.images[0].url;
    }

    return null;
};
