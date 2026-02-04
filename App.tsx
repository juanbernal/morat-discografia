
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getArtistTopTracks as getYouTubeArtistTopTracks, getPlaylistItems } from './services/youtubeService';
import { getUpcomingRelease } from './services/releaseService';
import { getBlogReflections } from './services/bloggerService';
import type { Album, Artist, Track, UpcomingRelease, Video, BlogPost } from './types';
import AlbumCard from './components/AlbumCard';
import StatCard from './components/StatCard';
import TopTracks from './components/TopTracks';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import AudioPlayer from './components/AudioPlayer';
import UpcomingReleaseCard from './components/UpcomingReleaseCard';
import VideoCard from './components/VideoCard';
import TikTokFeed from './components/TikTokFeed';
import Biography from './components/Biography';
import VideoPlayerModal from './components/VideoPlayerModal';
import BiblicalEasterEgg from './components/BiblicalEasterEgg';
import PresaveModal from './components/PresaveModal';
import QuoteGeneratorModal from './components/QuoteGeneratorModal';
import CoverMaster from './components/CoverMaster';
import AlbumDetailModal from './components/AlbumDetailModal';
import QuickLinks from './components/QuickLinks';
import YoutubeMusicIcon from './components/YoutubeMusicIcon';
import SpotifyIcon from './components/SpotifyIcon';
import TiktokIcon from './components/TiktokIcon';
import RandomRecommendation from './components/RandomRecommendation';
import HiddenGems from './components/HiddenGems';
import BlogReflections from './components/BlogReflections';

const spotifyArtistId = "2mEoedcjDJ7x6SCVLMI4Do"; 
const YOUTUBE_MUSIC_URL = "https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow";

