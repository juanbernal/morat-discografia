import type { Track, YouTubeSearchListResponse, YouTubeVideo } from '../types';

// INSTRUCCIONES: Reemplaza esta clave de marcador de posición con tu clave de API de YouTube Data v3.
const apiKey = "AIzaSy...PUT_YOUR_YOUTUBE_API_KEY_HERE";

const BASE_URL = "https://www.googleapis.com/youtube/v3";
const ARTIST_CHANNEL_ID = "UCaXTzIwNoZqhHw6WpHSdnow";

const fetchYouTubeApi = async <T>(endpoint: string, params: Record<string, string>): Promise<T> => {
    if (!apiKey || apiKey.includes("PUT_YOUR_YOUTUBE_API_KEY_HERE")) {
        throw new Error("Por favor, configura tu clave de API de YouTube en services/youtubeService.ts");
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
    
    if (!data.items) {
        return [];
    }
    
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