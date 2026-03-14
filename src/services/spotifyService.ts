import type { Album, Artist, Track, SimplifiedTrack } from '../types';

import { STATIC_DATA } from '../data/staticData';

import { getCatalogFromSheet } from './catalogService';

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    return STATIC_DATA[artistId]?.artist || null;
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    try {
        const catalog = await getCatalogFromSheet();
        const sheetTracks = catalog.filter(track => track.artists.some(a => a.id === artistId));
        const staticTracks = STATIC_DATA[artistId]?.topTracks || [];

        const combinedTracks = [...sheetTracks];
        for (const st of staticTracks) {
            if (!combinedTracks.some(ct => ct.id === st.id || ct.name.toLowerCase() === st.name.toLowerCase())) {
                combinedTracks.push(st);
            }
        }

        if (combinedTracks.length === 0) {
            return [];
        }

        // Try to get tracks with diverse images for a better Top Hits UI
        const distinctTracks: Track[] = [];
        const seenImages = new Set<string>();

        // First pass: try to get unique images
        for (const track of combinedTracks) {
            const imgUrl = track.album.images[0]?.url || '';
            if (!seenImages.has(imgUrl)) {
                seenImages.add(imgUrl);
                distinctTracks.push(track);
            }
            if (distinctTracks.length >= 5) break;
        }

        // If we don't have enough, just fill with whatever comes next
        if (distinctTracks.length < 5) {
            for (const track of combinedTracks) {
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
        const sheetTracks = catalog.filter(t => t.artists.some(a => a.id === artistId));
        const staticAlbums = STATIC_DATA[artistId]?.albums || [];

        const albumsMap = new Map<string, Album>();

        // First add all albums from Spotify (STATIC_DATA) since they are the most recent and ground-truth
        staticAlbums.forEach(a => {
            albumsMap.set(a.id, a);
        });

        // Then add sheet tracks if they aren't already represented in the Spotify albums by name
        sheetTracks.forEach(t => {
            if (t.album) {
                const existingAlbum = Array.from(albumsMap.values()).find(a =>
                    a.id === t.album.id || a.name.toLowerCase() === t.album.name.toLowerCase()
                );
                if (!existingAlbum) {
                    albumsMap.set(t.album.id, t.album);
                }
            }
        });

        if (albumsMap.size === 0) return [];

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
