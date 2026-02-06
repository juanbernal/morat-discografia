
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getUpcomingReleases } from './services/releaseService';
import { getBlogReflections } from './services/bloggerService';
import type { Album, Artist, Track, UpcomingRelease, BlogPost } from './types';
import AlbumCard from './components/AlbumCard';
import TopTracks from './components/TopTracks';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import AudioPlayer from './components/AudioPlayer';
import UpcomingReleaseCard from './components/UpcomingReleaseCard';
import TikTokFeed from './components/TikTokFeed';
import Biography from './components/Biography';
import BiblicalEasterEgg from './components/BiblicalEasterEgg';
import QuoteGeneratorModal from './components/QuoteGeneratorModal';
import CoverMaster from './components/CoverMaster';
import AlbumDetailModal from './components/AlbumDetailModal';
import QuickLinks from './components/QuickLinks';
import YoutubeMusicIcon from './components/YoutubeMusicIcon';
import SpotifyIcon from './components/SpotifyIcon';
import AppleMusicIcon from './components/AppleMusicIcon';
import TiktokIcon from './components/TiktokIcon';
import BlogReflections from './components/BlogReflections';
import PresaveModal from './components/PresaveModal';
import RandomRecommendation from './components/RandomRecommendation';
import EvolutionTimeline from './components/EvolutionTimeline';
import ContactForm from './components/ContactForm';

const ARTIST_IDS = ["2mEoedcjDJ7x6SCVLMI4Do", "0vEKa5AOcBkQVXNfGb2FNh"]; 
const MAIN_ARTIST_ID = ARTIST_IDS[0];

const SOCIAL_LINKS = {
    diosmasgym: {
        spotify: "https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do",
        youtube: "https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow",
        instagram: "https://www.instagram.com/diosmasgym",
        tiktok: "https://tiktok.com/@diosmasgym"
    },
    juan614: {
        spotify: "https://open.spotify.com/artist/0vEKa5AOcBkQVXNfGb2FNh",
        youtube: "https://music.youtube.com/search?q=Juan+614",
        apple: "https://music.apple.com/us/artist/juan-614/1870721488",
        tiktok: "https://www.tiktok.com/@juan614oficial"
    }
};

