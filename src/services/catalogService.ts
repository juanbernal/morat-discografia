import type { Track, Album } from '../types';
import { getImageUrlFromStaticData } from '../data/staticData';

const GOOGLE_SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_URL || 'https://docs.google.com/spreadsheets/d/18qFexU752mCbMKjYd0dQ3sd9nwW72yizVJtkDNPeRS8/export?format=csv&gid=0';

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
            const artistName = values[1]?.trim() || 'Diosmasgym';
            const primaryUrl = values[2]?.trim() || '';
            let coverImageUrl = values[3]?.trim() || '';
            const typeValue = values[4]?.trim().toLowerCase() || 'single';
            const albumType = (typeValue === 'album' || typeValue === 'single') ? typeValue : 'single';
            const releaseDate = values[5]?.trim() || "2024-01-01";

            if (name && primaryUrl) {
                const id = `sheet-${i}`;
                const artists = [
                    { 
                        id: artistName.toLowerCase().includes('juan 614') ? '0vEKa5AOcBkQVXNfGb2FNh' : '2mEoedcjDJ7x6SCVLMI4Do', 
                        name: artistName, 
                        external_urls: { spotify: primaryUrl.includes('spotify') ? primaryUrl : "" } 
                    }
                ];

                const isJuan614 = artistName.toLowerCase().includes('juan 614');

                if (!coverImageUrl) {
                    const matchedImage = getImageUrlFromStaticData(primaryUrl, isJuan614 ? '0vEKa5AOcBkQVXNfGb2FNh' : '2mEoedcjDJ7x6SCVLMI4Do');
                    if (matchedImage) coverImageUrl = matchedImage;
                }

                const album: Album = {
                    id: `album-${id}`,
                    name: name,
                    images: coverImageUrl ? [{ url: coverImageUrl, height: 640, width: 640 }] : [],
                    release_date: releaseDate,
                    total_tracks: 1,
                    external_urls: { 
                        spotify: primaryUrl.includes('spotify') ? primaryUrl : "",
                        youtube: (primaryUrl.includes('youtube') || primaryUrl.includes('youtu.be')) ? primaryUrl : ""
                    },
                    artists: artists,
                    album_type: albumType as 'album' | 'single',
                    source: 'merged'
                };

                tracks.push({
                    id: id,
                    name,
                    album,
                    artists: artists,
                    duration_ms: 180000, 
                    explicit: false,
                    external_urls: {
                        spotify: primaryUrl.includes('spotify') ? primaryUrl : "",
                        youtube: (primaryUrl.includes('youtube') || primaryUrl.includes('youtu.be')) ? primaryUrl : primaryUrl
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
