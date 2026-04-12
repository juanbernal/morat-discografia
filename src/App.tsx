import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from './services/spotifyService';
import { getCatalogFromSheet } from './services/catalogService';
import { getUpcomingReleases } from './services/releaseService';
import type { Album, Artist, Track, UpcomingRelease } from './types';

// Components
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import SocialHub from './components/SocialHub';
import FeaturedArtistSection from './components/FeaturedArtistSection';
import ReleaseCountdown from './components/ReleaseCountdown';
import ShuffleDiscovery from './components/ShuffleDiscovery';
import AlbumCard from './components/AlbumCard';
import TopTracks from './components/TopTracks';
import SkeletonLoader from './components/SkeletonLoader';
import ScrollToTopButton from './components/ScrollToTopButton';
import Biography from './components/Biography';
import AlbumDetailModal from './components/AlbumDetailModal';
import SpotifyIcon from './components/SpotifyIcon';
import PresaveModal from './components/PresaveModal';
import ContactForm from './components/ContactForm';
import ArtistProfile from './components/ArtistProfile';
import BottomPlayer from './components/BottomPlayer';
import { useLanguage } from './contexts/LanguageContext';
import EdifyingGenreRecommendation from './components/EdifyingGenreRecommendation';
import TikTokFeed from './components/TikTokFeed';

const ARTIST_IDS = ["2mEoedcjDJ7x6SCVLMI4Do"];
const MAIN_ARTIST_ID = ARTIST_IDS[0];