const App: React.FC = () => {
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [newestAlbumIds, setNewestAlbumIds] = useState<Set<string>>(new Set());
    const [mainArtist, setMainArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
    const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showBioModal, setShowBioModal] = useState(false);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [showLanding, setShowLanding] = useState(false);
    const [currentReleasesHash, setCurrentReleasesHash] = useState('');

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        try {
            const [upRes, blogRes] = await Promise.all([
                getUpcomingReleases().catch(() => []),
                getBlogReflections().catch(() => [])
            ]);
            setUpcomingReleases(upRes);
            setBlogPosts(blogRes);

            if (upRes.length > 0) {
                const hash = upRes.map(r => r.name + r.releaseDate).join('|');
                setCurrentReleasesHash(hash);
                const lastAcknowledgedHash = localStorage.getItem('dmg_last_releases_hash');
                const sessionFlag = sessionStorage.getItem('dmg_landing_shown_session');
                if (hash !== lastAcknowledgedHash && !sessionFlag) {
                    setShowLanding(true);
                }
            }

            const artRes = await getArtistDetails(MAIN_ARTIST_ID).catch(() => null);
            if (artRes) setMainArtist(artRes);

            const albumResults = await Promise.all(
                ARTIST_IDS.map(id => getArtistAlbums(id).catch(() => []))
            );
            
            const allAlbums = albumResults.flat();
            if (allAlbums.length > 0) {
                const uniqueAlbums = Array.from(new Map(allAlbums.map(a => [a.id, a])).values());
                const sortedByDate = [...uniqueAlbums].sort((a, b) => 
                    new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                );
                const newestIds = new Set(sortedByDate.slice(0, 5).map(a => a.id));
                setNewestAlbumIds(newestIds);
                setMergedAlbums(uniqueAlbums);
                
                const topRes = await getSpotifyArtistTopTracks(MAIN_ARTIST_ID).catch(() => []);
                setTopTracks(topRes);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
            setError("Error de sincronización.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchArtistData(); }, [fetchArtistData]);

    const handleCloseLanding = () => {
        setShowLanding(false);
        localStorage.setItem('dmg_last_releases_hash', currentReleasesHash);
        sessionStorage.setItem('dmg_landing_shown_session', 'true');
    };

    const filteredAndSortedAlbums = useMemo(() => {
        const sorted = [...mergedAlbums].sort(() => Math.random() - 0.5);
        let albums = searchQuery ? sorted.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) : sorted;
        if (!searchQuery && albumTypeFilter !== 'all') {
            albums = albums.filter(a => a.album_type === albumTypeFilter);
        }
        return albums;
    }, [mergedAlbums, albumTypeFilter, searchQuery]);

    const handleTrackSelect = (track: Track) => setPlayingTrack(playingTrack?.id === track.id ? null : track);

    if (loading) return (<div className="max-w-screen-2xl mx-auto px-4"><SkeletonLoader /></div>);

    return (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-24 font-sans text-white selection:bg-blue-500/30">
            {showLanding && upcomingReleases.length > 0 && (
                <PresaveModal releases={upcomingReleases} onClose={handleCloseLanding} />
            )}

            <nav className="sticky top-4 z-[45] mb-12">
                <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <BiblicalEasterEgg>
                            <img 
                                src={mainArtist?.images?.[0]?.url || '/logo.png'} 
                                alt="Logo" 
                                onClick={() => setShowBioModal(true)}
                                className="w-10 h-10 rounded-full border border-white/20 cursor-pointer hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20" 
                            />
                        </BiblicalEasterEgg>
                        <h1 className="hidden sm:block text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">
                            Diosmasgym Records
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowQuoteModal(true)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95">
                            Crear Frase
                        </button>
                    </div>
                </div>
            </nav>

            {!searchQuery && (
                <header className="mb-24 text-center animate-fade-in py-10">
                     <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Official Artist Discography</p>
                     <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-20 drop-shadow-2xl">
                        Diosmasgym <span className="text-white/20">Records</span>
                     </h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                         {/* Social link blocks code here as before... */}
                     </div>
                </header>
            )}

            {!searchQuery && upcomingReleases.length > 0 && (
                <section className="mb-32 space-y-16 animate-fade-in">
                    <div className="flex items-center gap-4 px-2">
                         <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                         <h2 className="text-4xl font-black tracking-tighter uppercase">Próximos <span className="text-blue-500">Estrenos</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {upcomingReleases.map((release, idx) => (
                            <UpcomingReleaseCard key={`release-${idx}`} release={release} />
                        ))}
                    </div>
                </section>
            )}

            <div className="space-y-32">
                {!searchQuery && blogPosts.length > 0 && <BlogReflections posts={blogPosts} />}
                
                {/* Nueva Sección: Call to Action Evolución (En lugar de la lista directa) */}
                {!searchQuery && mergedAlbums.length > 0 && (
                    <section className="relative h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden group">
                        <img src={mergedAlbums[0]?.images[0]?.url} className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-1000 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                            <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] mb-4">The Legacy</span>
                            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-none">Descubre nuestra <br/> <span className="text-blue-600">Historia completa</span></h2>
                            <button 
                                onClick={() => setShowTimelineModal(true)}
                                className="bg-white text-black font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
                            >
                                Explorar Evolución
                            </button>
                        </div>
                    </section>
                )}

                {!searchQuery && (
                    <RandomRecommendation 
                        albums={mergedAlbums} 
                        tracks={topTracks} 
                        onAlbumSelect={setSelectedAlbum} 
                        onTrackSelect={handleTrackSelect} 
                    />
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-8 space-y-24">
                        <section>
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8">
                                <h2 className="text-4xl font-black tracking-tighter uppercase">Catálogo <span className="text-blue-500">Oficial</span></h2>
                                <div className="flex bg-slate-900 border border-white/10 p-1 rounded-full backdrop-blur-3xl">
                                    {(['all', 'album', 'single'] as const).map(type => (
                                        <button 
                                            key={type} 
                                            onClick={() => setAlbumTypeFilter(type)} 
                                            className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${albumTypeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
                                        >
                                            {type === 'all' ? 'Todo' : type === 'album' ? 'Álbumes' : 'Singles'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                                {filteredAndSortedAlbums.map((album) => {
                                    const isJuan = album.artists.some(a => a.name.toLowerCase().includes('614'));
                                    const isTrulyNew = newestAlbumIds.has(album.id);
                                    return (
                                        <div key={album.id} className="relative group">
                                            {isTrulyNew && (
                                                <div className={`absolute -top-3 -right-3 z-30 px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-2xl border border-white/20 transform rotate-12 group-hover:rotate-0 transition-transform
                                                    ${isJuan ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'}`}>
                                                    NUEVO {isJuan ? 'JUAN 614' : 'DIOSMASGYM'}
                                                </div>
                                            )}
                                            <AlbumCard album={album} onSelect={setSelectedAlbum} isNewest={isTrulyNew} />
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4 space-y-24">
                        <section className="bg-[#050b18] rounded-[3rem] p-10 border border-white/5 shadow-3xl backdrop-blur-3xl">
                            <h2 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                                <SpotifyIcon className="w-8 h-8 text-[#1DB954]" /> Top <span className="text-[#1DB954]">Hits</span>
                            </h2>
                            <TopTracks tracks={topTracks} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />
                            <div className="h-px w-full bg-white/5 my-16"></div>
                            <TikTokFeed />
                        </section>
                    </aside>
                </div>

                {!searchQuery && <ContactForm />}
            </div>

            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
            <ScrollToTopButton />
            
            {/* Modal de Evolución */}
            {showTimelineModal && (
                <div className="fixed inset-0 z-[160] bg-slate-950 overflow-y-auto animate-fade-in custom-scrollbar">
                    <div className="sticky top-0 z-[170] p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
                        <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.5em]">Diosmasgym Records History</h3>
                        <button onClick={() => setShowTimelineModal(false)} className="bg-white/5 p-4 rounded-full text-white border border-white/10">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <EvolutionTimeline albums={mergedAlbums} onSelect={(a) => { setSelectedAlbum(a); setShowTimelineModal(false); }} />
                </div>
            )}

            {selectedAlbum && <AlbumDetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />}
            {showQuoteModal && <QuoteGeneratorModal onClose={() => setShowQuoteModal(false)} albums={mergedAlbums} />}
            {showBioModal && <Biography onClose={() => setShowBioModal(false)} />}
        </div>
    );
};

export default App;
