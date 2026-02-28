import type { UpcomingRelease } from '../types';

const RELEASES: UpcomingRelease[] = [
    // Ejemplo de lanzamiento futuro a agregar aquí:
    // {
    //     name: "Nuevo Sencillo",
    //     artistName: "Diosmasgym",
    //     releaseDate: "2026-12-31", // Formato YYYY-MM-DD
    //     coverImageUrl: "URL_DE_LA_IMAGEN",
    //     preSaveLink: "LINK_DE_PRESAVE",
    //     audioPreviewUrl: "URL_DE_AUDIO_OPCIONAL"
    // }
];

export const getUpcomingReleases = async (): Promise<UpcomingRelease[]> => {
    return RELEASES;
};
