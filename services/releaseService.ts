import type { UpcomingRelease } from '../types';

// IMPORTANTE: Reemplaza esta URL con la URL de tu Google Sheet publicado como CSV.
// Sigue las instrucciones: File > Share > Publish to web > Select Sheet > Select CSV > Publish
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZwk9PkB6bti2CTDt0tMFsyYcDZqLN03YvNWMwx4cdHjvPccDI4cm3fFIiM3Sa0AP2HhHpD0X4L9Kf/pub?gid=0&single=true&output=csv';

const parseCsv = (csvText: string): UpcomingRelease | null => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return null; // Needs header and at least one data row

    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines[1].split(',').map(d => d.trim());

    const releaseObject: { [key: string]: string } = {};
    headers.forEach((header, index) => {
        releaseObject[header] = data[index];
    });

    if (releaseObject.name && releaseObject.releaseDate && releaseObject.coverImageUrl && releaseObject.preSaveLink) {
        // Fix: Explicitly create an object with the correct type to satisfy TypeScript.
        // This is safer than a direct type assertion and resolves the error.
        return {
            name: releaseObject.name,
            releaseDate: releaseObject.releaseDate,
            coverImageUrl: releaseObject.coverImageUrl,
            preSaveLink: releaseObject.preSaveLink,
        };
    }

    return null;
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
        return parseCsv(csvText);
    } catch (error) {
        console.error("Fallo al obtener o parsear los datos del próximo estreno:", error);
        return null;
    }
};