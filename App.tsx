import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getArtistTopTracks as getYouTubeArtistTopTracks } from './services/youtubeService';
import { getUpcomingRelease } from './services/releaseService';
import type { Album, Artist, Track, UpcomingRelease } from './types';
import AlbumCard from './components/AlbumCard';
import StatCard from './components/StatCard';
import TopTracks from './components/TopTracks';
import SpotifyIcon from './components/SpotifyIcon';
import YoutubeMusicIcon from './components/YoutubeMusicIcon';
import AppleMusicIcon from './components/AppleMusicIcon';
import TiktokIcon from './components/TiktokIcon';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import AudioPlayer from './components/AudioPlayer';
import UpcomingReleaseCard from './components/UpcomingReleaseCard';

const spotifyArtistId = "2mEoedcjDJ7x6SCVLMI4Do"; // DIOSMASGYM
const YOUTUBE_ARTIST_CHANNEL_URL = "https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow";

const mergeAlbums = (spotifyAlbums: Album[]): Album[] => {
    return spotifyAlbums.map(spotifyAlbum => ({
        ...spotifyAlbum,
        external_urls: {
            ...spotifyAlbum.external_urls,
            youtube: YOUTUBE_ARTIST_CHANNEL_URL,
        },
    }));
};


const App: React.FC = () => {
    const [spotifyAlbums, setSpotifyAlbums] = useState<Album[]>([]);
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [shuffledMergedAlbums, setShuffledMergedAlbums] = useState<Album[]>([]);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [youtubeTopTracks, setYoutubeTopTracks] = useState<Track[]>([]);
    const [totalTracks, setTotalTracks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'random'>('random');
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
    const [upcomingRelease, setUpcomingRelease] = useState<UpcomingRelease | null>(null);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                artistDetailsResult,
                albumsResult,
                topTracksResult,
                upcomingReleaseResult,
                youtubeTracksResult
            ] = await Promise.allSettled([
                getArtistDetails(spotifyArtistId),
                getArtistAlbums(spotifyArtistId),
                getSpotifyArtistTopTracks(spotifyArtistId),
                getUpcomingRelease(),
                getYouTubeArtistTopTracks(),
            ]);

            if (artistDetailsResult.status === 'rejected') throw new Error(`No se pudieron obtener los detalles del artista: ${artistDetailsResult.reason.message}`);
            const fetchedArtist = artistDetailsResult.value;
            setArtist(fetchedArtist);

            let spotifyAlbumsFromApi: Album[] = [];
            if (albumsResult.status === 'fulfilled') {
                const fetchedAlbums = albumsResult.value;
                const uniqueAlbums = Array.from(fetchedAlbums.reduce((map, album) => map.set(album.id, album), new Map<string, any>()).values());
                spotifyAlbumsFromApi = uniqueAlbums.map(a => ({...a, source: 'spotify' as const}));
                setSpotifyAlbums(spotifyAlbumsFromApi);
                if (uniqueAlbums.length > 0) {
                    setTotalTracks(uniqueAlbums.reduce((sum, album) => sum + album.total_tracks, 0));
                }
            } else {
                 throw new Error(`No se pudieron obtener los álbumes de Spotify: ${albumsResult.reason.message}`);
            }
            
            if (topTracksResult.status === 'rejected') console.error("No se pudieron obtener los éxitos populares de Spotify:", topTracksResult.reason);
            else setTopTracks(topTracksResult.value);

            if (upcomingReleaseResult.status === 'fulfilled') setUpcomingRelease(upcomingReleaseResult.value);
            else console.error("No se pudo obtener la información del próximo estreno:", upcomingReleaseResult.reason);

            if (youtubeTracksResult.status === 'fulfilled') {
                setYoutubeTopTracks(youtubeTracksResult.value);
            } else {
                // Log error to console for developer, but don't show it in the UI
                console.error("No se pudieron obtener los éxitos de YouTube:", youtubeTracksResult.reason);
            }
            
            const finalMergedAlbums = mergeAlbums(spotifyAlbumsFromApi);
            setMergedAlbums(finalMergedAlbums);
            
            const shuffled = [...finalMergedAlbums].sort(() => Math.random() - 0.5);
            setShuffledMergedAlbums(shuffled);
    
        } catch (err) {
            setError(err instanceof Error ? `Error al obtener los datos: ${err.message}` : "Ocurrió un error desconocido.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArtistData();
    }, [fetchArtistData]);

    const filteredAndSortedAlbums = useMemo(() => {
        let albums = [...shuffledMergedAlbums]; // Use the randomly sorted list as the base for filters

        // Apply type filter
        if (albumTypeFilter !== 'all') {
            albums = albums.filter(album => album.album_type === albumTypeFilter);
        }
        
        // Apply sort order if not random
        if (sortOrder === 'newest') {
            albums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        } else if (sortOrder === 'oldest') {
            albums.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        }
        
        return albums;
    }, [shuffledMergedAlbums, albumTypeFilter, sortOrder]);


    const handleTrackSelect = (track: Track) => {
        if (playingTrack?.id === track.id) {
            setPlayingTrack(null); // Stop if the same track is clicked again
        } else {
            setPlayingTrack(track);
        }
    };
    
    if (loading) {
        return <div className="max-w-screen-2xl mx-auto px-4 md:px-6"><SkeletonLoader /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-400 text-center px-4">{error}</div>;
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
            <header className="py-6 md:py-8 mb-8 text-center sm:text-left">
                {artist && (
                    <>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                             <img 
                                src={artist.images?.[0]?.url ?? 'https://picsum.photos/200'}
                                alt={artist.name}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg shadow-black/30 border-4 border-[#282828]"
                            />
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">{artist.name}</h1>
                                {artist.genres && artist.genres.length > 0 && (
                                     <p className="text-gray-400 mt-2 text-sm md:text-base">Géneros: {artist.genres.join(', ')}</p>
                                )}
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                                    <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#1DB954] text-white text-xs font-semibold px-3 py-1 rounded-full transition-transform hover:scale-105"><SpotifyIcon className="w-4 h-4" /> Spotify</a>
                                    <a href={YOUTUBE_ARTIST_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-[#FF0000] text-white text-xs font-semibold px-3 py-1 rounded-full transition-transform hover:scale-105"><YoutubeMusicIcon className="w-4 h-4" /> YouTube Music</a>
                                    <a href="https://music.apple.com/us/artist/diosmasgym/1592659154" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full transition-transform hover:scale-105"><AppleMusicIcon className="w-4 h-4" /> Apple Music</a>
                                    <a href="https://www.tiktok.com/@diosmasgym" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full transition-transform hover:scale-105 border border-white"><TiktokIcon className="w-4 h-4" /> TikTok</a>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 flex-wrap justify-center mt-6 pt-6 border-t border-gray-800">
                           <StatCard label="Seguidores" value={artist.followers?.total.toLocaleString() ?? 'N/A'} />
                           <StatCard label="Álbumes" value={spotifyAlbums.length} />
                           <StatCard label="Canciones" value={totalTracks} />
                        </div>
                    </>
                )}
            </header>

            {upcomingRelease && <UpcomingReleaseCard release={upcomingRelease} />}
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                <div className="lg:col-span-1">
                    {topTracks.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-6 px-2">Populares en Spotify</h2>
                            <TopTracks 
                                tracks={topTracks} 
                                onTrackSelect={handleTrackSelect} 
                                playingTrackId={playingTrack?.id} 
                            />
                        </section>
                    )}

                    {youtubeTopTracks.length > 0 && (
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-white mb-6 px-2">Populares en YouTube</h2>
                            <TopTracks tracks={youtubeTopTracks} />
                        </section>
                    )}
                </div>

                <main className="lg:col-span-2">
                    <div className="px-2 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                         <h2 className="text-3xl font-bold text-white">Discografía</h2>
                         <div className="flex items-center gap-4">
                            <select 
                                value={albumTypeFilter}
                                onChange={(e) => setAlbumTypeFilter(e.target.value as 'all' | 'album' | 'single')}
                                className="bg-[#282828] border border-gray-700 text-white text-sm rounded-lg focus:ring-amber-400 focus:border-amber-400 block w-full p-2"
                            >
                                <option value="all">Todo</option>
                                <option value="album">Álbumes</option>
                                <option value="single">Sencillos</option>
                            </select>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'random')}
                                className="bg-[#282828] border border-gray-700 text-white text-sm rounded-lg focus:ring-amber-400 focus:border-amber-400 block w-full p-2"
                            >
                                <option value="random">Aleatorio</option>
                                <option value="newest">Más Recientes</option>
                                <option value="oldest">Más Antiguos</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                        {filteredAndSortedAlbums.map((album, index) => (
                            <div key={`${album.id}-${index}`} className="animate-fade-in" style={{ animationDelay: `${Math.min(index * 50, 1000)}ms` }}>
                                <AlbumCard album={album} />
                            </div>
                        ))}
                    </div>
                </main>
            </div>
            <ScrollToTopButton />
            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
            <footer className="text-center text-gray-500 text-sm py-8 mt-8">
                <p>Desarrollado con ❤️ para los fans.</p>
            </footer>
        </div>
    );
};

export default App;