
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getArtistPlaylists as getYouTubeArtistPlaylists, getArtistTopTracks as getYouTubeArtistTopTracks } from './services/youtubeService';
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

const normalizeName = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[\(\[].*?[\)\]]/g, '') // Remove content in parentheses/brackets
        .replace(/\b(ep|single|deluxe|remastered|edition|version)\b/g, '') // Remove keywords
        .replace(/&/g, 'and') // Replace ampersand
        .replace(/[^\w\s]/gi, '') // Remove special characters that are not word or space
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
};

const mergeAlbums = (spotifyAlbums: Album[], youtubeAlbums: Album[]): Album[] => {
    const youtubeAlbumMap = new Map<string, Album>();
    youtubeAlbums.forEach(album => {
        youtubeAlbumMap.set(normalizeName(album.name), album);
    });

    return spotifyAlbums.map(spotifyAlbum => {
        const normalizedName = normalizeName(spotifyAlbum.name);
        if (youtubeAlbumMap.has(normalizedName)) {
            const ytAlbum = youtubeAlbumMap.get(normalizedName)!;
            return {
                ...spotifyAlbum,
                external_urls: {
                    ...spotifyAlbum.external_urls,
                    youtube: ytAlbum.external_urls.youtube,
                },
                source: 'merged' as const,
            };
        }
        return spotifyAlbum;
    });
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
    const [youtubeDataError, setYoutubeDataError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'random'>('random');
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
    const [upcomingRelease, setUpcomingRelease] = useState<UpcomingRelease | null>(null);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setYoutubeDataError(null);
        try {
            const results = await Promise.allSettled([
                getArtistDetails(spotifyArtistId),
                getArtistAlbums(spotifyArtistId),
                getSpotifyArtistTopTracks(spotifyArtistId),
                getUpcomingRelease(),
                getYouTubeArtistPlaylists(),
                getYouTubeArtistTopTracks(),
            ]);
    
            const [artistDetailsResult, albumsResult, topTracksResult, upcomingReleaseResult, youtubePlaylistsResult, youtubeTopTracksResult] = results;
    
            if (artistDetailsResult.status === 'rejected') {
                throw new Error(`No se pudieron obtener los detalles del artista: ${artistDetailsResult.reason.message}`);
            }
            setArtist(artistDetailsResult.value);
    
            let spotifyAlbumsFromApi: Album[] = [];
            if (albumsResult.status === 'fulfilled') {
                const fetchedAlbums = albumsResult.value;
                const uniqueAlbums = Array.from(
                    fetchedAlbums.reduce((map, album) => map.set(album.id, album), new Map<string, any>()).values()
                );
                spotifyAlbumsFromApi = uniqueAlbums.map(a => ({...a, source: 'spotify' as const}));
                setSpotifyAlbums(spotifyAlbumsFromApi);

                if (uniqueAlbums.length > 0) {
                    const total = uniqueAlbums.reduce((sum, album) => sum + album.total_tracks, 0);
                    setTotalTracks(total);
                }
            } else {
                 throw new Error(`No se pudieron obtener los álbumes de Spotify: ${albumsResult.reason.message}`);
            }
            
            if (topTracksResult.status === 'rejected') {
                console.error("No se pudieron obtener los éxitos populares:", topTracksResult.reason);
                setTopTracks([]);
            } else {
                setTopTracks(topTracksResult.value);
            }

            if (upcomingReleaseResult.status === 'fulfilled') {
                setUpcomingRelease(upcomingReleaseResult.value);
            } else {
                console.error("No se pudo obtener la información del próximo estreno:", upcomingReleaseResult.reason);
            }
            
            let youtubeAlbumsFromApi: Album[] = [];
            let youtubeError = false;

            if (youtubePlaylistsResult.status === 'rejected') {
                console.error("No se pudieron obtener los álbumes de YouTube:", youtubePlaylistsResult.reason);
                youtubeError = true;
            } else {
                youtubeAlbumsFromApi = youtubePlaylistsResult.value;
            }
            
            if (youtubeTopTracksResult.status === 'rejected') {
                console.error("No se pudieron obtener las canciones populares de YouTube:", youtubeTopTracksResult.reason);
                youtubeError = true;
            } else {
                setYoutubeTopTracks(youtubeTopTracksResult.value);
            }

            if (youtubeError) {
                setYoutubeDataError("No se pudo cargar el contenido de YouTube. Esto puede deberse a que la clave de API no está configurada o es incorrecta. Si eres el administrador, verifica el archivo 'services/youtubeService.ts'.");
            }
            
            // Merge albums from both sources
            const finalMergedAlbums = mergeAlbums(spotifyAlbumsFromApi, youtubeAlbumsFromApi);
            setMergedAlbums(finalMergedAlbums);
            
            // Create shuffled version for random sort
            const shuffled = [...finalMergedAlbums];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setShuffledMergedAlbums(shuffled);
    
        } catch (err) {
            if (err instanceof Error) {
                setError(`Error al obtener los datos: ${err.message}. Por favor, revisa las credenciales y la conexión.`);
            } else {
                setError("Ocurrió un error desconocido.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArtistData();
    }, [fetchArtistData]);
    
    useEffect(() => {
        if (artist?.name) {
            const newTitle = `${artist.name} | Discografía`;
            const description = `Explora la discografía completa de ${artist.name}, incluyendo todos sus álbumes y sencillos.`;
            const imageUrl = artist.images?.[0]?.url || '';
            
            document.title = newTitle;
            
            const updateMetaTag = (selector: string, content: string) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.setAttribute('content', content);
                }
            };
            
            updateMetaTag('meta[name="description"]', description);
            // Open Graph
            updateMetaTag('meta[property="og:title"]', newTitle);
            updateMetaTag('meta[property="og:description"]', description);
            updateMetaTag('meta[property="og:image"]', imageUrl);
            updateMetaTag('meta[property="og:url"]', window.location.href);
            // Twitter Card
            updateMetaTag('meta[property="twitter:title"]', newTitle);
            updateMetaTag('meta[property="twitter:description"]', description);
            updateMetaTag('meta[property="twitter:image"]', imageUrl);
            updateMetaTag('meta[property="twitter:url"]', window.location.href);
        }
    }, [artist]);


    const filteredAndSortedMergedAlbums = useMemo(() => {
        const sourceAlbums = sortOrder === 'random' ? shuffledMergedAlbums : mergedAlbums;

        const filtered = sourceAlbums.filter(album => {
            if (albumTypeFilter === 'all') return true;
            if (albumTypeFilter === 'album') return album.album_type === 'album' || album.album_type === 'compilation';
            if (albumTypeFilter === 'single') return album.album_type === 'single';
            return false;
        });

        if (sortOrder !== 'random') {
            return filtered.sort((a, b) => {
                const dateA = new Date(a.release_date).getTime();
                const dateB = new Date(b.release_date).getTime();
                
                if (isNaN(dateA)) return 1;
                if (isNaN(dateB)) return -1;

                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
        }
        
        return filtered;
    }, [mergedAlbums, shuffledMergedAlbums, sortOrder, albumTypeFilter]);

    const activeSince = useMemo(() => {
        if (spotifyAlbums.length === 0) return null;
        const oldestAlbum = [...spotifyAlbums].reduce((oldest, current) => {
            return new Date(current.release_date) < new Date(oldest.release_date) ? current : oldest;
        });
        return new Date(oldestAlbum.release_date).getFullYear();
    }, [spotifyAlbums]);
    
    const handleTrackPlay = (track: Track) => {
        if (track.preview_url) {
            if (playingTrack?.id === track.id) {
                setPlayingTrack(null); // Stop if clicking the same track
            } else {
                setPlayingTrack(track);
            }
        } else if(track.external_urls.spotify) {
            window.open(track.external_urls.spotify, '_blank');
        } else if(track.external_urls.youtube) {
             window.open(track.external_urls.youtube, '_blank');
        }
    };

    const renderContent = () => {
        if (loading) {
            return <SkeletonLoader />;
        }

        if (error) {
            return (
                <div className="flex items-center justify-center h-screen text-center text-red-400">
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-2">Error</h2>
                        <p>{error}</p>
                    </div>
                </div>
            );
        }

        if (mergedAlbums.length === 0) {
            return (
                 <div className="flex items-center justify-center h-screen text-center text-gray-400">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                         <h2 className="text-2xl font-bold mb-2">No se encontraron álbumes</h2>
                         <p>No se pudieron encontrar álbumes para el artista especificado.</p>
                    </div>
                 </div>
            );
        }

        const artistImageUrl = artist?.images?.[0]?.url;
        
        return (
            <div>
                <header className="bg-[#191414] p-6 mb-8">
                    <div>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {artistImageUrl && (
                                <img
                                    src={artistImageUrl}
                                    alt={artist?.name}
                                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg shadow-black/50 border-4 border-gray-800"
                                />
                            )}
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                <h1 className="text-4xl md:text-6xl font-bold text-white break-words">{artist?.name}</h1>
                                {activeSince && <p className="text-gray-400 text-lg mt-1">Activo desde {activeSince}</p>}
                                {artist?.genres && artist.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                                        {artist.genres.slice(0, 5).map(genre => (
                                            <span key={genre} className="bg-amber-400/20 text-amber-300 text-xs font-semibold capitalize px-3 py-1 rounded-full">{genre}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-6 flex justify-center sm:justify-start items-center gap-4">
                                    <span className="text-gray-400 font-semibold hidden sm:inline">Escuchar en:</span>
                                    {artist?.external_urls.spotify && (
                                        <a href={artist.external_urls.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="text-gray-400 hover:text-[#1DB954] transition-colors duration-300 transform hover:scale-110">
                                            <SpotifyIcon className="w-8 h-8" />
                                        </a>
                                    )}
                                    <a href="https://music.youtube.com/channel/UCUgy7ZKVVaxAnrAXCnLG7EA" target="_blank" rel="noopener noreferrer" aria-label="YouTube Music" className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300 transform hover:scale-110">
                                        <YoutubeMusicIcon className="w-8 h-8" />
                                    </a>
                                    <a href="https://music.apple.com/mx/artist/diosmasgym/1789494422" target="_blank" rel="noopener noreferrer" aria-label="Apple Music" className="text-gray-400 hover:text-[#f4f4f6] transition-colors duration-300 transform hover:scale-110">
                                        <AppleMusicIcon className="w-8 h-8" />
                                    </a>
                                    <a href="https://www.tiktok.com/@diosmasgym?lang=es" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors duration-300 transform hover:scale-110">
                                        <TiktokIcon className="w-8 h-8" />
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center mt-6 pt-6 border-t border-gray-800">
                            <StatCard label="Discografía" value={mergedAlbums.length} />
                            <StatCard label="Total de Pistas" value={totalTracks} />
                        </div>
                    </div>
                </header>
                
                <div className="px-6">
                    {upcomingRelease && <UpcomingReleaseCard release={upcomingRelease} />}
                    {topTracks.length > 0 && (
                        <TopTracks
                            title="Éxitos Populares en Spotify"
                            tracks={topTracks}
                            onTrackSelect={handleTrackPlay}
                            playingTrackId={playingTrack?.id}
                        />
                    )}
                    {youtubeTopTracks.length > 0 && (
                         <TopTracks
                            title="Populares en YouTube"
                            tracks={youtubeTopTracks}
                            onTrackSelect={handleTrackPlay}
                            playingTrackId={playingTrack?.id}
                        />
                    )}
                </div>

                <main className="mt-8 px-4 md:px-6">
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                        <h2 className="text-3xl font-bold text-white">Discografía</h2>

                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-1 bg-[#282828] p-1 rounded-full">
                                <button onClick={() => setAlbumTypeFilter('all')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${albumTypeFilter === 'all' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Todos</button>
                                <button onClick={() => setAlbumTypeFilter('album')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${albumTypeFilter === 'album' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Álbumes</button>
                                <button onClick={() => setAlbumTypeFilter('single')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${albumTypeFilter === 'single' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Sencillos</button>
                            </div>
                            <div className="flex items-center gap-1 bg-[#282828] p-1 rounded-full">
                                <button onClick={() => setSortOrder('newest')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sortOrder === 'newest' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Más Recientes</button>
                                <button onClick={() => setSortOrder('oldest')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sortOrder === 'oldest' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Más Antiguos</button>
                                <button onClick={() => setSortOrder('random')} className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${sortOrder === 'random' ? 'bg-amber-400 text-black' : 'text-gray-300 hover:bg-white/10'}`}>Aleatorio</button>
                            </div>
                        </div>
                    </div>
                    
                    {youtubeDataError && (
                        <div className="mb-6 text-sm text-yellow-300 bg-yellow-900/30 border border-yellow-700 rounded-md p-3">
                            <p><strong className="font-semibold">Aviso sobre YouTube:</strong> {youtubeDataError}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
                        {filteredAndSortedMergedAlbums.map(album => (
                           <AlbumCard key={album.id + '-' + album.source} album={album} />
                        ))}
                    </div>
                </main>
            </div>
        );
    };

    return (
        <div className="container mx-auto antialiased">
            {renderContent()}
            <ScrollToTopButton />
            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
        </div>
    );
};

export default App;