const App: React.FC = () => {
    const { t, language, toggleLanguage } = useLanguage();
    const [mergedAlbums, setMergedAlbums] = useState<Album[]>([]);
    const [newestAlbumIds, setNewestAlbumIds] = useState<Set<string>>(new Set());
    const [mainArtist, setMainArtist] = useState<Artist | null>(null);
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [albumTypeFilter, setAlbumTypeFilter] = useState<'all' | 'album' | 'single'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(18);

    const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [showBioModal, setShowBioModal] = useState(false);
    const [showLanding, setShowLanding] = useState(false);
    const [currentReleasesHash, setCurrentReleasesHash] = useState('');
    const [selectedArtistRosterId, setSelectedArtistRosterId] = useState<string | null>(null);
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [notificationsActive, setNotificationsActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        const savedNotify = localStorage.getItem('dmg_notifications_v1');
        if (savedNotify === 'true') setNotificationsActive(true);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchArtistData = useCallback(async () => {
        setLoading(true);
        try {
            const upRes = await getUpcomingReleases().catch(() => []);
            setUpcomingReleases(upRes);
            if (upRes.length > 0) {
                const hash = upRes.map(r => r.name + r.releaseDate).join('|');
                setCurrentReleasesHash(hash);
                const lastAcknowledgedHash = localStorage.getItem('dmg_last_releases_hash');
                const sessionFlag = sessionStorage.getItem('dmg_landing_shown_session');
                if (hash !== lastAcknowledgedHash && !sessionFlag) setShowLanding(true);
            }

            const [artRes, albumResults, spotifyTopTracksResults, sheetTracks] = await Promise.all([
                getArtistDetails(MAIN_ARTIST_ID).catch(() => null),
                Promise.all(ARTIST_IDS.map(id => getArtistAlbums(id).catch(() => []))),
                Promise.all(ARTIST_IDS.map(id => getSpotifyArtistTopTracks(id).catch(() => []))),
                getCatalogFromSheet().catch(() => [])
            ]);

            if (artRes) setMainArtist(artRes);

            const allTracksArray = [...sheetTracks, ...spotifyTopTracksResults.flat()];
            setTopTracks(allTracksArray.slice(0, 10));

            const albumMap = new Map<string, Album>();
            sheetTracks.forEach(t => albumMap.set(t.album.id, t.album));
            albumResults.flat().forEach(a => {
               if (!Array.from(albumMap.values()).some(existing => existing.name.toLowerCase() === a.name.toLowerCase())) {
                   albumMap.set(a.id, a);
               }
            });
            setMergedAlbums(Array.from(albumMap.values()));
            setNewestAlbumIds(new Set(sheetTracks.slice(0, 5).map(t => t.album.id)));
        } catch (err) {
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
        return albums;
    }, [mergedAlbums, albumTypeFilter, searchQuery]);

    const displayedAlbums = useMemo(() => catalogAlbums.slice(0, visibleCount), [catalogAlbums, visibleCount]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200">
            {loading && !mainArtist && mergedAlbums.length === 0 ? (
                <div className="flex h-screen items-center justify-center"><SkeletonLoader /></div>
            ) : (
                <div className="relative">
                    <Navigation
                        scrolled={scrolled}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        language={language}
                        onLanguageToggle={toggleLanguage}
                        notificationsActive={notificationsActive}
                        onNotificationsToggle={() => setNotificationsActive(!notificationsActive)}
                        onBioClick={() => setShowBioModal(true)}
                        t={t}
                    />

                    <AnimatePresence>
                        {showLanding && upcomingReleases.length > 0 && (
                            <PresaveModal releases={upcomingReleases} onClose={handleCloseLanding} />
                        )}
                    </AnimatePresence>

                    {!searchQuery && !selectedArtistRosterId && (
                        <HeroSection onActionClick={() => {
                            document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                        }} />
                    )}

                    <main className="max-w-7xl mx-auto px-4 md:px-8 pb-32">
                        {selectedArtistRosterId ? (
                            <ArtistProfile
                                artistId={selectedArtistRosterId}
                                albums={mergedAlbums}
                                tracks={topTracks}
                                onBack={() => setSelectedArtistRosterId(null)}
                                onAlbumSelect={setSelectedAlbum}
                                onTrackSelect={setActiveTrack}
                            />
                        ) : (
                            <div className="space-y-32 mt-20">

                                {/* 1. Próximo Estreno (con miniatura y contador) */}
                                {!searchQuery && upcomingReleases.length > 0 && (
                                    <ReleaseCountdown release={upcomingReleases[0]} />
                                )}

                                {/* 2. Social Hub - arriba */}
                                {!searchQuery && <SocialHub />}

                                {/* 3. Propuesta Diferente / Featured Artist */}
                                {!searchQuery && <FeaturedArtistSection />}

                                {/* 4. Descubrimiento Aleatorio - Escucha mi música */}
                                {!searchQuery && mergedAlbums.length > 0 && (
                                    <ShuffleDiscovery albums={mergedAlbums} onTrackSelect={setActiveTrack} />
                                )}

                                {/* 5. Catálogo Oficial */}
                                <section id="catalog-section">
                                    <div className="flex flex-col sm:flex-row items-center justify-between mb-16 gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                                            <h2 className="text-4xl font-black tracking-tighter uppercase">Catálogo <span className="text-white/20">Oficial</span></h2>
                                        </div>
                                        <div className="flex glass p-1.5 rounded-2xl">
                                            {(['all', 'album', 'single'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    onClick={() => { setAlbumTypeFilter(type); setVisibleCount(18); }}
                                                    className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${albumTypeFilter === type ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                                >
                                                    {type === 'all' ? 'Todos' : type === 'album' ? 'Álbumes' : 'Sencillos'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                                        {displayedAlbums.map((album) => (
                                            <AlbumCard key={album.id} album={album} onSelect={setSelectedAlbum} onTrackSelect={setActiveTrack} isNewest={newestAlbumIds.has(album.id)} />
                                        ))}
                                    </div>
                                    {visibleCount < catalogAlbums.length && (
                                        <div className="mt-20 flex justify-center">
                                            <button onClick={() => setVisibleCount(v => v + 18)} className="px-16 py-6 rounded-3xl glass border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all">
                                                Cargar Más
                                            </button>
                                        </div>
                                    )}
                                </section>

                                {/* 6. Top Hits + TikTok */}
                                {topTracks.length > 0 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                        <div className="lg:col-span-8">
                                            <section className="glass rounded-[4rem] p-8 md:p-12 border border-white/5 shadow-2xl h-full">
                                                <h2 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                                                    <div className="p-3 bg-green-500/10 rounded-full"><SpotifyIcon className="w-8 h-8 text-green-500" /></div>
                                                    Top <span className="text-green-500">Hits</span>
                                                </h2>
                                                <TopTracks tracks={topTracks} onTrackSelect={setActiveTrack} />
                                            </section>
                                        </div>
                                        <div className="lg:col-span-4 flex flex-col gap-6">
                                            <TikTokFeed />
                                            <div className="flex-grow glass rounded-[3rem] p-8 border border-white/5">
                                                <StatsSection />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <EdifyingGenreRecommendation />
                                <ContactForm albums={mergedAlbums} tracks={topTracks} />
                            </div>
                        )}
                    </main>

                    <ScrollToTopButton />
                    {selectedAlbum && <AlbumDetailModal album={selectedAlbum} onTrackSelect={setActiveTrack} onClose={() => setSelectedAlbum(null)} />}
                    <BottomPlayer track={activeTrack} onClose={() => setActiveTrack(null)} />
                    {showBioModal && <Biography onClose={() => setShowBioModal(false)} />}
                </div>
            )}
        </div>
    );
};

export default App;
