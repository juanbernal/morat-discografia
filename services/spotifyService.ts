
import type { SpotifyTokenResponse, AlbumsResponse, Album, Artist, TopTracksResponse, Track, SimplifiedTrack } from '../types';

const clientId = "0c2f09f03eb04ce5a64a8a01537f1b90";
const clientSecret = "bdab655343164873b6f472cfba7ddc45";

let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

// --- Caching Logic ---
const getCache = <T>(key: string): T | null => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data as T;
    } catch (e) {
        console.error("Error al leer de la caché", e);
        return null;
    }
};

const setCache = (key: string, data: any, ttl: number) => {
    const expiry = Date.now() + ttl;
    const item = { data, expiry };
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        console.warn(`Error al escribir en la caché para la clave "${key}".`, e);
    }
};

const ONE_HOUR = 60 * 60 * 1000;
const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;


const getAccessToken = async (): Promise<string> => {
    if (accessToken && Date.now() < tokenExpiryTime) {
        return accessToken;
    }

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
    });

    if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data: SpotifyTokenResponse = await response.json();
    accessToken = data.access_token;
    tokenExpiryTime = Date.now() + (data.expires_in - 300) * 1000; // Refresh 5 minutes before expiry
    return accessToken;
};

export const getArtistDetails = async (artistId: string): Promise<Artist> => {
    const cacheKey = `spotify_artist_details_${artistId}`;
    const cached = getCache<Artist>(cacheKey);
    if (cached) return cached;
    
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch artist details: ${response.statusText}`);
    }

    const data =  await response.json();
    try {
        const cleanData = JSON.parse(JSON.stringify(data));
        setCache(cacheKey, cleanData, TWENTY_FOUR_HOURS);
    } catch(e) {
        console.warn(`No se pudo guardar en caché los datos para ${cacheKey} debido a una referencia circular.`);
    }
    return data;
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    const cacheKey = `spotify_top_tracks_${artistId}`;
    const cached = getCache<Track[]>(cacheKey);
    if (cached) return cached;
    
    const token = await getAccessToken();
    // A market country code is required for this endpoint.
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
    }

    const data: TopTracksResponse = await response.json();
    const tracks = data.tracks.slice(0, 5);
    try {
        const cleanTracks = JSON.parse(JSON.stringify(tracks));
        setCache(cacheKey, cleanTracks, ONE_HOUR);
    } catch(e) {
        console.warn(`No se pudo guardar en caché los datos para ${cacheKey} debido a una referencia circular.`);
    }
    return tracks;
};


export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    const cacheKey = `spotify_artist_albums_${artistId}`;
    const cached = getCache<Album[]>(cacheKey);
    if (cached) return cached;

    const token = await getAccessToken();
    let allAlbums: Album[] = [];
    let url: string | null = `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single,compilation&limit=50`;

    while (url) {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch albums: ${response.statusText}`);
        }

        const data: AlbumsResponse = await response.json();
        allAlbums = allAlbums.concat(data.items);
        url = data.next;
    }
    
    try {
        const cleanAlbums = JSON.parse(JSON.stringify(allAlbums));
        setCache(cacheKey, cleanAlbums, TWENTY_FOUR_HOURS);
    } catch(e) {
        console.warn(`No se pudo guardar en caché los datos para ${cacheKey} debido a una referencia circular.`);
    }
    return allAlbums;
};

interface AlbumTracksResponse {
    items: SimplifiedTrack[];
    next: string | null;
}

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    const cacheKey = `spotify_album_tracks_${albumId}`;
    const cached = getCache<SimplifiedTrack[]>(cacheKey);
    if (cached) return cached;

    const token = await getAccessToken();
    let allTracks: SimplifiedTrack[] = [];
    let url: string | null = `https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`;

    while (url) {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch album tracks: ${response.statusText}`);
        }

        const data: AlbumTracksResponse = await response.json();
        allTracks = allTracks.concat(data.items);
        url = data.next;
    }
    
     try {
        const cleanTracks = JSON.parse(JSON.stringify(allTracks));
        setCache(cacheKey, cleanTracks, TWENTY_FOUR_HOURS);
    } catch(e) {
        console.warn(`No se pudo guardar en caché los datos para ${cacheKey} debido a una referencia circular.`);
    }
    return allTracks;
};
