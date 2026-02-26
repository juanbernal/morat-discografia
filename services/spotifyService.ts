
import type { Album, Artist, Track, SimplifiedTrack } from '../types';

interface SpotifyStaticData {
    artist: Artist;
    topTracks: Track[];
    albums: Album[];
    albumTracks: Record<string, SimplifiedTrack[]>;
    lastUpdated: string;
}

let cachedData: SpotifyStaticData | null = null;

const fetchStaticData = async (): Promise<SpotifyStaticData | null> => {
    if (cachedData) return cachedData;
    try {
        const response = await fetch(`spotify_data.json?t=${Date.now()}`);
        if (!response.ok) throw new Error("Static data not found");
        cachedData = await response.json();
        return cachedData;
    } catch (error) {
        console.warn("Could not load spotify_data.json. Using empty fallback.", error);
        return null;
    }
};

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    const data = await fetchStaticData();
    if (data && data.artist.id === artistId) return data.artist;
    
    // Fallback if ID doesn't match or data not found
    return null;
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    const data = await fetchStaticData();
    if (data && data.artist.id === artistId) return data.topTracks;
    return [];
};

export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    const data = await fetchStaticData();
    if (!data) return [];
    
    // Filter albums by artist ID if needed, though they are already combined in the JSON
    return data.albums.filter(a => a.artists.some(art => art.id === artistId));
};

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    const data = await fetchStaticData();
    if (data && data.albumTracks && data.albumTracks[albumId]) {
        return data.albumTracks[albumId];
    }
    return [];
};
