import type { Album, Artist, Track, SimplifiedTrack } from '../types';
import juan614Data from './juan614.json';

export interface SpotifyStaticData {
    artist: Artist;
    topTracks: Track[];
    albums: Album[];
    albumTracks: Record<string, SimplifiedTrack[]>;
    lastUpdated: string;
}

export const STATIC_DATA: Record<string, SpotifyStaticData> = {
    "2mEoedcjDJ7x6SCVLMI4Do": {
        artist: {
            id: "2mEoedcjDJ7x6SCVLMI4Do",
            name: "Diosmasgym",
            external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
            images: [{ url: "https://i.scdn.co/image/ab67616d0000b27362a720028153e14b1ec91c48", height: 640, width: 640 }]
        },
        topTracks: [
            {
                id: "track_d1",
                name: "Hagamos Historia",
                album: {
                    id: "album_d1",
                    name: "Hagamos Historia",
                    images: [{ url: "https://i.scdn.co/image/ab67616d0000b27362a720028153e14b1ec91c48", height: 640, width: 640 }],
                    release_date: "2024-01-01",
                    total_tracks: 1,
                    external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
                    artists: [{ id: "2mEoedcjDJ7x6SCVLMI4Do", name: "Diosmasgym", external_urls: { spotify: "" } }],
                    album_type: "single",
                    source: "merged"
                },
                artists: [{ id: "2mEoedcjDJ7x6SCVLMI4Do", name: "Diosmasgym", external_urls: { spotify: "" } }],
                duration_ms: 180000,
                explicit: false,
                external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
                preview_url: "",
                source: "merged"
            }
        ],
        albums: [
            {
                id: "album_d1",
                name: "Hagamos Historia",
                images: [{ url: "https://i.scdn.co/image/ab67616d0000b27362a720028153e14b1ec91c48", height: 640, width: 640 }],
                release_date: "2024-01-01",
                total_tracks: 1,
                external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
                artists: [{ id: "2mEoedcjDJ7x6SCVLMI4Do", name: "Diosmasgym", external_urls: { spotify: "" } }],
                album_type: "single",
                source: "merged"
            }
        ],
        albumTracks: {},
        lastUpdated: new Date().toISOString()
    },
    "0vEKa5AOcBkQVXNfGb2FNh": juan614Data as unknown as SpotifyStaticData
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

    return null;
};
