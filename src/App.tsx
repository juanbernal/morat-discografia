
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getCatalogFromSheet } from './services/catalogService';
import { getUpcomingReleases } from './services/releaseService';
import type { Album, Artist, Track, UpcomingRelease } from './types';
import AlbumCard from './components/AlbumCard';
import TopTracks from './components/TopTracks';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import UpcomingReleaseCard from './components/UpcomingReleaseCard';
import TikTokFeed from './components/TikTokFeed';
import Biography from './components/Biography';
import BiblicalEasterEgg from './components/BiblicalEasterEgg';
import QuoteGeneratorModal from './components/QuoteGeneratorModal';
import AlbumDetailModal from './components/AlbumDetailModal';
import SpotifyIcon from './components/SpotifyIcon';
import YoutubeMusicIcon from './components/YoutubeMusicIcon';
import AppleMusicIcon from './components/AppleMusicIcon';
import TiktokIcon from './components/TiktokIcon';
import PresaveModal from './components/PresaveModal';
import RandomRecommendation from './components/RandomRecommendation';
import EvolutionTimeline from './components/EvolutionTimeline';
import ContactForm from './components/ContactForm';
import FollowUsModal from './components/FollowUsModal';
import NewReleasesSlider from './components/NewReleasesSlider';

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

const ITEMS_PER_PAGE = 18;

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const BellIcon = ({ className, active }: { className?: string, active?: boolean }) => (
    <svg viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const App: React.FC = () => {
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [newestAlbumIds, setNewestAlbumIds] = useState<Set<string>>(new Set());
    const [mainArtist, setMainArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [sheetReleases, setSheetReleases] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [showBioModal, setShowBioModal] = useState(false);
    const [showTimelineModal, setShowTimelineModal] = useState(false);
    const [showLanding, setShowLanding] = useState(false);
    const [currentReleasesHash, setCurrentReleasesHash] = useState('');

    // Notificaciones
    const [notificationsActive, setNotificationsActive] = useState(false);
    const [showNotifyToast, setShowNotifyToast] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const savedNotify = localStorage.getItem('dmg_notifications_v1');
        if (savedNotify === 'true') setNotificationsActive(true);
    }, []);

    const toggleNotifications = () => {
        const newState = !notificationsActive;
        setNotificationsActive(newState);
        localStorage.setItem('dmg_notifications_v1', newState.toString());
        setShowNotifyToast(true);
        setTimeout(() => setShowNotifyToast(false), 3000);
    };

    const fetchArtistData = useCallback(async () => {
        console.log("App: Starting fetchArtistData...");
        setLoading(true);
        try {
            const [upRes] = await Promise.all([
                getUpcomingReleases().catch((e) => {
                    console.error("App: Error fetching upcoming releases:", e);
                    return [];
                })
            ]);

            console.log(`App: Fetched ${upRes.length} releases.`);
            setUpcomingReleases(upRes);

            if (upRes.length > 0) {
                const hash = upRes.map(r => r.name + r.releaseDate).join('|');
                setCurrentReleasesHash(hash);
                const lastAcknowledgedHash = localStorage.getItem('dmg_last_releases_hash');
                const sessionFlag = sessionStorage.getItem('dmg_landing_shown_session');
                if (hash !== lastAcknowledgedHash && !sessionFlag) {
                    setShowLanding(true);
                }
            }

            console.log("App: Fetching Spotify and Sheet data...");
            const [artRes, albumResults, spotifyTopTracksResults, sheetTracks] = await Promise.all([
                getArtistDetails(MAIN_ARTIST_ID).catch((e) => {
                    console.error("App: Error fetching artist details:", e);
                    return null;
                }),
                Promise.all(
                    ARTIST_IDS.map(id => getArtistAlbums(id).catch((e) => {
                        console.error(`App: Error fetching albums for artist ${id}:`, e);
                        return [];
                    }))
                ),
                Promise.all(
                    ARTIST_IDS.map(id => getSpotifyArtistTopTracks(id).catch((e) => {
                        console.error(`App: Error fetching Spotify top tracks for artist ${id}:`, e);
                        return [];
                    }))
                ),
                getCatalogFromSheet().catch((e) => {
                    console.error("App: Error fetching sheet tracks:", e);
                    return [];
                })
            ]);

            if (artRes) setMainArtist(artRes);

            const allSpotifyTracks = spotifyTopTracksResults.flat();
            const trackMap = new Map<string, Track>();

            allSpotifyTracks.forEach(t => trackMap.set(t.id, t));
            sheetTracks.forEach(t => {
                if (!trackMap.has(t.id)) {
                    trackMap.set(t.id, t);
                }
            });

            const allTracksArray = Array.from(trackMap.values());

            // Ensure Juan 614's tracks are explicitly boosted to the top of Top Hits so he isn't hidden
            const juanTracks = allTracksArray.filter(t => t.artists.some(a => a.name.toLowerCase().includes('juan 614') || a.id === "0vEKa5AOcBkQVXNfGb2FNh"));
            const otherTracks = allTracksArray.filter(t => !juanTracks.includes(t));

            setTopTracks([...juanTracks, ...otherTracks].slice(0, 5));
            // Ensure Juan 614 appears on the Nuevos Estrenos slider
            setSheetReleases([...juanTracks, ...sheetTracks]);

            const allAlbums = albumResults.flat();
            console.log(`App: Total albums fetched: ${allAlbums.length}`);
            if (allAlbums.length > 0) {
                const uniqueAlbums = Array.from(new Map(allAlbums.map(a => [a.id, a])).values());
                const sortedByDate = [...uniqueAlbums].sort((a, b) =>
                    new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                );
                const newestIds = new Set(sortedByDate.slice(0, 5).map(a => a.id));
                setNewestAlbumIds(newestIds);
                setMergedAlbums(uniqueAlbums);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err);
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

    const catalogAlbums = useMemo(() => {
        let albums = searchQuery
            ? mergedAlbums.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
            : [...mergedAlbums];

        if (!searchQuery && albumTypeFilter !== 'all') {
            albums = albums.filter(a => a.album_type === albumTypeFilter);
        }

        if (searchQuery) return albums;

        // Ensure Juan 614 albums always appear on the first page, mixed in with the shuffled Diosmasgym albums
        const juanAlbums = albums.filter(a => a.artists.some(ar => ar.name.toLowerCase().includes('juan 614') || ar.id === "0vEKa5AOcBkQVXNfGb2FNh"));
        const diosAlbums = albums.filter(a => !juanAlbums.includes(a));

        const shuffledDios = shuffleArray(diosAlbums);
        return [...juanAlbums, ...shuffledDios];
    }, [mergedAlbums, albumTypeFilter, searchQuery]);

    const searchTracks = useMemo(() => {
        if (!searchQuery) return [];
        const query = searchQuery.toLowerCase();
        const allTracks = [...topTracks, ...sheetReleases];
        const unique = Array.from(new Map(allTracks.map(t => [t.id, t])).values());
        return unique.filter(t => t.name.toLowerCase().includes(query) || t.artists.some(a => a.name.toLowerCase().includes(query)));
    }, [searchQuery, topTracks, sheetReleases]);

    const displayedAlbums = useMemo(() => {
        return catalogAlbums.slice(0, visibleCount);
    }, [catalogAlbums, visibleCount]);

    const hasMore = visibleCount < catalogAlbums.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30">
            {loading && !mainArtist && mergedAlbums.length === 0 ? (
                <div className="max-w-screen-2xl mx-auto px-4 pt-40">
                    <SkeletonLoader />
                </div>
            ) : (
                <div className="max-w-screen-2xl mx-auto px-4 md:px-6 pb-24 font-sans text-white">
                    {showLanding && upcomingReleases.length > 0 && (
                        <PresaveModal releases={upcomingReleases} onClose={handleCloseLanding} />
                    )}

                    {!showLanding && <FollowUsModal />}

                    {/* Toast de Notificaciones */}
                    {showNotifyToast && (
                        <div className="fixed top-24 right-6 z-[200] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-3 border border-white/20">
                            <BellIcon className="w-5 h-5" active />
                            <p className="text-[10px] font-black uppercase tracking-widest">
                                {notificationsActive ? '¡Notificaciones Activadas!' : 'Notificaciones Desactivadas'}
                            </p>
                        </div>
                    )}

                    <nav className={`sticky top-4 z-[45] mb-12 transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
                        <div className={`bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-2xl transition-all ${scrolled ? 'border-blue-500/30 shadow-blue-500/10' : ''}`}>
                            <div className="flex items-center gap-4">
                                <BiblicalEasterEgg>
                                    <img
                                        src="/diosmasgym_profile.jpg"
                                        alt="Logo"
                                        onClick={() => setShowBioModal(true)}
                                        className="w-10 h-10 rounded-full border border-white/20 cursor-pointer hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20"
                                    />
                                </BiblicalEasterEgg>
                                <h1 className="hidden sm:block text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">
                                    Diosmasgym Records
                                </h1>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-full py-2.5 px-4 pl-10 text-[10px] sm:text-xs font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 w-32 sm:w-48 md:w-64 transition-all shadow-inner"
                                    />
                                    <svg className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <button
                                    onClick={toggleNotifications}
                                    className={`p-2.5 rounded-full border transition-all ${notificationsActive ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                                    title={notificationsActive ? "Desactivar notificaciones" : "Activar notificaciones"}
                                >
                                    <BellIcon className="w-5 h-5" active={notificationsActive} />
                                </button>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-blue-500/20 backdrop-blur-xl flex flex-col items-center shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-transform hover:scale-[1.02]">
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Diosmasgym</span>
                                    <div className="flex gap-4">
                                        <a href={SOCIAL_LINKS.diosmasgym.spotify} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-[#1DB954]/20 transition-all"><SpotifyIcon className="w-5 h-5 text-[#1DB954]" /></a>
                                        <a href={SOCIAL_LINKS.diosmasgym.youtube} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-[#FF0000]/20 transition-all"><YoutubeMusicIcon className="w-5 h-5 text-[#FF0000]" /></a>
                                        <a href={SOCIAL_LINKS.diosmasgym.tiktok} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-white/20 transition-all"><TiktokIcon className="w-5 h-5 text-white" /></a>
                                    </div>
                                </div>
                                <div className="bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/30 backdrop-blur-xl flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-transform hover:scale-[1.02]">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Juan 614</span>
                                    <div className="flex gap-4">
                                        <a href={SOCIAL_LINKS.juan614.spotify} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-[#1DB954]/20 transition-all"><SpotifyIcon className="w-5 h-5 text-[#1DB954]" /></a>
                                        <a href={SOCIAL_LINKS.juan614.apple} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-[#FA243C]/20 transition-all"><AppleMusicIcon className="w-5 h-5 text-[#FA243C]" /></a>
                                        <a href={SOCIAL_LINKS.juan614.tiktok} target="_blank" className="p-3 bg-black/40 rounded-xl hover:bg-white/20 transition-all"><TiktokIcon className="w-5 h-5 text-white" /></a>
                                    </div>
                                </div>
                            </div>
                        </header>
                    )}

                    <div className="space-y-32">
                        {searchQuery && searchTracks.length > 0 && (
                            <section className="animate-fade-in mt-16 px-2">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-1.5 h-8 bg-[#1DB954] rounded-full shadow-[0_0_20px_rgba(29,185,84,0.6)]"></div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase">Canciones <span className="text-[#1DB954]">Encontradas</span></h2>
                                </div>
                                <div className="bg-[#050b18] rounded-[2rem] p-6 md:p-10 border border-white/5 shadow-2xl backdrop-blur-xl">
                                    <TopTracks tracks={searchTracks} />
                                </div>
                            </section>
                        )}

                        {!searchQuery && upcomingReleases.length > 0 && (
                            <section className="animate-fade-in">
                                <div className="flex items-center gap-4 mb-16 px-2">
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

                        {!searchQuery && sheetReleases.length > 0 && (
                            <NewReleasesSlider releases={sheetReleases} />
                        )}

                        {!searchQuery && (
                            <RandomRecommendation
                                albums={mergedAlbums}
                                tracks={topTracks}
                                onAlbumSelect={setSelectedAlbum}
                                onTrackSelect={() => { }}
                            />
                        )}

                        <section id="catalogo">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                                    <h2 className="text-4xl font-black tracking-tighter uppercase">Catálogo <span className="text-blue-500">Oficial</span></h2>
                                </div>
                                <div className="flex bg-slate-900 border border-white/10 p-1.5 rounded-2xl backdrop-blur-3xl">
                                    {(['all', 'album', 'single'] as const).map(type => (
                                        <button
                                            key={type}
                                            onClick={() => { setAlbumTypeFilter(type); setVisibleCount(ITEMS_PER_PAGE); }}
                                            className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${albumTypeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                        >
                                            {type === 'all' ? 'Todo' : type === 'album' ? 'Álbumes' : 'Singles'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8">
                                {displayedAlbums.map((album) => (
                                    <AlbumCard
                                        key={album.id}
                                        album={album}
                                        onSelect={setSelectedAlbum}
                                        isNewest={newestAlbumIds.has(album.id)}
                                    />
                                ))}
                            </div>

                            {hasMore && (
                                <div className="mt-20 flex justify-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="group relative bg-white/5 border border-white/10 hover:border-blue-500/50 px-16 py-6 rounded-3xl transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">
                                            Cargar más lanzamientos
                                        </span>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                                    </button>
                                </div>
                            )}
                        </section>

                        {topTracks.length > 0 && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                <div className="lg:col-span-8">
                                    <section className="bg-[#050b18] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-3xl backdrop-blur-3xl h-full">
                                        <h2 className="text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                                            <div className="p-2 bg-[#1DB954]/10 rounded-full"><SpotifyIcon className="w-8 h-8 text-[#1DB954]" /></div> Top <span className="text-[#1DB954]">Hits</span>
                                        </h2>
                                        <TopTracks tracks={topTracks} />
                                    </section>
                                </div>
                                <div className="lg:col-span-4">
                                    <TikTokFeed />
                                </div>
                            </div>
                        )}

                        {!searchQuery && <ContactForm albums={mergedAlbums} tracks={topTracks} />}
                    </div>

                    <ScrollToTopButton />

                    {showTimelineModal && (
                        <div className="fixed inset-0 z-[160] bg-slate-950 overflow-y-auto animate-fade-in custom-scrollbar">
                            <div className="sticky top-0 z-[170] p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md">
                                <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.5em]">Diosmasgym Records History</h3>
                                <button onClick={() => setShowTimelineModal(false)} className="bg-white/5 p-4 rounded-full text-white border border-white/10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            <div className="pb-32">
                                <EvolutionTimeline albums={mergedAlbums} onSelect={(a) => { setSelectedAlbum(a); setShowTimelineModal(false); }} />
                            </div>
                        </div>
                    )}

                    {selectedAlbum && <AlbumDetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}
                    {showQuoteModal && <QuoteGeneratorModal onClose={() => setShowQuoteModal(false)} albums={mergedAlbums} />}
                    {showBioModal && <Biography onClose={() => setShowBioModal(false)} />}
                </div>
            )}
        </div>
    );
};

export default App;
