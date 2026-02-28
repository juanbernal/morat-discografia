
import type { Track, YouTubeSearchListResponse, YouTubeVideo, YouTubePlaylistItem, Video } from '../types';

// YouTube API is disabled as requested by the user.
export const getPlaylistItems = async (): Promise<Video[]> => {
    return [];
};

export const getArtistTopTracks = async (): Promise<Track[]> => {
    return [];
};
