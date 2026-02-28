
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

            const name = values[0]?.trim() || '';
            const releaseDate = values[1]?.trim() || '';
            const coverImageUrl = values[2]?.trim() || '';
            const manualPreSaveLink = values[3]?.trim() || '';
            const audioUrl = values[4]?.trim() || ''; 
            const artistName = values[5]?.trim() || 'Diosmasgym'; 

            // Si tiene audioUrl, lo consideramos una canción para el catálogo
            if (name && audioUrl) {
                const album: Album = {
                    id: `sheet-${i}`,
                    name: 'Sencillo',
                    images: [{ url: coverImageUrl, height: 300, width: 300 }],
                    release_date: releaseDate,
                    total_tracks: 1,
                    external_urls: { spotify: manualPreSaveLink },
                    artists: [{ id: 'sheet-artist', name: artistName, external_urls: { spotify: '' } }],
                    album_type: 'single',
                    source: 'merged'
                };

                tracks.push({
                    id: `track-sheet-${i}`,
                    name,
                    album,
                    artists: album.artists,
                    duration_ms: 0,
                    explicit: false,
                    external_urls: {
                        spotify: manualPreSaveLink,
                        youtube: audioUrl
                    },
                    preview_url: audioUrl,
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
