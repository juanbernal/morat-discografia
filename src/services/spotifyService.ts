import type { Album, Artist, Track, SimplifiedTrack } from '../types';
import juan614Data from '../data/juan614.json';

import { STATIC_DATA } from '../data/staticData';

import { getCatalogFromSheet } from './catalogService';

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    return STATIC_DATA[artistId]?.artist || null;
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    try {
        const catalog = await getCatalogFromSheet();
        const artistTracks = catalog.filter(track => track.artists.some(a => a.id === artistId));

        if (artistTracks.length === 0) {
            return STATIC_DATA[artistId]?.topTracks || [];
        }

        // Try to get tracks with diverse images for a better Top Hits UI
        const distinctTracks: Track[] = [];
        const seenImages = new Set<string>();

        // First pass: try to get unique images
        for (const track of artistTracks) {
            const imgUrl = track.album.images[0]?.url || '';
            if (!seenImages.has(imgUrl)) {
                seenImages.add(imgUrl);
                distinctTracks.push(track);
            }
            if (distinctTracks.length >= 5) break;
        }

        // If we don't have enough, just fill with whatever comes next
        if (distinctTracks.length < 5) {
            for (const track of artistTracks) {
                if (!distinctTracks.includes(track)) {
                    distinctTracks.push(track);
                }
                if (distinctTracks.length >= 5) break;
            }
        }

        return distinctTracks;
    } catch {
        return STATIC_DATA[artistId]?.topTracks || [];
    }
};

export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    try {
        const catalog = await getCatalogFromSheet();
        const artistTracks = catalog.filter(t => t.artists.some(a => a.id === artistId));

        if (artistTracks.length === 0) {
            return STATIC_DATA[artistId]?.albums || [];
        }

        const albumsMap = new Map<string, Album>();
        artistTracks.forEach(t => {
            if (t.album && !albumsMap.has(t.album.id)) {
                albumsMap.set(t.album.id, t.album);
            }
        });
        return Array.from(albumsMap.values());
    } catch {
        return STATIC_DATA[artistId]?.albums || [];
    }
};

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    try {
        const catalog = await getCatalogFromSheet();
        const tracks = catalog.filter(t => t.album.id === albumId);

        if (tracks.length === 0) {
            for (const data of Object.values(STATIC_DATA)) {
                if (data.albumTracks[albumId]) return data.albumTracks[albumId];
            }
            return [];
        }

        return tracks.map(t => ({
            id: t.id,
            name: t.name,
            duration_ms: t.duration_ms,
            explicit: t.explicit,
            artists: t.artists,
            preview_url: t.preview_url,
            external_urls: { spotify: t.external_urls.spotify || "" },
            track_number: 1
        }));
    } catch {
        for (const data of Object.values(STATIC_DATA)) {
            if (data.albumTracks[albumId]) return data.albumTracks[albumId];
        }
        return [];
    }
};
