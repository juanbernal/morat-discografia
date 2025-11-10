import type { Album, Track, YouTubePlaylistsResponse, YouTubeSearchResponse, YouTubePlaylist, YouTubeSearchListResponse, YouTubeVideo } from '../types';

// IMPORTANTE: Para que la funcionalidad de YouTube funcione, debes obtener una clave de API de la
// Google Cloud Console y pegarla aquí. Asegúrate de restringir la clave para que solo
// pueda ser usada desde el dominio de tu aplicación para mayor seguridad.
// NUNCA expongas una clave sin restricciones en el código del lado del cliente.
const API_KEY = 'AIzaSyDA0Aruc7oYRf4K1tbwtKEfLy2dsTllxwU';
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ID del canal "Topic" de YouTube Music para DIOSMASGYM. Este canal contiene la discografía oficial.
const ARTIST_CHANNEL_ID = "UCaXTzIwNoZqhHw6WpHSdnow";

const fetchYouTubeApi = async <T>(endpoint: string, params: Record<string, string>): Promise<T> => {
    // La validación de la clave se realiza en las funciones exportadas para un manejo más elegante.
    const query = new URLSearchParams({ key: API_KEY, ...params }).toString();
    const response = await fetch(`${BASE_URL}/${endpoint}?${query}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`YouTube API Error: ${errorData.error.message}`);
    }
    return response.json();
};

export const getArtistPlaylists = async (): Promise<Album[]> => {
    if (!API_KEY || API_KEY === 'REEMPLAZA_CON_TU_CLAVE_DE_API_DE_YOUTUBE') {
        console.warn("La clave de la API de YouTube no está configurada en services/youtubeService.ts. Omitiendo la obtención de álbumes de YouTube.");
        return [];
    }

    let allPlaylists: YouTubePlaylist[] = [];
    let nextPageToken: string | undefined = undefined;

    do {
        const params: Record<string, string> = {
            channelId: ARTIST_CHANNEL_ID,
            part: 'snippet,contentDetails',
            maxResults: '50',
        };
        if (nextPageToken) {
            params.pageToken = nextPageToken;
        }
        const data = await fetchYouTubeApi<YouTubePlaylistsResponse>('playlists', params);
        allPlaylists = allPlaylists.concat(data.items);
        nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    const relevantPlaylists = allPlaylists.filter(p => 
        p.snippet.title.toLowerCase() !== 'liked videos' && 
        p.snippet.title.toLowerCase() !== 'uploads'
    );

    return relevantPlaylists.map(playlist => youtubePlaylistToAlbum(playlist));
};

const youtubePlaylistToAlbum = (playlist: YouTubePlaylist): Album => {
    const bestThumbnail = playlist.snippet.thumbnails.maxres || playlist.snippet.thumbnails.high || playlist.snippet.thumbnails.medium;
    
    const albumType = playlist.contentDetails.itemCount > 1 ? 'album' : 'single';

    return {
        id: playlist.id,
        name: playlist.snippet.title,
        images: bestThumbnail ? [{ url: bestThumbnail.url, height: bestThumbnail.height, width: bestThumbnail.width }] : [],
        release_date: playlist.snippet.publishedAt,
        total_tracks: playlist.contentDetails.itemCount,
        external_urls: {
            youtube: `https://music.youtube.com/playlist?list=${playlist.id}`,
        },
        artists: [], 
        album_type: albumType,
        source: 'youtube',
    };
};

export const getArtistTopTracks = async (): Promise<Track[]> => {
    if (!API_KEY || API_KEY === 'REEMPLAZA_CON_TU_CLAVE_DE_API_DE_YOUTUBE') {
        console.warn("La clave de la API de YouTube no está configurada en services/youtubeService.ts. Omitiendo la obtención de canciones populares de YouTube.");
        return [];
    }

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