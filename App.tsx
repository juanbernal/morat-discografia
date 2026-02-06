
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
    const [showCoverMaster, setShowCoverMaster] = useState(false);
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
                
                // Identificar los 5 lanzamientos más recientes POR FECHA
                const sortedByDate = [...uniqueAlbums].sort((a, b) => 
                    new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                );
                const newestIds = new Set(sortedByDate.slice(0, 5).map(a => a.id));
                setNewestAlbumIds(newestIds);

                // Barajar el catálogo para dinamismo visual
                const shuffledAlbums = [...uniqueAlbums].sort(() => Math.random() - 0.5);
                setMergedAlbums(shuffledAlbums);
                
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
        let albums = searchQuery ? mergedAlbums.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())) : [...mergedAlbums];
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
                         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                             <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6 block">Diosmasgym</span>
                             <div className="flex justify-center gap-4">
                                 <a href={SOCIAL_LINKS.diosmasgym.spotify} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-[#1DB954]/20 transition-all"><SpotifyIcon className="w-6 h-6 text-[#1DB954]" /></a>
                                 <a href={SOCIAL_LINKS.diosmasgym.youtube} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-[#FF0000]/20 transition-all"><YoutubeMusicIcon className="w-6 h-6 text-[#FF0000]" /></a>
                                 <a href={SOCIAL_LINKS.diosmasgym.instagram} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-pink-500/20 transition-all"><svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                                 <a href={SOCIAL_LINKS.diosmasgym.tiktok} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-white/20 transition-all"><TiktokIcon className="w-6 h-6 text-white" /></a>
                             </div>
                         </div>
                         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl">
                             <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-6 block">Juan 614</span>
                             <div className="flex justify-center gap-4">
                                 <a href={SOCIAL_LINKS.juan614.spotify} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-[#1DB954]/20 transition-all"><SpotifyIcon className="w-6 h-6 text-[#1DB954]" /></a>
                                 <a href={SOCIAL_LINKS.juan614.youtube} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-[#FF0000]/20 transition-all"><YoutubeMusicIcon className="w-6 h-6 text-[#FF0000]" /></a>
                                 <a href={SOCIAL_LINKS.juan614.apple} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-[#FA243C]/20 transition-all"><AppleMusicIcon className="w-6 h-6 text-[#FA243C]" /></a>
                                 <a href={SOCIAL_LINKS.juan614.tiktok} target="_blank" rel="noopener noreferrer" className="p-4 bg-black/40 rounded-2xl border border-white/5 hover:bg-white/20 transition-all"><TiktokIcon className="w-6 h-6 text-white" /></a>
                             </div>
                         </div>
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
                {!searchQuery && (
                    <RandomRecommendation 
                        albums={mergedAlbums} 
                        tracks={topTracks} 
                        onAlbumSelect={setSelectedAlbum} 
                        onTrackSelect={handleTrackSelect} 
                    />
                )}
                {!searchQuery && <QuickLinks albums={mergedAlbums} />}

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
            </div>

            <AudioPlayer track={playingTrack} onClose={() => setPlayingTrack(null)} />
            <ScrollToTopButton />
            {selectedAlbum && <AlbumDetailModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} onTrackSelect={handleTrackSelect} playingTrackId={playingTrack?.id} />}
            {showCoverMaster && <CoverMaster onClose={() => setShowCoverMaster(false)} />}
            {showBioModal && <Biography onClose={() => setShowBioModal(false)} />}
        </div>
    );
};

export default App;
