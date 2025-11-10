export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface Artist {
    id: string;
    name: string;
    external_urls: {
        spotify: string;
    };
    followers?: {
        total: number;
    };
    genres?: string[];
    images?: Image[];
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Album {
    id: string;
    name: string;
    images: Image[];
    release_date: string;
    total_tracks: number;
    external_urls: {
        spotify: string;
    };
    artists: Artist[];
    album_type: 'album' | 'single' | 'compilation';
}

export interface AlbumsResponse {
    items: Album[];
    next: string | null;
    total: number;
    limit: number;
    offset: number;
}

export interface Track {
    id: string;
    name: string;
    album: Album;
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    preview_url: string | null;
}

export interface TopTracksResponse {
    tracks: Track[];
}