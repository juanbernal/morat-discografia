import type { UpcomingRelease, Album } from '../types';
import { fetchWithCache } from './cacheService';
import { STATIC_DATA } from '../data/staticData';

const UPCOMING_RELEASES_CSV_URL = import.meta.env.VITE_UPCOMING_RELEASES_URL || 'https://docs.google.com/spreadsheets/d/1fiQV83kyFLXLJvKYkVAm-Enlre-INgIRPc90Igb4E7E/export?format=csv&gid=0';

async function parseReleases(): Promise<UpcomingRelease[]> {
    const releases: UpcomingRelease[] = [];
    const manualNames = new Set<string>();

    try {
        // 1. Fetch from Google Sheet (Priority/Manual)
        const response = await fetch(`${UPCOMING_RELEASES_CSV_URL}&t=${Date.now()}`);
        if (response.ok) {
            const csvText = await response.text();
            const lines = csvText.trim().split(/\r?\n/);

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
                const preSaveLink = values[3]?.trim() || '';
                const audioPreviewUrl = values[4]?.trim() || '';
                const artistName = values[5]?.trim() || 'Diosmasgym';

                if (name && releaseDate) {
                    releases.push({
                        name,
                        artistName,
                        releaseDate,
                        coverImageUrl,
                        preSaveLink,
                        audioPreviewUrl
                    });
                    manualNames.add(name.toLowerCase());
                }
            }
        }
    } catch (error) {
        console.warn("Error fetching manual releases, falling back to automation:", error);
    }

    // 2. Automated Detection (Fall-through)
    // We check STATIC_DATA for the latest albums of all artists
    try {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - 90); // Recent = last 90 days

        Object.values(STATIC_DATA).forEach(data => {
            if (!data.albums || data.albums.length === 0) return;

            // Sort albums by date descending
            const sortedAlbums = [...data.albums].sort((a, b) => 
                new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
            );

            // Take the absolute latest one if it's recent or in the future
            const latest = sortedAlbums[0];
            const releaseDate = new Date(latest.release_date);

            if (!manualNames.has(latest.name.toLowerCase())) {
                // If it's future or released within the last 30 days
                if (releaseDate >= thresholdDate) {
                    releases.push({
                        name: latest.name,
                        artistName: data.artist.name,
                        releaseDate: latest.release_date,
                        coverImageUrl: latest.images[0]?.url || '',
                        preSaveLink: latest.external_urls.spotify || '',
                        audioPreviewUrl: ''
                    });
                }
            }
        });
    } catch (error) {
        console.error("Error in automated release detection:", error);
    }

    // Sort all releases by date descending (future releases first)
    return releases.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
}

export const getUpcomingReleases = async (): Promise<UpcomingRelease[]> => {
    return fetchWithCache('upcoming-releases', parseReleases);
};
