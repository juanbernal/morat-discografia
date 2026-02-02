
import type { Track, YouTubeSearchListResponse, YouTubeVideo, YouTubePlaylistItem, Video } from '../types';

// --- CONFIGURACIÓN DE API KEY ---
// IMPORTANTE: Pega tu API Key aquí abajo dentro de las comillas.
const apiKey = "AIzaSy...PUT_YOUR_YOUTUBE_API_KEY_HERE"; 

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const ARTIST_CHANNEL_ID = "UCaXTzIwNoZqhHw6WpHSdnow";
const YOUTUBE_VIDEOS_PLAYLIST_ID = "PLWNDkgelvjs43clAcOKalker7kFCsQE3p";

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

const ONE_HOUR = 60 * 60 * 1000;

// Helper to check if API key is likely valid (not the placeholder)
const hasValidApiKey = () => {
    return apiKey && !apiKey.includes("PUT_YOUR_YOUTUBE_API_KEY_HERE") && apiKey.length > 10;
};

const fetchYouTubeApi = async <T>(endpoint: string, params: Record<string, string>): Promise<T> => {
    if (!hasValidApiKey()) {
        throw new Error("No API Key provided"); 
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

interface YouTubePlaylistItemsResponse {
    items: YouTubePlaylistItem[];
    nextPageToken?: string;
}

export const getPlaylistItems = async (): Promise<Video[]> => {
    // Si no hay clave válida, devolvemos array vacío para que NO se muestre la sección.
    if (!hasValidApiKey()) {
        return [];
    }

    // Updated cache key to invalidate old dummy data
    const cacheKey = `youtube_playlist_items_${YOUTUBE_VIDEOS_PLAYLIST_ID}_v2`;
    const cached = getCache<Video[]>(cacheKey);
    if (cached) return cached;
    
    try {
        const params = {
            part: 'snippet',
            playlistId: YOUTUBE_VIDEOS_PLAYLIST_ID,
            maxResults: '20', 
        };
        const data = await fetchYouTubeApi<YouTubePlaylistItemsResponse>('playlistItems', params);
        
        if (data.items && data.items.length > 0) {
            const videos = data.items
                .filter(item => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
                .map(item => ({
                    id: item.snippet.resourceId.videoId,
                    title: item.snippet.title,
                    thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
                    url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
                }));
            
            setCache(cacheKey, videos, ONE_HOUR);
            return videos;
        }
    } catch (error) {
        console.warn("YouTube API falló o no está configurada correctamente:", error);
    }

    return [];
};

export const getArtistTopTracks = async (): Promise<Track[]> => {
    // Si no hay clave válida, devolvemos array vacío para que NO se muestre la sección.
    if (!hasValidApiKey()) {
        return [];
    }

    // Updated cache key to invalidate old dummy data
    const cacheKey = `youtube_top_tracks_${ARTIST_CHANNEL_ID}_v2`;
    const cached = getCache<Track[]>(cacheKey);
    if (cached) return cached;

    try {
        const params = {
            part: 'snippet',
            channelId: ARTIST_CHANNEL_ID,
            order: 'viewCount',
            type: 'video',
            maxResults: '5',
            videoCategoryId: '10', 
        };

        const data = await fetchYouTubeApi<YouTubeSearchListResponse>('search', params);
        
        if (data.items && data.items.length > 0) {
            const tracks = data.items.map(video => youtubeVideoToTrack(video));
            setCache(cacheKey, tracks, ONE_HOUR);
            return tracks;
        }
    } catch (error) {
        console.warn("YouTube API falló (Top Tracks):", error);
    }

    return [];
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
