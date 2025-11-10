import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks } from './services/spotifyService';
import type { Album, Artist, Track } from './types';
import AlbumCard from './components/AlbumCard';
import StatCard from './components/StatCard';
import TopTracks from './components/TopTracks';
import SpotifyIcon from './components/SpotifyIcon';
import YoutubeMusicIcon from './components/YoutubeMusicIcon';
import AmazonMusicIcon from './components/AmazonMusicIcon';
import TiktokIcon from './components/TiktokIcon';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import AudioPlayer from './components/AudioPlayer';

const artistId = "2mEoedcjDJ7x6SCVLMI4Do"; // Morat

const App: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [shuffledAlbums, setShuffledAlbums] = useState<Album[]>([]);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [totalTracks, setTotalTracks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'random'>('random');
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [isScrolled, setIsScrolled] = useState(false);
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [artistDetails, fetchedAlbums, fetchedTopTracks] = await Promise.all([
                getArtistDetails(artistId),
                getArtistAlbums(artistId),
                getArtistTopTracks(artistId),
            ]);

            setArtist(artistDetails);
            setTopTracks(fetchedTopTracks);
            
            const uniqueAlbums = Array.from(
                fetchedAlbums.reduce((map, album) => map.set(album.id, album), new Map<string, Album>()).values()
            );

            setAlbums(uniqueAlbums);

            const shuffled = [...uniqueAlbums];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            setShuffledAlbums(shuffled);

            if (uniqueAlbums.length > 0) {
                const total = uniqueAlbums.reduce((sum, album) => sum + album.total_tracks, 0);
                setTotalTracks(total);
            }
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
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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


    const filteredAndSortedAlbums = useMemo(() => {
        const sourceAlbums = sortOrder === 'random' ? shuffledAlbums : albums;

        const filtered = sourceAlbums.filter(album => {
            if (albumTypeFilter === 'all') return true;
            if (albumTypeFilter === 'album') return album.album_type === 'album' || album.album_type === 'compilation';
            if (albumTypeFilter === 'single') return album.album_type === 'single';
            return false;
        });

        if (sortOrder !== 'random') {
            return filtered.sort((a, b) => {
                const dateA = new Date(a.release_date).getTime();
                const dateB = a.release_date ? new Date(b.release_date).getTime() : 0;
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
        }
        
        return filtered;
    }, [albums, shuffledAlbums, sortOrder, albumTypeFilter]);

    const activeSince = useMemo(() => {
        if (albums.length === 0) return null;
        const oldestAlbum = [...albums].reduce((oldest, current) => {
            return new Date(current.release_date) < new Date(oldest.release_date) ? current : oldest;
        });
        return new Date(oldestAlbum.release_date).getFullYear();
    }, [albums]);
    
    const handleTrackPlay = (track: Track) => {
        if (track.preview_url) {
            if (playingTrack?.id === track.id) {
                setPlayingTrack(null); // Stop if clicking the same track
            } else {
                setPlayingTrack(track);
            }
        } else {
            // If no preview, open Spotify as a fallback
            window.open(track.external_urls.spotify, '_blank');
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

        if (albums.length === 0) {
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
            <>
                <header className={`sticky top-0 z-10 bg-[#191414]/80 backdrop-blur-md p-6 mb-8 transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/30' : ''}`}>
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            {artistImageUrl && (
                                <img
                                    src={artistImageUrl}
                                    alt={artist?.name}
                                    className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full shadow-lg shadow-black/50 border-4 border-gray-800"
                                />
                            )}
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-4xl md:text-6xl font-bold text-white">{artist?.name}</h1>
                                {activeSince && <p className="text-gray-400 text-lg mt-1">Activo desde {activeSince}</p>}
                                 {artist?.genres && artist.genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                                        {artist.genres.slice(0, 5).map(genre => (
                                            <span key={genre} className="bg-amber-400/20 text-amber-300 text-xs font-semibold capitalize px-3 py-1 rounded-full">{genre}</span>
                                        ))}
                                    </div>
                                )}
                                {artist?.external_urls.spotify && (
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-4">
                                        <a 
                                            href={artist.external_urls.spotify}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center bg-amber-400 text-black font-bold text-sm px-6 py-2.5 rounded-full transition-transform duration-200 hover:scale-105 hover:bg-amber-300"
                                        >
                                            <SpotifyIcon className="w-5 h-5 mr-2" />
                                            Seguir en Spotify
                                        </a>
                                        <div className="flex items-center gap-3">
                                            <a href="https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#383838] hover:text-white hover:scale-110" aria-label="YouTube Music">
                                                <YoutubeMusicIcon className="w-6 h-6" />
                                            </a>
                                            <a href="https://music.amazon.com/artists/B015L45A4S" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#383838] hover:text-white hover:scale-110" aria-label="Amazon Music">
                                                <AmazonMusicIcon className="w-6 h-6" />
                                            </a>
                                            <a href="https://www.tiktok.com/@moratbanda" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#282828] flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#383838] hover:text-white hover:scale-110" aria-label="TikTok">
                                                <TiktokIcon className="w-6 h-6" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center mt-6 pt-6 border-t border-gray-800">
                            <StatCard label="Seguidores" value={artist?.followers?.total.toLocaleString() ?? '...'} />
                            <StatCard label="Lanzamientos" value={albums.length} />
                            <StatCard label="Pistas Totales" value={totalTracks} />
                        </div>
                    </div>
                </header>

                {topTracks.length > 0 && <TopTracks tracks={topTracks} onTrackSelect={handleTrackPlay} playingTrackId={playingTrack?.id} />}

                <main className="mt-8">
                    <div className="px-2 mb-6 flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-3xl font-bold text-white">Discografía</h2>
                        <div className="flex flex-wrap gap-4">
                             <div className="inline-flex rounded-md shadow-sm bg-[#282828]" role="group">
                                <button onClick={() => setAlbumTypeFilter('all')} type="button" className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-l-lg transition-colors ${albumTypeFilter === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Todo</button>
                                <button onClick={() => setAlbumTypeFilter('album')} type="button" className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-600 transition-colors ${albumTypeFilter === 'album' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Álbumes</button>
                                <button onClick={() => setAlbumTypeFilter('single')} type="button" className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-r-lg transition-colors ${albumTypeFilter === 'single' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Sencillos</button>
                            </div>
                            <div className="inline-flex rounded-md shadow-sm bg-[#282828]" role="group">
                                <button onClick={() => setSortOrder('newest')} type="button" className={`px-4 py-2 text-sm font-medium border border-gray-600 rounded-l-lg transition-colors ${sortOrder === 'newest' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Más Recientes</button>
                                <button onClick={() => setSortOrder('oldest')} type="button" className={`px-4 py-2 text-sm font-medium border-t border-b border-gray-600 transition-colors ${sortOrder === 'oldest' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Más Antiguos</button>
                                <button onClick={() => setSortOrder('random')} type="button" className={`px-4 py-2 text-sm font-medium border-t border-b border-r border-gray-600 rounded-r-lg transition-colors ${sortOrder === 'random' ? 'bg-amber-400 text-black font-bold' : 'text-gray-300 hover:bg-gray-700'}`}>Aleatorio</button>
                            </div>
                        </div>
                    </div>

                    <div 
                        key={`${albumTypeFilter}-${sortOrder}`}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 animate-fade-in"
                    >
                        {filteredAndSortedAlbums.map(album => (
                            <AlbumCard key={album.id} album={album} />
                        ))}
                    </div>
                </main>
                <footer className="text-center py-8 mt-8 border-t border-gray-800 text-gray-500">
                    <p>Desarrollado con ❤️ para los fans de {artist?.name || 'la banda'}.</p>
                    <p className="text-sm mt-1">Datos proporcionados por la API de Spotify.</p>
                </footer>
            </>
        );
    };

    return (
        <div className={`min-h-screen p-4 md:p-6 font-sans ${playingTrack ? 'pb-28' : ''}`}>
            <div className="max-w-screen-2xl mx-auto">
                {renderContent()}
            </div>
            <ScrollToTopButton />
            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
        </div>
    );
};

export default App;