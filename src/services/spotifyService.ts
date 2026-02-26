
import type { Album, Artist, Track, SimplifiedTrack } from '../types';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("Spotify credentials missing in environment");
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

        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000);
        return accessToken;
    } catch (error) {
        console.error("Error getting Spotify access token:", error);
        return null;
    }
};

const fetchSpotify = async (url: string) => {
    const token = await getAccessToken();
    if (!token) return null;

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from Spotify (${url}):`, error);
        return null;
    }
};

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    return await fetchSpotify(`https://api.spotify.com/v1/artists/${artistId}`);
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    const data = await fetchSpotify(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`);
    return data?.tracks || [];
};

export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    let allAlbums: Album[] = [];
    let url = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&limit=50`;
    
    while (url) {
        const data = await fetchSpotify(url);
        if (!data) break;
        allAlbums = allAlbums.concat(data.items);
        url = data.next;
    }
    
    return allAlbums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
};

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    const data = await fetchSpotify(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`);
    return data?.items || [];
};
