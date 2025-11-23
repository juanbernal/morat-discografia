
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getArtistTopTracks as getYouTubeArtistTopTracks, getPlaylistItems } from './services/youtubeService';
import { getUpcomingRelease } from './services/releaseService';
import type { Album, Artist, Track, UpcomingRelease, Video } from './types';
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
import AlbumDetailModal from './components/AlbumDetailModal';
import VideoCard from './components/VideoCard';
import TikTokFeed from './components/TikTokFeed';
import Biography from './components/Biography';
import VideoPlayerModal from './components/VideoPlayerModal';
import BiblicalEasterEgg from './components/BiblicalEasterEgg';
import PresaveModal from './components/PresaveModal';
import QuoteGeneratorModal from './components/QuoteGeneratorModal';
import QuickLinks from './components/QuickLinks';

const spotifyArtistId = "2mEoedcjDJ7x6SCVLMI4Do"; // DIOSMASGYM
const YOUTUBE_ARTIST_CHANNEL_URL = "https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow";

// Helper to add source tag without overwriting URLs incorrectly
const processSpotifyAlbums = (spotifyAlbums: Album[]): Album[] => {
    return spotifyAlbums.map(spotifyAlbum => ({
        ...spotifyAlbum,
        source: 'spotify' as const
    }));
};


