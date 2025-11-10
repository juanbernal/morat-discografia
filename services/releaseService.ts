import type { UpcomingRelease } from '../types';

// IMPORTANTE: Reemplaza esta URL con la URL de tu Google Sheet publicado como CSV.
// Sigue las instrucciones: File > Share > Publish to web > Select Sheet > Select CSV > Publish
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZwk9PkB6bti2CTDt0tMFsyYcDZqLN03YvNWMwx4cdHjvPccDI4cm3fFIiM3Sa0AP2HhHpD0X4L9Kf/pub?gid=0&single=true&output=csv';

const parseCustomDateString = (dateStr: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        return new Date(dateStr);
    }
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1;
        let year = parseInt(parts[3], 10);
        if (year < 100) {
            year += 2000;
        }
        return new Date(year, month, day);
    }
    console.warn(`Date format "${dateStr}" is not standard. Using browser's default parsing. Recommended format is YYYY-MM-DD.`);
    return new Date(dateStr);
};

const parseCsv = (csvText: string): UpcomingRelease[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const releases: UpcomingRelease[] = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',').map(d => d.trim());
        if (data.length < headers.length) continue;

        const releaseObject: { [key: string]: string } = {};
        headers.forEach((header, index) => {
            releaseObject[header] = data[index];
        });

        if (releaseObject.name && releaseObject.releaseDate && releaseObject.coverImageUrl && releaseObject.preSaveLink) {
            releases.push({
                name: releaseObject.name,
                releaseDate: releaseObject.releaseDate,
                coverImageUrl: releaseObject.coverImageUrl,
                preSaveLink: releaseObject.preSaveLink,
            });
        }
    }
    return releases;
}

export const getUpcomingRelease = async (): Promise<UpcomingRelease | null> => {
    if (!GOOGLE_SHEET_CSV_URL || GOOGLE_SHEET_CSV_URL.includes('...')) {
        console.warn('URL de Google Sheet no configurada en services/releaseService.ts');
        return null;
    }

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener el CSV de Google Sheets: ${response.statusText}`);
        }
        const csvText = await response.text();
        const allReleases = parseCsv(csvText);
        
        const now = new Date();
        // Set hours, minutes, seconds, and milliseconds to 0 to compare dates only
        now.setHours(0, 0, 0, 0);

        const upcomingReleases = allReleases.filter(release => {
            const releaseDate = parseCustomDateString(release.releaseDate);
            return releaseDate >= now;
        });

        if (upcomingReleases.length === 0) {
            return null; // No upcoming releases found
        }

        // Sort to find the soonest release
        upcomingReleases.sort((a, b) => {
            return +parseCustomDateString(a.releaseDate) - +parseCustomDateString(b.releaseDate);
        });

        return upcomingReleases[0]; // Return the soonest upcoming release

    } catch (error) {
        console.error("Fallo al obtener o parsear los datos del próximo estreno:", error);
        return null;
    }
};