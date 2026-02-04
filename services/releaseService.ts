
import type { UpcomingRelease } from '../types';

const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZwk9PkB6bti2CTDt0tMFsyYcDZqLN03YvNWMwx4cdHjvPccDI4cm3fFIiM3Sa0AP2HhHpD0X4L9Kf/pub?gid=0&single=true&output=csv';

const parseCustomDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1;
        let year = parseInt(parts[3], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day);
    }
    return new Date(dateStr);
};

const parseCsv = (csvText: string): UpcomingRelease[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const releases: UpcomingRelease[] = [];

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

        if (name && releaseDate && coverImageUrl) {
            releases.push({
                name,
                artistName,
                releaseDate,
                coverImageUrl,
                preSaveLink: manualPreSaveLink || `https://distrokid.com/hyperfollow/diosmasgym/${name.toLowerCase().replace(/\s+/g, '-')}`, 
                audioPreviewUrl: audioUrl || undefined
            });
        }
    }
    return releases;
}

export const getUpcomingReleases = async (): Promise<UpcomingRelease[]> => {
    try {
        const response = await fetch(`${GOOGLE_SHEET_CSV_URL}&t=${Date.now()}`);
        const csvText = await response.text();
        const allReleases = parseCsv(csvText);
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Filtrar solo los futuros y ordenar
        const upcoming = allReleases.filter(r => parseCustomDateString(r.releaseDate) >= now);
        upcoming.sort((a, b) => +parseCustomDateString(a.releaseDate) - +parseCustomDateString(b.releaseDate));

        return upcoming;
    } catch (error) {
        console.error("Error al obtener estrenos:", error);
        return [];
    }
};
