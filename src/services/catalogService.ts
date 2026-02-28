import type { Track, Album } from '../types';

export const getCatalogFromSheet = async (): Promise<Track[]> => {
    const defaultAlbum: Album = {
        id: "static-album-1",
        name: "Lanzamientos Estáticos",
        images: [{ url: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5cb32?w=800&q=80", height: 300, width: 300 }],
        release_date: "2024-01-01",
        total_tracks: 1,
        external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
        artists: [{ id: "artist-1", name: "Diosmasgym", external_urls: { spotify: "" } }],
        album_type: "single",
        source: "merged"
    };

    return [
        {
            id: `track-static-1`,
            name: "Hagamos Historia (Ejemplo Estático)",
            album: defaultAlbum,
            artists: defaultAlbum.artists,
            duration_ms: 180000,
            explicit: false,
            external_urls: {
                spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do",
                youtube: "https://youtube.com"
            },
            preview_url: "",
            source: 'merged'
        }
    ];
};
