
import type { UpcomingRelease } from '../types';

// IMPORTANTE: Reemplaza esta URL con la URL de tu Google Sheet publicado como CSV.
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRZwk9PkB6bti2CTDt0tMFsyYcDZqLN03YvNWMwx4cdHjvPccDI4cm3fFIiM3Sa0AP2HhHpD0X4L9Kf/pub?gid=0&single=true&output=csv';

// --- Caching Logic ---
const getCache = <T>(key: string): T | null => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    try {
        const { data, expiry } = JSON.parse(cached);
        if (Date.now() > expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return data as T;
    } catch (e) {
        console.error("Error al leer de la caché", e);
        return null;
    }
};

const setCache = (key: string, data: any, ttl: number) => {
    const expiry = Date.now() + ttl;
    const item = { data, expiry };
    try {
        localStorage.setItem(key, JSON.stringify(item));
    } catch (e) {
        console.error("Error al escribir en la caché", e);
    }
};

const THIRTY_MINUTES = 30 * 60 * 1000;

const parseCustomDateString = (dateStr: string): Date => {
    if (!dateStr) return new Date();
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
    return new Date(dateStr);
};

// Generates DistroKid Hyperfollow URL based on Album Name
// Rules: 
// 1. Lowercase
// 2. Remove accents
// 3. ", " becomes "--"
// 4. " " becomes "-"
// 5. Remove special chars like ()
const generateHyperfollowLink = (albumName: string): string => {
    if (!albumName) return '';
    
    let slug = albumName.toLowerCase();
    
    // 1. Normalize accents (á -> a)
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // 2. Handle the specific comma+space rule first to preserve the double hyphen intent
    slug = slug.replace(/, /g, "--");
    slug = slug.replace(/,/g, "--"); // Handle comma without space just in case
    
    // 3. Remove parenthesis and other special chars that shouldn't be hyphens
    slug = slug.replace(/[()]/g, "");
    
    // 4. Replace remaining spaces with single hyphen
    slug = slug.replace(/\s+/g, "-");
    
    // 5. Remove any other non-alphanumeric characters (except the hyphens we just added)
    slug = slug.replace(/[^a-z0-9-]/g, "");
    
    // 6. Clean up edges (though usually not needed if regex is good)
    slug = slug.replace(/^-+|-+$/g, "");

    return `https://distrokid.com/hyperfollow/diosmasgym/${slug}`;
};

const parseCsv = (csvText: string): UpcomingRelease[] => {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];

    // Assuming standard structure if headers fail or just mapping by index for safety based on user request
    // Col 0: Name, Col 1: Date, Col 2: Cover, Col 3: Link (Optional), Col 4: Audio
    
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
                if (inQuotes && line[j + 1] === '"') {
                    currentField += '"';
                    j++; 
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                values.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        values.push(currentField);

        // Map values by index to ensure column E (index 4) is captured
        const name = values[0]?.replace(/""/g, '"').trim() || '';
        const releaseDate = values[1]?.replace(/""/g, '"').trim() || '';
        const coverImageUrl = values[2]?.replace(/""/g, '"').trim() || '';
        
        // Logic: If column 3 exists and is not empty, use it. Otherwise generate automatically.
        const manualPreSaveLink = values[3]?.replace(/""/g, '"').trim() || '';
        
        const audioUrl = values[4]?.replace(/""/g, '"').trim() || ''; 

        if (name && releaseDate && coverImageUrl) {
            const finalLink = manualPreSaveLink || generateHyperfollowLink(name);
            
            releases.push({
                name,
                releaseDate,
                coverImageUrl,
                preSaveLink: finalLink, 
                audioPreviewUrl: audioUrl || undefined
            });
        }
    }
    return releases;
}

export const getUpcomingRelease = async (): Promise<UpcomingRelease | null> => {
    const cacheKey = 'upcoming_release';
    const cached = getCache<UpcomingRelease>(cacheKey);
    if (cached) {
        if (+parseCustomDateString(cached.releaseDate) >= +new Date()) {
            return cached;
        }
    }

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`Error al obtener el CSV de Google Sheets: ${response.statusText}`);
        }
        const csvText = await response.text();
        const allReleases = parseCsv(csvText);
        
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcomingReleases = allReleases.filter(release => {
            const releaseDate = parseCustomDateString(release.releaseDate);
            return releaseDate >= now;
        });

        if (upcomingReleases.length === 0) {
            return null; 
        }

        upcomingReleases.sort((a, b) => {
            return +parseCustomDateString(a.releaseDate) - +parseCustomDateString(b.releaseDate);
        });

        const soonestRelease = upcomingReleases[0];
        setCache(cacheKey, soonestRelease, THIRTY_MINUTES);
        return soonestRelease; 

    } catch (error) {
        console.error("Fallo al obtener o parsear los datos del próximo estreno:", error);
        return null;
    }
};
