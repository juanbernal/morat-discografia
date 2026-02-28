import type { Album, Artist, Track, SimplifiedTrack } from '../types';

interface SpotifyStaticData {
    artist: Artist;
    topTracks: Track[];
    albums: Album[];
    albumTracks: Record<string, SimplifiedTrack[]>;
    lastUpdated: string;
}

const STATIC_DATA: SpotifyStaticData = {
    artist: {
        id: "2mEoedcjDJ7x6SCVLMI4Do",
        name: "Diosmasgym",
        external_urls: { spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do" },
        images: [{ url: "https://picsum.photos/600/600", height: 600, width: 600 }]
    },
    topTracks: [],
    albums: [],
    albumTracks: {},
    lastUpdated: "2024-01-01T00:00:00.000Z"
};

export const getArtistDetails = async (artistId: string): Promise<Artist | null> => {
    if (STATIC_DATA.artist.id === artistId) return STATIC_DATA.artist;
    return null;
};

export const getArtistTopTracks = async (artistId: string): Promise<Track[]> => {
    if (STATIC_DATA.artist.id === artistId) return STATIC_DATA.topTracks;
    return [];
};

export const getArtistAlbums = async (artistId: string): Promise<Album[]> => {
    return STATIC_DATA.albums.filter(a => a.artists.some(art => art.id === artistId));
};

export const getAlbumTracks = async (albumId: string): Promise<SimplifiedTrack[]> => {
    if (STATIC_DATA.albumTracks && STATIC_DATA.albumTracks[albumId]) {
        return STATIC_DATA.albumTracks[albumId];
    }
    return [];
};
