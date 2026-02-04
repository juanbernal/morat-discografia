
export interface SpotifyTokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Added missing AlbumsResponse interface to fix the import error in spotifyService.ts
export interface AlbumsResponse {
    items: Album[];
    next: string | null;
    total: number;
    limit: number;
    offset: number;
    href: string;
    previous: string | null;
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

export interface TopTracksResponse {
    tracks: Track[];
}

export interface UpcomingRelease {
  name: string;
  releaseDate: string;
  coverImageUrl: string;
  preSaveLink: string;
  audioPreviewUrl?: string;
}

// YouTube API Types
export interface Video {
    id: string;
    title: string;
    thumbnailUrl: string;
    url: string;
}

export interface YouTubeThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface YouTubePlaylistItemSnippet {
    title: string;
    description: string;
    thumbnails: {
        default?: YouTubeThumbnail;
        medium?: YouTubeThumbnail;
        high?: YouTubeThumbnail;
        standard?: YouTubeThumbnail;
        maxres?: YouTubeThumbnail;
    };
    resourceId: {
        videoId: string;
    };
}

export interface YouTubePlaylistItem {
    id: string;
    snippet: YouTubePlaylistItemSnippet;
}

export interface YouTubePlaylistSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default?: YouTubeThumbnail;
        medium?: YouTubeThumbnail;
        high?: YouTubeThumbnail;
        standard?: YouTubeThumbnail;
        maxres?: YouTubeThumbnail;
    };
}

export interface YouTubePlaylist {
    id: string;
    snippet: YouTubePlaylistSnippet;
    contentDetails: {
        itemCount: number;
    };
}

export interface YouTubeSearchResponse {
    items: {
        id: {
            channelId?: string;
            playlistId?: string;
        };
    }[];
}

export interface YouTubePlaylistsResponse {
    items: YouTubePlaylist[];
    nextPageToken?: string;
}

// YouTube Video Specific Types from Search
export interface YouTubeVideoSnippet {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default?: YouTubeThumbnail;
        medium?: YouTubeThumbnail;
        high?: YouTubeThumbnail;
    };
    channelTitle: string;
}

export interface YouTubeVideo {
    id: {
        videoId: string;
    };
    snippet: YouTubeVideoSnippet;
}

export interface YouTubeSearchListResponse {
    items: YouTubeVideo[];
}
