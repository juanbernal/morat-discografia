import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || process.env.VITE_SPOTIFY_CLIENT_SECRET;

const ARTISTS = [
    { id: "2mEoedcjDJ7x6SCVLMI4Do", name: "Diosmasgym", filename: "diosmasgym.json" },
    { id: "0vEKa5AOcBkQVXNfGb2FNh", name: "Juan 614", filename: "juan614.json" }
];

async function getAccessToken() {
    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.warn("Spotify credentials missing. Skipping fetch.");
        return null;
    }

    try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString('base64'),
            },
            body: "grant_type=client_credentials",
        });

        if (!response.ok) throw new Error("Failed to get Spotify access token");

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error fetching Spotify access token:", error);
        return null;
    }
}

async function fetchSpotify(endpoint, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return null;
    }
}

const FALLBACK_DATA = (artistId, artistName) => ({
    artist: {
        id: artistId,
        name: artistName,
        external_urls: { spotify: `https://open.spotify.com/artist/${artistId}` },
        images: [{ url: "https://i.scdn.co/image/ab67616d0000b27362a720028153e14b1ec91c48", height: 640, width: 640 }]
    },
    topTracks: [],
    albums: [],
    albumTracks: {},
    lastUpdated: new Date().toISOString()
});

async function run() {
    const token = await getAccessToken();

    for (const artistInfo of ARTISTS) {
        const DATA_FILE = path.join(__dirname, `../src/data/${artistInfo.filename}`);
        const dir = path.dirname(DATA_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        if (!token) {
            if (!fs.existsSync(DATA_FILE)) {
                console.log(`Creating local mock fallback data for ${artistInfo.name} since credentials are missing.`);
                fs.writeFileSync(DATA_FILE, JSON.stringify(FALLBACK_DATA(artistInfo.id, artistInfo.name), null, 2));
            }
            continue;
        }

        console.log(`Fetching ${artistInfo.name} full catalog from Spotify...`);

        // Fetch Artist Details
        const artist = await fetchSpotify(`artists/${artistInfo.id}`, token);

        // Fetch Albums
        const albumsData = await fetchSpotify(`artists/${artistInfo.id}/albums?include_groups=album,single&limit=50`, token);
        const albums = albumsData?.items || [];

        // Fetch Top Tracks
        const topTracksData = await fetchSpotify(`artists/${artistInfo.id}/top-tracks?market=US`, token);
        const topTracks = topTracksData?.tracks || [];

        // Fetch Tracks for all Albums
        const albumTracks = {};
        for (const album of albums) {
            const tracksData = await fetchSpotify(`albums/${album.id}/tracks?limit=50`, token);
            if (tracksData && tracksData.items) {
                albumTracks[album.id] = tracksData.items;
            }
        }

        const compiledData = {
            artist,
            albums,
            topTracks,
            albumTracks,
            lastUpdated: new Date().toISOString()
        };

        fs.writeFileSync(DATA_FILE, JSON.stringify(compiledData, null, 2));
        console.log(`Successfully saved ${albums.length} albums for ${artistInfo.name} to ${DATA_FILE}`);
    }
}

run();
