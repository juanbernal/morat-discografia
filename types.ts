export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface AlbumsResponse {
    items: Album[];
    next: string | null;
    total: number;
    limit: number;
    offset: number;
    href: string;
    previous: string | null;
}

// Fix: Added TopTracksResponse interface missing in spotifyService.ts
export interface TopTracksResponse {
    tracks: Track[];
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
    popularity?: number;
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
        spotify?: string;
        youtube?: string;
    };
    artists: Artist[];
    album_type: 'album' | 'single' | 'compilation';
    source: 'spotify' | 'youtube' | 'merged';
}

export interface BlogPost {
    id: string;
    title: string;
    url: string;
    published: string;
    thumbnail: string;
    summary: string;
}

export interface Track {
    id: string;
    name: string;
    album: Album;
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify?: string;
        youtube?: string;
    };
    preview_url: string | null;
    source?: 'spotify' | 'youtube' | 'merged';
}

export interface SimplifiedTrack {
    id: string;
    name: string;
    artists: Artist[];
    duration_ms: number;
    explicit: boolean;
    external_urls: {
        spotify: string;
    };
    preview_url: string | null;
    track_number: number;
}

export interface UpcomingRelease {
  name: string;
  artistName: string; // Nuevo campo
  releaseDate: string;
  coverImageUrl: string;
  preSaveLink: string;
  audioPreviewUrl?: string;
}

export interface Video {
    id: string;
    title: string;
    thumbnailUrl: string;
    url: string;
}

export interface YouTubePlaylistItem {
    id: string;
    snippet: {
        title: string;
        description: string;
        thumbnails: { [key: string]: { url: string } };
        resourceId: { videoId: string };
    };
}

// Fix: Added YouTubeVideo interface missing in youtubeService.ts
export interface YouTubeVideo {
    id: { videoId: string };
    snippet: {
        publishedAt: string;
        channelId: string;
        title: string;
        description: string;
        thumbnails: { [key: string]: { url: string; height: number; width: number } };
        channelTitle: string;
    };
}

export interface YouTubeSearchListResponse {
    items: YouTubeVideo[];
}