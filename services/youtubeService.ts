import type { Album, Track, YouTubePlaylistsResponse, YouTubePlaylist, YouTubeSearchListResponse, YouTubeVideo, YouTubeSearchPlaylistItem } from '../types';

// IMPORTANTE: Reemplaza "TU_API_KEY_AQUI" con tu clave de API de YouTube Data v3 real.
const apiKey = "AIzaSyDA0Aruc7oYRf4K1tbwtKEfLy2dsTllxwU";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const ARTIST_CHANNEL_ID = "UCaXTzIwNoZqhHw6WpHSdnow";

const fetchYouTubeApi = async <T>(endpoint: string, params: Record<string, string>): Promise<T> => {
    if (!apiKey || apiKey === "TU_API_KEY_AQUI") {
        throw new Error("La clave de API de YouTube no está configurada en services/youtubeService.ts");
    }

    const query = new URLSearchParams({ key: apiKey, ...params }).toString();
    const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);
    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.error?.message || `YouTube API request failed with status ${response.status}`;
        throw new Error(errorMessage);
    }
    return response.json();
};


// NEW: Smarter search-based function to find matching albums
export const getArtistPlaylists = async (spotifyAlbums: Album[], artistName: string): Promise<Album[]> => {
    const searchPromises = spotifyAlbums.map(async (spotifyAlbum) => {
        // Construct a precise search query
        const query = `${artistName} ${spotifyAlbum.name}`;
        
        try {
            const params = {
                part: 'snippet',
                q: query,
                type: 'playlist',
                channelId: ARTIST_CHANNEL_ID,
                maxResults: '1', // We only need the best match
            };
            const data = await fetchYouTubeApi<{ items: YouTubeSearchPlaylistItem[] }>('search', params);

            if (data.items.length > 0) {
                const playlistItem = data.items[0];
                return youtubeSearchItemToAlbum(playlistItem, spotifyAlbum.album_type);
            }
            return null;
        } catch (error) {
            console.error(`Failed to search for album "${query}" on YouTube:`, error);
            return null;
        }
    });

    const youtubeAlbums = await Promise.all(searchPromises);
    return youtubeAlbums.filter((album): album is Album => album !== null); // Filter out nulls
};


const youtubeSearchItemToAlbum = (item: YouTubeSearchPlaylistItem, albumTypeHint: 'album' | 'single' | 'compilation'): Album => {
    const { snippet, id } = item;
    const bestThumbnail = snippet.thumbnails.high || snippet.thumbnails.medium;

    return {
        id: id.playlistId,
        name: snippet.title,
        images: bestThumbnail ? [{ url: bestThumbnail.url, height: bestThumbnail.height, width: bestThumbnail.width }] : [],
        release_date: snippet.publishedAt,
        total_tracks: 0, // Search results don't provide track count, but it's not critical for merging
        external_urls: {
            youtube: `https://music.youtube.com/playlist?list=${id.playlistId}`,
        },
        artists: [], 
        album_type: albumTypeHint, // Use hint from spotify
        source: 'youtube',
    };
};


export const getArtistTopTracks = async (): Promise<Track[]> => {
    const params = {
        part: 'snippet',
        channelId: ARTIST_CHANNEL_ID,
        order: 'viewCount',
        type: 'video',
        maxResults: '5',
        videoCategoryId: '10', // Categoría de música
    };
    const data = await fetchYouTubeApi<YouTubeSearchListResponse>('search', params);
    return data.items.map(video => youtubeVideoToTrack(video));
};

const youtubeVideoToTrack = (video: YouTubeVideo): Track => {
    const bestThumbnail = video.snippet.thumbnails.high || video.snippet.thumbnails.medium;
    const albumImages = bestThumbnail ? [{ url: bestThumbnail.url, height: bestThumbnail.height, width: bestThumbnail.width }] : [];
    
    return {
        id: video.id.videoId,
        name: video.snippet.title,
        album: { 
            id: '',
            name: video.snippet.channelTitle,
            images: albumImages,
            release_date: video.snippet.publishedAt,
            total_tracks: 1,
            external_urls: { youtube: `https://music.youtube.com/channel/${video.snippet.channelId}` },
            artists: [],
            album_type: 'single',
            source: 'youtube',
        },
        artists: [{
            id: video.snippet.channelId,
            name: video.snippet.channelTitle,
            external_urls: { spotify: '' }
        }],
        duration_ms: 0,
        explicit: false,
        external_urls: {
            youtube: `https://music.youtube.com/watch?v=${video.id.videoId}`,
        },
        preview_url: null,
        source: 'youtube',
    };
};