const App: React.FC = () => {
    const [spotifyAlbums, setSpotifyAlbums] = useState<Album[]>([]);
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [shuffledMergedAlbums, setShuffledMergedAlbums] = useState<Album[]>([]);
    const [artist, setArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [youtubeTopTracks, setYoutubeTopTracks] = useState<Track[]>([]);
    const [videos, setVideos] = useState<Video[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [totalTracks, setTotalTracks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'random'>('random');
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
    const [upcomingRelease, setUpcomingRelease] = useState<UpcomingRelease | null>(null);
    const [showUpcomingReleaseModal, setShowUpcomingReleaseModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showBioModal, setShowBioModal] = useState(false);
    const [showCoverMaster, setShowCoverMaster] = useState(false);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [artRes, albRes, topRes, upRes, ytTopRes, ytVidRes, blogRes] = await Promise.allSettled([
                getArtistDetails(spotifyArtistId),
                getArtistAlbums(spotifyArtistId),
                getSpotifyArtistTopTracks(spotifyArtistId),
                getUpcomingRelease(),
                getYouTubeArtistTopTracks(),
                getPlaylistItems(),
                getBlogReflections()
            ]);

            if (artRes.status === 'fulfilled') setArtist(artRes.value);
            if (albRes.status === 'fulfilled') {
                const unique = albRes.value.map(a => ({...a, source: 'spotify' as const}));
                setSpotifyAlbums(unique);
                setMergedAlbums(unique);
                setShuffledMergedAlbums([...unique].sort(() => Math.random() - 0.5));
                setTotalTracks(unique.reduce((s, a) => s + a.total_tracks, 0));
            }
            if (topRes.status === 'fulfilled') setTopTracks(topRes.value);
            if (upRes.status === 'fulfilled') setUpcomingRelease(upRes.value);
            if (ytTopRes.status === 'fulfilled') setYoutubeTopTracks(ytTopRes.value);
            if (ytVidRes.status === 'fulfilled') setVideos(ytVidRes.value);
            if (blogRes.status === 'fulfilled') setBlogPosts(blogRes.value);
        } catch (err) {
            setError("Ocurrió un error al cargar los datos.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchArtistData(); }, [fetchArtistData]);

    useEffect(() => {
        if (upcomingRelease) {
            const id = `${upcomingRelease.name}-${upcomingRelease.releaseDate}`;
            if (localStorage.getItem('seenUpcomingReleaseIdentifier') !== id) {
                setShowUpcomingReleaseModal(true);
            }
        }
    }, [upcomingRelease]);

    const newestAlbumId = useMemo(() => {
        if (mergedAlbums.length === 0) return null;
        return [...mergedAlbums].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())[0]?.id;
    }, [mergedAlbums]);

    const filteredAndSortedAlbums = useMemo(() => {
        let albums = searchQuery ? mergedAlbums.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) : [...shuffledMergedAlbums];
        if (!searchQuery) {
            if (albumTypeFilter !== 'all') albums = albums.filter(a => a.album_type === albumTypeFilter);
            if (sortOrder === 'newest') albums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            else if (sortOrder === 'oldest') albums.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        }
        return albums;
    }, [shuffledMergedAlbums, mergedAlbums, albumTypeFilter, sortOrder, searchQuery]);

    const filteredTracks = useMemo(() => [...topTracks, ...youtubeTopTracks].filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())), [topTracks, youtubeTopTracks, searchQuery]);

    const handleTrackSelect = (track: Track) => setPlayingTrack(playingTrack?.id === track.id ? null : track);
    const handleCloseUpcomingReleaseModal = () => {
        setShowUpcomingReleaseModal(false);
        if (upcomingRelease) localStorage.setItem('seenUpcomingReleaseIdentifier', `${upcomingRelease.name}-${upcomingRelease.releaseDate}`);
    };

    if (loading) return (<div className="max-w-screen-2xl mx-auto px-4 md:px-6"><SkeletonLoader /></div>);
    if (error) return (<div className="flex items-center justify-center h-screen text-red-400 text-center px-4">{error}</div>);

    return (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-24 font-sans text-white selection:bg-blue-500/30">
            
            <nav className="sticky top-4 z-[45] mb-8">
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-full px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <BiblicalEasterEgg>
                            <img 
                                src={artist?.images?.[0]?.url} 
                                alt="Logo" 
                                onClick={() => setShowBioModal(true)}
                                className="w-10 h-10 rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform shadow-lg shadow-blue-500/20" 
                            />
                        </BiblicalEasterEgg>
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                placeholder="Buscar música, vídeos, reflexiones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 text-sm rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 transition-all"
                            />
                            <svg className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowCoverMaster(true)} className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                            CoverMaster
                        </button>
                        <button onClick={() => setShowQuoteModal(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95">
                            ✨ Crear Frase
                        </button>
                    </div>
                </div>
            </nav>

            {upcomingRelease && !searchQuery ? (
                <UpcomingReleaseCard release={upcomingRelease} />
            ) : (
                <header className="mb-24 py-16 flex flex-col items-center text-center animate-fade-in">
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 mb-8 leading-tight lg:leading-[0.8]">
                        {artist?.name}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-16 mb-12">
                        <StatCard label="Seguidores" value={artist?.followers?.total?.toLocaleString() || '0'} />
                        <StatCard label="Pop." value={`${artist?.popularity || 0}%`} />
                        <StatCard label="Tracks" value={totalTracks} />
                    </div>
                    <div className="flex gap-6">
                         <a href={artist?.external_urls.spotify} target="_blank" rel="noopener" className="p-4 bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-white rounded-2xl border border-[#1DB954]/20 transition-all shadow-xl hover:scale-110 active:scale-90"><SpotifyIcon className="w-7 h-7" /></a>
                         <a href={YOUTUBE_MUSIC_URL} target="_blank" rel="noopener" className="p-4 bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white rounded-2xl border border-[#FF0000]/20 transition-all shadow-xl hover:scale-110 active:scale-90"><YoutubeMusicIcon className="w-7 h-7" /></a>
                         <a href="https://www.tiktok.com/@diosmasgym" target="_blank" rel="noopener" className="p-4 bg-white/5 hover:bg-black text-white rounded-2xl border border-white/10 transition-all shadow-xl hover:scale-110 active:scale-90"><TiktokIcon className="w-7 h-7" /></a>
                    </div>
                </header>
            )}

            {!searchQuery && blogPosts.length > 0 && (
                <BlogReflections posts={blogPosts} />
            )}

            {!searchQuery && <QuickLinks albums={mergedAlbums} />}

            {!searchQuery && (mergedAlbums.length > 0 || topTracks.length > 0) && (
                <RandomRecommendation 
                    albums={mergedAlbums} 
                    tracks={topTracks}
                    onTrackSelect={handleTrackSelect}
                    onAlbumSelect={setSelectedAlbum}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-24">
                    {searchQuery ? (
                        <section className="space-y-16 min-h-[60vh]">
                            <h2 className="text-4xl font-black">Resultados para <span className="text-blue-500">"{searchQuery}"</span></h2>
                            {filteredTracks.length > 0 && (
                                <div className="bg-slate-900/50 rounded-[2.5rem] p-8 border border-white/5 shadow-inner">
                                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Canciones Encontradas</h3>
                                    <TopTracks tracks={filteredTracks} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 md:gap-8">
                                {filteredAndSortedAlbums.map(album => (
                                    <AlbumCard key={album.id} album={album} onSelect={setSelectedAlbum} isNewest={album.id === newestAlbumId} />
                                ))}
                            </div>
                        </section>
                    ) : (
                        <>
                            {videos.length > 0 && (
                                <section>
                                    <div className="flex items-center justify-between mb-10">
                                        <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4">
                                            <div className="w-2 h-10 bg-red-600 rounded-full"></div>
                                            Videoclips <span className="text-red-600">Oficiales</span>
                                        </h2>
                                        <a href="https://www.youtube.com/@Diosmasgym" target="_blank" className="bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">Ver Todos</a>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                        {videos.slice(0, 4).map(v => <VideoCard key={v.id} video={v} onSelect={setSelectedVideo} />)}
                                    </div>
                                </section>
                            )}

                            {!searchQuery && topTracks.length > 0 && (
                                <HiddenGems 
                                    tracks={topTracks} 
                                    onTrackSelect={handleTrackSelect} 
                                    playingTrackId={playingTrack?.id} 
                                />
                            )}

                            <section>
                                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-2 h-10 bg-blue-600 rounded-full"></div>
                                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Discografía <span className="text-blue-500">Completa</span></h2>
                                    </div>
                                    <div className="flex bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-3xl overflow-x-auto no-scrollbar shadow-xl">
                                        {(['all', 'album', 'single'] as const).map(type => (
                                            <button 
                                                key={type} 
                                                onClick={() => setAlbumTypeFilter(type)} 
                                                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${albumTypeFilter === type ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {type === 'all' ? 'Todo' : type === 'album' ? 'Álbumes' : 'Sencillos'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
                                    {filteredAndSortedAlbums.map(album => (
                                        <AlbumCard 
                                            key={album.id} 
                                            album={album} 
                                            onSelect={setSelectedAlbum} 
                                            isNewest={album.id === newestAlbumId} 
                                        />
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </div>

                <aside className="lg:col-span-4 space-y-24">
                    <section className="bg-slate-900/40 rounded-[2.5rem] p-8 border border-white/5 backdrop-blur-3xl lg:sticky lg:top-24 shadow-2xl">
                        <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
                            <SpotifyIcon className="w-7 h-7 text-green-500" /> Éxitos <span className="text-green-500">Top</span>
                        </h2>
                        <TopTracks tracks={topTracks} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />
                        
                        <div className="h-px w-full bg-white/5 my-16"></div>
                        
                        <TikTokFeed />
                    </section>
                </aside>
            </div>

            <footer className="mt-48 pt-20 border-t border-white/5 flex flex-col items-center">
                <p className="text-gray-600 text-[11px] font-black uppercase tracking-[0.5em]">&copy; {new Date().getFullYear()} Diosmasgym Digital. Fe + Disciplina.</p>
            </footer>

            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
            <ScrollToTopButton />
            {selectedVideo && <VideoPlayerModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
            {selectedAlbum && <AlbumDetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />}
            {upcomingRelease && showUpcomingReleaseModal && <PresaveModal release={upcomingRelease} onClose={handleCloseUpcomingReleaseModal} />}
            {showQuoteModal && <QuoteGeneratorModal onClose={() => setShowQuoteModal(false)} albums={spotifyAlbums} />}
            {showCoverMaster && <CoverMaster onClose={() => setShowCoverMaster(false)} />}
            {showBioModal && <Biography onClose={() => setShowBioModal(false)} />}
        </div>
    );
};

export default App;
