import type { UpcomingRelease } from '../types';

// New Google Sheet export URL (CSV)
const UPCOMING_RELEASES_CSV_URL = 'https://docs.google.com/spreadsheets/d/1fiQV83kyFLXLJvKYkVAm-Enlre-INgIRPc90Igb4E7E/export?format=csv&gid=0';

export const getUpcomingReleases = async (): Promise<UpcomingRelease[]> => {
    try {
        const response = await fetch(`${UPCOMING_RELEASES_CSV_URL}&t=${Date.now()}`);
        if (!response.ok) {
            console.warn("Could not fetch Google Sheet, it might be private or unavailable.");
            return [];
        }
        const csvText = await response.text();
        const lines = csvText.trim().split(/\r?\n/);

        // Return empty if only header exists or it's totally empty
        if (lines.length < 2) return [];

        const releases: UpcomingRelease[] = [];

        // Start from index 1 to skip the header row
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

            // Column Mapping from the user's Google Sheet:
            // 0: name
            // 1: releaseDate
            // 2: coverImageUrl
            // 3: preSaveLink
            // 4: audioUrl
            // 5: Artista
            const name = values[0]?.trim() || '';
            const releaseDate = values[1]?.trim() || '';
            const coverImageUrl = values[2]?.trim() || '';
            const preSaveLink = values[3]?.trim() || '';
            const audioPreviewUrl = values[4]?.trim() || '';
            const artistName = values[5]?.trim() || 'Diosmasgym'; // Default to Diosmasgym if empty

            // Only add valid releases that have at least a name and string values
            if (name && releaseDate) {
                releases.push({
                    name,
                    artistName,
                    releaseDate,
                    coverImageUrl,
                    preSaveLink,
                    audioPreviewUrl
                });
            }
        }

        return releases;
    } catch (error) {
        console.error("Error fetching upcoming releases from sheet:", error);
        return [];
    }
};
