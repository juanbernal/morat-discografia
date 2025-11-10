import type { SpotifyTokenResponse, AlbumsResponse, Album, Artist, TopTracksResponse, Track } from '../types';

const clientId = "0c2f09f03eb04ce5a64a8a01537f1b90";
const clientSecret = "bdab655343164873b6f472cfba7ddc45";

let accessToken: string | null = null;
let tokenExpiryTime: number = 0;

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
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch artist details: ${response.statusText}`);
    }

    return await response.json();
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
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
    return data.tracks;
};


export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
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

    return allAlbums;
};