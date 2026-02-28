
import type { Album, Artist, Track, SimplifiedTrack } from '../types';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async (): Promise<string | null> => {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("Spotify credentials missing in environment variables.");
        return null;
    }

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) throw new Error("Failed to get Spotify access token");
        
        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer
        return accessToken;
    } catch (error) {
        console.error("Error fetching Spotify access token:", error);
        return null;
    }
};

const fetchSpotify = async <T>(endpoint: string): Promise<T | null> => {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) {
            if (response.status === 401) {
                accessToken = null; // Force token refresh on next call
            }
            throw new Error(`Spotify API error: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error fetching from Spotify endpoint ${endpoint}:`, error);
        return null;
    }
};

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    return fetchSpotify<Artist>(`artists/${artistId}`);
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    try {
        const data = await fetchSpotify<{ tracks: Track[] }>(`artists/${artistId}/top-tracks?market=US`);
        let tracks = data?.tracks || [];
        
        // Fallback: if no top tracks, fetch tracks from the most recent album
        if (tracks.length === 0) {
            console.log(`No top tracks for ${artistId}, fetching from recent albums...`);
            const albums = await getArtistAlbums(artistId);
            if (albums.length > 0) {
                const recentAlbum = albums[0];
                const albumTracks = await getAlbumTracks(recentAlbum.id);
                tracks = albumTracks.map(st => ({
                    ...st,
                    album: recentAlbum,
                    source: 'spotify' as const
                }));
            }
        }
        
        return tracks;
    } catch (error) {
        console.error(`Error in getArtistTopTracks for ${artistId}:`, error);
        return [];
    }
};

export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    let allAlbums: Album[] = [];
    let url = `artists/${artistId}/albums?include_groups=album,single&limit=50`;
    
    try {
        const data = await fetchSpotify<{ items: Album[], next: string | null }>(url);
        if (data) {
            allAlbums = data.items.map(album => ({
                ...album,
                source: 'spotify' as const
            }));
        }
    } catch (error) {
        console.error("Error fetching artist albums:", error);
    }
    
    return allAlbums;
};

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    const data = await fetchSpotify<{ items: SimplifiedTrack[] }>(`albums/${albumId}/tracks?limit=50`);
    return data?.items || [];
};
