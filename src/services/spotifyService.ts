
import type { Album, Artist, Track, SimplifiedTrack } from '../types';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || (import.meta as any).env?.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || (import.meta as any).env?.VITE_SPOTIFY_CLIENT_SECRET;

let accessToken: string | null = null;
let tokenExpiry: number = 0;

const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpiry) {
        return accessToken;
    }

    console.log("Spotify: Attempting to get access token...");
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("Spotify: Credentials missing. Check SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in environment.");
        console.log("Spotify: process.env.SPOTIFY_CLIENT_ID is:", process.env.SPOTIFY_CLIENT_ID ? "Defined" : "Undefined");
        return null;
    }
    
    console.log(`Spotify: Using Client ID starting with: ${CLIENT_ID.substring(0, 4)}...`);

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Spotify: Token request failed (${response.status}):`, errorData);
            return null;
        }

        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000);
        console.log("Spotify: Access token obtained successfully.");
        return accessToken;
    } catch (error) {
        console.error("Spotify: Error getting access token (possibly CORS):", error);
        return null;
    }
};

const fetchSpotify = async (url: string) => {
    const token = await getAccessToken();
    if (!token) {
        console.error(`Spotify: No token available for request to ${url}`);
        return null;
    }

    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        
        if (response.status === 429) {
            console.warn("Spotify: Rate limit exceeded. Try again later.");
            return null;
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Spotify: API request failed (${response.status}) for ${url}. Error: ${errorText}`);
            return null;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`Spotify: Expected JSON response but got ${contentType} from ${url}`);
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error(`Spotify: Error fetching from ${url}:`, error);
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
