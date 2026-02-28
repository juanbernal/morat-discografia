import type { Track, Album } from '../types';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/18qFexU752mCbMKjYd0dQ3sd9nwW72yizVJtkDNPeRS8/export?format=csv&gid=0';

export const getCatalogFromSheet = async (): Promise<Track[]> => {
    try {
        const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`);
        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);
        if (lines.length < 2) return [];

        const tracks: Track[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (!line.trim()) continue;

            const values = [];
            let currentField = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    if (inQuotes && line[j + 1] === '"') { currentField += '"'; j++; }
                    else inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(currentField);
                    currentField = '';
                } else currentField += char;
            }
            values.push(currentField);

            const id = values[0]?.trim() || `sheet-${i}`;
            const name = values[1]?.trim() || '';
            const spotifyLink = values[2]?.trim() || '';
            const youtubeLink = values[3]?.trim() || '';
            const appleLink = values[4]?.trim() || '';
            const coverImageUrl = values[5]?.trim() || '';

            if (name && spotifyLink) {
                // Determine artist (default to Diosmasgym)
                const artists = [
                    { id: '2mEoedcjDJ7x6SCVLMI4Do', name: 'Diosmasgym', external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" } }
                ];

                // If it mentions Juan 614, add as collaborator or main depending on sheet
                if (name.toLowerCase().includes('juan 614')) {
                    artists.push({ id: '0vEKa5AOcBkQVXNfGb2FNh', name: 'Juan 614', external_urls: { spotify: "https://open.spotify.com/artist/0vEKa5AOcBkQVXNfGb2FNh" } });
                }

                const album: Album = {
                    id: `album-${id}`,
                    name: name, // In this sheet, every track is a single
                    images: coverImageUrl ? [{ url: coverImageUrl, height: 640, width: 640 }] : [],
                    release_date: "2024-01-01",
                    total_tracks: 1,
                    external_urls: { spotify: spotifyLink },
                    artists: artists,
                    album_type: 'single',
                    source: 'merged'
                };

                tracks.push({
                    id: id,
                    name,
                    album,
                    artists: artists,
                    duration_ms: 180000, // Dummy length
                    explicit: false,
                    external_urls: {
                        spotify: spotifyLink,
                        youtube: youtubeLink
                    },
                    preview_url: "",
                    source: 'merged'
                });
            }
        }
        return tracks;
    } catch (error) {
        console.error("Error fetching catalog from sheet:", error);
        return [];
    }
};
