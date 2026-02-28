import type { Track, Video } from '../types';

const YOUTUBE_VIDEOS: Video[] = [];
const YOUTUBE_TOP_TRACKS: Track[] = [];

export const getPlaylistItems = async (): Promise<Video[]> => {
    return YOUTUBE_VIDEOS;
};

export const getArtistTopTracks = async (): Promise<Track[]> => {
    return YOUTUBE_TOP_TRACKS;
};