const App: React.FC = () => {
    const [spotifyAlbums, setSpotifyAlbums] = useState<Album[]>([]);
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [shuffledMergedAlbums, setShuffledMergedAlbums] = useState<Album[]>([]);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [youtubeTopTracks, setYoutubeTopTracks] = useState<Track[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [totalTracks, setTotalTracks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'random'>('random');
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
    const [upcomingRelease, setUpcomingRelease] = useState<UpcomingRelease | null>(null);
    const [youtubeError, setYoutubeError] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [showUpcomingReleaseModal, setShowUpcomingReleaseModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showBioModal, setShowBioModal] = useState(false);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                artistDetailsResult,
                albumsResult,
                topTracksResult,
                upcomingReleaseResult,
                youtubeTracksResult,
                videoPlaylistResult
            ] = await Promise.allSettled([
                getArtistDetails(spotifyArtistId),
                getArtistAlbums(spotifyArtistId),
                getSpotifyArtistTopTracks(spotifyArtistId),
                getUpcomingRelease(),
                getYouTubeArtistTopTracks(),
                getPlaylistItems(),
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
                setYoutubeError(false);
            } else {
                console.error("No se pudieron obtener los éxitos de YouTube:", youtubeTracksResult.reason);
                setYoutubeTopTracks([]);
                setYoutubeError(true);
            }

            if (videoPlaylistResult.status === 'fulfilled') {
                const allVideos = videoPlaylistResult.value;
                const randomVideos = [...allVideos].sort(() => Math.random() - 0.5).slice(0, 8);
                setVideos(randomVideos);
            } else {
                console.error("No se pudieron obtener los videos de la playlist:", videoPlaylistResult.reason);
                setVideos([]);
            }
            
            const finalMergedAlbums = processSpotifyAlbums(spotifyAlbumsFromApi);
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

    useEffect(() => {
        if (upcomingRelease) {
            const releaseIdentifier = `${upcomingRelease.name.trim()}-${upcomingRelease.releaseDate.trim()}`;
            const seenIdentifier = localStorage.getItem('seenUpcomingReleaseIdentifier');
            if (releaseIdentifier !== seenIdentifier) {
                setShowUpcomingReleaseModal(true);
            }
        }
    }, [upcomingRelease]);

    const newestAlbumId = useMemo(() => {
        if (mergedAlbums.length === 0) return null;
        const sortedByDate = [...mergedAlbums].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        return sortedByDate[0]?.id;
    }, [mergedAlbums]);

    // --- Search Logic ---
    const isSearching = searchQuery.length > 0;

    const filteredAndSortedAlbums = useMemo(() => {
        let albums = [...shuffledMergedAlbums]; 
        
        if (searchQuery) {
            albums = mergedAlbums.filter(album => 
                album.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        } else {
            if (albumTypeFilter !== 'all') {
                albums = albums.filter(album => album.album_type === albumTypeFilter);
            }
            
            if (sortOrder === 'newest') {
                albums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            } else if (sortOrder === 'oldest') {
                albums.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
            }
        }
        
        return albums;
    }, [shuffledMergedAlbums, mergedAlbums, albumTypeFilter, sortOrder, searchQuery]);

    const filteredVideos = useMemo(() => {
        if (!searchQuery) return videos;
        return videos.filter(video => video.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [videos, searchQuery]);

    const filteredTracks = useMemo(() => {
        if (!searchQuery) return [];
        const allTracks = [...topTracks, ...youtubeTopTracks];
        return allTracks.filter(track => track.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [topTracks, youtubeTopTracks, searchQuery]);


    const handleTrackSelect = (track: Track) => {
        if (playingTrack?.id === track.id) {
            setPlayingTrack(null); 
        } else {
            setPlayingTrack(track);
        }
    };

    const handleAlbumSelect = (album: Album) => {
        setSelectedAlbum(album);
    };
    
    const handleVideoSelect = (video: Video) => {
        setSelectedVideo(video);
    };

    const handleCloseModal = () => {
        setSelectedAlbum(null);
    };
    
    const handleCloseVideoModal = () => {
        setSelectedVideo(null);
    };

    const handleCloseUpcomingReleaseModal = () => {
        setShowUpcomingReleaseModal(false);
        if (upcomingRelease) {
            const releaseIdentifier = `${upcomingRelease.name.trim()}-${upcomingRelease.releaseDate.trim()}`;
            localStorage.setItem('seenUpcomingReleaseIdentifier', releaseIdentifier);
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
            {showUpcomingReleaseModal && upcomingRelease && (
                <PresaveModal 
                    release={upcomingRelease}
                    onClose={handleCloseUpcomingReleaseModal}
                />
            )}

            {showQuoteModal && (
                <QuoteGeneratorModal 
                    albums={mergedAlbums}
                    onClose={() => setShowQuoteModal(false)}
                />
            )}

            {showBioModal && (
                <Biography onClose={() => setShowBioModal(false)} />
            )}
            
            {/* Header & Global Search */}
            <header className="py-6 md:py-8 mb-8">
                {artist && (
                    <>
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
                                <BiblicalEasterEgg>
                                     <img 
                                        src={artist.images?.[0]?.url ?? 'https://picsum.photos/200'}
                                        alt={artist.name}
                                        className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover shadow-lg shadow-black/30 border-4 border-slate-800 cursor-help"
                                    />
                                </BiblicalEasterEgg>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-lg">{artist.name}</h1>
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-2">
                                        <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#1DB954] transition-colors"><SpotifyIcon className="w-5 h-5" /></a>
                                        <a href={YOUTUBE_ARTIST_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FF0000] transition-colors"><YoutubeMusicIcon className="w-5 h-5" /></a>
                                        <a href="https://music.apple.com/us/artist/diosmasgym/1592659154" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#FA243C] transition-colors"><AppleMusicIcon className="w-5 h-5" /></a>
                                        <a href="https://www.tiktok.com/@diosmasgym" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><TiktokIcon className="w-5 h-5" /></a>
                                    </div>
                                </div>
                             </div>

                             {/* Global Search Bar & Actions */}
                             <div className="w-full lg:flex-1 max-w-2xl flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative group w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <input
                                        type="search"
                                        placeholder="Buscar canciones, videos, álbumes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-full leading-5 bg-slate-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-md"
                                        aria-label="Buscador global"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setShowQuoteModal(true)}
                                        className="whitespace-nowrap px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                                    >
                                        <span>✨ Crear Frase</span>
                                    </button>
                                    <button 
                                        onClick={() => setShowBioModal(true)}
                                        className="whitespace-nowrap px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 border border-slate-600"
                                        title="Ver Historia"
                                    >
                                        <span>📜 Historia</span>
                                    </button>
                                </div>
                             </div>
                        </div>

                        {!isSearching && (
                            <div className="flex gap-4 flex-wrap justify-center sm:justify-start mt-6 pt-6 border-t border-slate-700">
                               <StatCard label="Álbumes" value={spotifyAlbums.length} />
                               <StatCard label="Canciones" value={totalTracks} />
                            </div>
                        )}
                    </>
                )}
            </header>

            {/* CONDITIONAL RENDERING BASED ON SEARCH */}
            {isSearching ? (
                <div className="animate-fade-in space-y-12 min-h-[50vh]">
                    <h2 className="text-2xl font-bold text-gray-300">Resultados para: <span className="text-white">"{searchQuery}"</span></h2>
                    
                    {/* 1. Track Results */}
                    {filteredTracks.length > 0 && (
                        <section>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                🎵 Canciones Encontradas
                            </h3>
                             <TopTracks 
                                tracks={filteredTracks} 
                                onTrackSelect={handleTrackSelect} 
                                playingTrackId={playingTrack?.id} 
                            />
                        </section>
                    )}

                    {/* 2. Video Results */}
                    {filteredVideos.length > 0 && (
                        <section>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                🎬 Videos Encontrados
                            </h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {filteredVideos.map(video => (
                                    <VideoCard 
                                        key={video.id} 
                                        video={video} 
                                        onSelect={handleVideoSelect}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. Album Results */}
                    {filteredAndSortedAlbums.length > 0 && (
                        <section>
                             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                💿 Álbumes Encontrados
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                                {filteredAndSortedAlbums.map((album, index) => (
                                    <div key={album.id} className="animate-fade-in">
                                        <AlbumCard
                                            album={album}
                                            onSelect={handleAlbumSelect}
                                            isNewest={false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {filteredTracks.length === 0 && filteredVideos.length === 0 && filteredAndSortedAlbums.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">No se encontraron resultados. Intenta con otra búsqueda.</p>
                        </div>
                    )}
                </div>
            ) : (
                /* DEFAULT HOME VIEW */
                <>
                    {/* Biography removed from here - now in modal */}

                    {upcomingRelease && <UpcomingReleaseCard release={upcomingRelease} />}

                    {videos.length > 0 && (
                        <section className="mb-12 animate-fade-in">
                            <h2 className="text-3xl font-bold text-white mb-6 px-2 flex items-center gap-3">
                                <YoutubeMusicIcon className="w-8 h-8 text-[#FF0000]"/>
                                <span>Videoclips Oficiales</span>
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {videos.map(video => (
                                    <VideoCard 
                                        key={video.id} 
                                        video={video} 
                                        onSelect={handleVideoSelect}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        <div className="lg:col-span-1">
                            {topTracks.length > 0 && (
                                <section className="mb-12">
                                    <h2 className="text-3xl font-bold text-white mb-6 px-2 flex items-center gap-3">
                                        <SpotifyIcon className="w-8 h-8 text-[#1DB954]"/>
                                        <span>Top Hits en Spotify</span>
                                    </h2>
                                    <TopTracks 
                                        tracks={topTracks} 
                                        onTrackSelect={handleTrackSelect} 
                                        playingTrackId={playingTrack?.id} 
                                    />
                                </section>
                            )}
                            {(youtubeTopTracks.length > 0 || youtubeError) && (
                                <section className="mb-12">
                                    <h2 className="text-3xl font-bold text-white mb-6 px-2 flex items-center gap-3">
                                        <YoutubeMusicIcon className="w-8 h-8 text-[#FF0000]"/>
                                        <span>Top Hits en YouTube</span>
                                    </h2>
                                    {youtubeTopTracks.length > 0 && (
                                        <TopTracks tracks={youtubeTopTracks} />
                                    )}
                                    {youtubeError && (
                                        <p className="text-gray-400 px-2">Contenido de YouTube no disponible temporalmente.</p>
                                    )}
                                </section>
                            )}
                            <TikTokFeed />
                        </div>

                        <main className="lg:col-span-2">
                            <div className="px-2 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-3xl font-bold text-white">Discografía</h2>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <select 
                                        value={albumTypeFilter}
                                        onChange={(e) => setAlbumTypeFilter(e.target.value as 'all' | 'album' | 'single')}
                                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                    >
                                        <option value="all">Todo</option>
                                        <option value="album">Álbumes</option>
                                        <option value="single">Sencillos</option>
                                    </select>
                                    <select 
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'random')}
                                        className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
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
                                        <AlbumCard
                                            album={album}
                                            onSelect={handleAlbumSelect}
                                            isNewest={album.id === newestAlbumId}
                                        />
                                    </div>
                                ))}
                            </div>
                        </main>
                    </div>

                    <QuickLinks albums={mergedAlbums} />
                </>
            )}

            <ScrollToTopButton />
            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
             <AlbumDetailModal 
                album={selectedAlbum} 
                onClose={handleCloseModal}
                onTrackSelect={handleTrackSelect}
                playingTrackId={playingTrack?.id}
            />
            <VideoPlayerModal 
                video={selectedVideo}
                onClose={handleCloseVideoModal}
            />
            <footer className="text-center text-gray-500 text-sm py-8 mt-8">
                <p>Desarrollado con ❤️ para los fans.</p>
            </footer>
        </div>
    );
};

export default App;