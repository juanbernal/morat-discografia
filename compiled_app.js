import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=40f9f30d"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=40f9f30d"; const useState = __vite__cjsImport1_react["useState"]; const useEffect = __vite__cjsImport1_react["useEffect"]; const useCallback = __vite__cjsImport1_react["useCallback"]; const useMemo = __vite__cjsImport1_react["useMemo"];
import { getArtistAlbums, getArtistDetails, getArtistTopTracks as getSpotifyArtistTopTracks } from "/src/services/spotifyService.ts";
import { getCatalogFromSheet } from "/src/services/catalogService.ts";
import { getUpcomingReleases } from "/src/services/releaseService.ts";
import AlbumCard from "/src/components/AlbumCard.tsx";
import TopTracks from "/src/components/TopTracks.tsx";
import SkeletonLoader from "/src/components/SkeletonLoader.tsx";
import ScrollToTopButton from "/src/components/ScrollToTopButton.tsx";
import UpcomingReleaseCard from "/src/components/UpcomingReleaseCard.tsx";
import TikTokFeed from "/src/components/TikTokFeed.tsx";
import Biography from "/src/components/Biography.tsx";
import BiblicalEasterEgg from "/src/components/BiblicalEasterEgg.tsx";
import QuoteGeneratorModal from "/src/components/QuoteGeneratorModal.tsx";
import AlbumDetailModal from "/src/components/AlbumDetailModal.tsx";
import SpotifyIcon from "/src/components/SpotifyIcon.tsx";
import YoutubeMusicIcon from "/src/components/YoutubeMusicIcon.tsx";
import AppleMusicIcon from "/src/components/AppleMusicIcon.tsx";
import TiktokIcon from "/src/components/TiktokIcon.tsx";
import PresaveModal from "/src/components/PresaveModal.tsx";
import RandomRecommendation from "/src/components/RandomRecommendation.tsx";
import EvolutionTimeline from "/src/components/EvolutionTimeline.tsx";
import ContactForm from "/src/components/ContactForm.tsx";
import FollowUsModal from "/src/components/FollowUsModal.tsx";
import NewReleasesSlider from "/src/components/NewReleasesSlider.tsx";
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
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
const BellIcon = ({ className, active }) => /* @__PURE__ */ jsxDEV("svg", { viewBox: "0 0 24 24", fill: active ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className, children: [
  /* @__PURE__ */ jsxDEV("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }, void 0, false, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 59,
    columnNumber: 9
  }, this),
  /* @__PURE__ */ jsxDEV("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" }, void 0, false, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 60,
    columnNumber: 9
  }, this)
] }, void 0, true, {
  fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
  lineNumber: 58,
  columnNumber: 1
}, this);
_c = BellIcon;
const App = () => {
  _s();
  console.log("NEW APP DEPLOYED!!!!");
  const [mergedAlbums, setMergedAlbums] = useState([]);
  const [newestAlbumIds, setNewestAlbumIds] = useState(/* @__PURE__ */ new Set());
  const [mainArtist, setMainArtist] = useState(null);
  const [topTracks, setTopTracks] = useState([]);
  const [sheetReleases, setSheetReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [albumTypeFilter, setAlbumTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showLanding, setShowLanding] = useState(false);
  const [currentReleasesHash, setCurrentReleasesHash] = useState("");
  const [notificationsActive, setNotificationsActive] = useState(false);
  const [showNotifyToast, setShowNotifyToast] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const savedNotify = localStorage.getItem("dmg_notifications_v1");
    if (savedNotify === "true") setNotificationsActive(true);
  }, []);
  const toggleNotifications = () => {
    const newState = !notificationsActive;
    setNotificationsActive(newState);
    localStorage.setItem("dmg_notifications_v1", newState.toString());
    setShowNotifyToast(true);
    setTimeout(() => setShowNotifyToast(false), 3e3);
  };
  const fetchArtistData = useCallback(async () => {
    console.log("App: Starting fetchArtistData...");
    setLoading(true);
    try {
      const [upRes] = await Promise.all(
        [
          getUpcomingReleases().catch((e) => {
            console.error("App: Error fetching upcoming releases:", e);
            return [];
          })
        ]
      );
      console.log(`App: Fetched ${upRes.length} releases.`);
      setUpcomingReleases(upRes);
      if (upRes.length > 0) {
        const hash = upRes.map((r) => r.name + r.releaseDate).join("|");
        setCurrentReleasesHash(hash);
        const lastAcknowledgedHash = localStorage.getItem("dmg_last_releases_hash");
        const sessionFlag = sessionStorage.getItem("dmg_landing_shown_session");
        if (hash !== lastAcknowledgedHash && !sessionFlag) {
          setShowLanding(true);
        }
      }
      console.log("App: Fetching Spotify and Sheet data...");
      const [artRes, albumResults, spotifyTopTracksResults, sheetTracks] = await Promise.all(
        [
          getArtistDetails(MAIN_ARTIST_ID).catch((e) => {
            console.error("App: Error fetching artist details:", e);
            return null;
          }),
          Promise.all(
            ARTIST_IDS.map((id) => getArtistAlbums(id).catch((e) => {
              console.error(`App: Error fetching albums for artist ${id}:`, e);
              return [];
            }))
          ),
          Promise.all(
            ARTIST_IDS.map((id) => getSpotifyArtistTopTracks(id).catch((e) => {
              console.error(`App: Error fetching Spotify top tracks for artist ${id}:`, e);
              return [];
            }))
          ),
          getCatalogFromSheet().catch((e) => {
            console.error("App: Error fetching sheet tracks:", e);
            return [];
          })
        ]
      );
      if (artRes) setMainArtist(artRes);
      const allSpotifyTracks = spotifyTopTracksResults.flat();
      const trackMap = /* @__PURE__ */ new Map();
      allSpotifyTracks.forEach((t) => trackMap.set(t.id, t));
      sheetTracks.forEach((t) => {
        if (!trackMap.has(t.id)) {
          trackMap.set(t.id, t);
        }
      });
      const mergedTopTracks = Array.from(trackMap.values());
      setTopTracks(mergedTopTracks.slice(0, 5));
      setSheetReleases(sheetTracks);
      const allAlbums = albumResults.flat();
      console.log(`App: Total albums fetched: ${allAlbums.length}`);
      if (allAlbums.length > 0) {
        const uniqueAlbums = Array.from(new Map(allAlbums.map((a) => [a.id, a])).values());
        const sortedByDate = [...uniqueAlbums].sort(
          (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
        const newestIds = new Set(sortedByDate.slice(0, 5).map((a) => a.id));
        setNewestAlbumIds(newestIds);
        setMergedAlbums(uniqueAlbums);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchArtistData();
  }, [fetchArtistData]);
  const handleCloseLanding = () => {
    setShowLanding(false);
    localStorage.setItem("dmg_last_releases_hash", currentReleasesHash);
    sessionStorage.setItem("dmg_landing_shown_session", "true");
  };
  const catalogAlbums = useMemo(() => {
    let albums = searchQuery ? mergedAlbums.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())) : [...mergedAlbums];
    if (!searchQuery && albumTypeFilter !== "all") {
      albums = albums.filter((a) => a.album_type === albumTypeFilter);
    }
    return searchQuery ? albums : shuffleArray(albums);
  }, [mergedAlbums, albumTypeFilter, searchQuery]);
  const searchTracks = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    const allTracks = [...topTracks, ...sheetReleases];
    const unique = Array.from(new Map(allTracks.map((t) => [t.id, t])).values());
    return unique.filter((t) => t.name.toLowerCase().includes(query) || t.artists.some((a) => a.name.toLowerCase().includes(query)));
  }, [searchQuery, topTracks, sheetReleases]);
  const displayedAlbums = useMemo(() => {
    return catalogAlbums.slice(0, visibleCount);
  }, [catalogAlbums, visibleCount]);
  const hasMore = visibleCount < catalogAlbums.length;
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "min-h-screen bg-[#020617] text-slate-200 selection:bg-blue-500/30", children: loading && !mainArtist && mergedAlbums.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "max-w-screen-2xl mx-auto px-4 pt-40", children: /* @__PURE__ */ jsxDEV(SkeletonLoader, {}, void 0, false, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 232,
    columnNumber: 21
  }, this) }, void 0, false, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 231,
    columnNumber: 7
  }, this) : /* @__PURE__ */ jsxDEV("div", { className: "max-w-screen-2xl mx-auto px-4 md:px-6 pb-24 font-sans text-white", children: [
    showLanding && upcomingReleases.length > 0 && /* @__PURE__ */ jsxDEV(PresaveModal, { releases: upcomingReleases, onClose: handleCloseLanding }, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 237,
      columnNumber: 9
    }, this),
    !showLanding && /* @__PURE__ */ jsxDEV(FollowUsModal, {}, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 240,
      columnNumber: 38
    }, this),
    showNotifyToast && /* @__PURE__ */ jsxDEV("div", { className: "fixed top-24 right-6 z-[200] bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-3 border border-white/20", children: [
      /* @__PURE__ */ jsxDEV(BellIcon, { className: "w-5 h-5", active: true }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 245,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "text-[10px] font-black uppercase tracking-widest", children: notificationsActive ? "¡Notificaciones Activadas!" : "Notificaciones Desactivadas" }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 246,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 244,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("nav", { className: `sticky top-4 z-[45] mb-12 transition-all duration-500 ${scrolled ? "scale-95" : "scale-100"}`, children: /* @__PURE__ */ jsxDEV("div", { className: `bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-2xl transition-all ${scrolled ? "border-blue-500/30 shadow-blue-500/10" : ""}`, children: [
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV(BiblicalEasterEgg, { children: /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: "/diosmasgym_profile.jpg",
            alt: "Logo",
            onClick: () => setShowBioModal(true),
            className: "w-10 h-10 rounded-full border border-white/20 cursor-pointer hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 256,
            columnNumber: 37
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 255,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("h1", { className: "hidden sm:block text-[11px] font-black uppercase tracking-[0.3em] text-blue-500", children: "Diosmasgym Records" }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 263,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 254,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-2 md:gap-4", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              type: "text",
              placeholder: "Buscar...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "bg-white/5 border border-white/10 rounded-full py-2.5 px-4 pl-10 text-[10px] sm:text-xs font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 w-32 sm:w-48 md:w-64 transition-all shadow-inner"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 269,
              columnNumber: 37
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("svg", { className: "w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 276,
            columnNumber: 173
          }, this) }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 276,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 268,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: toggleNotifications,
            className: `p-2.5 rounded-full border transition-all ${notificationsActive ? "bg-blue-600 border-blue-400 text-white" : "bg-white/5 border-white/10 text-white/40 hover:text-white"}`,
            title: notificationsActive ? "Desactivar notificaciones" : "Activar notificaciones",
            children: /* @__PURE__ */ jsxDEV(BellIcon, { className: "w-5 h-5", active: notificationsActive }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 283,
              columnNumber: 37
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 278,
            columnNumber: 33
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setShowQuoteModal(true), className: "flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full shadow-lg transition-all active:scale-95", children: "Crear Frase" }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 285,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 267,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 253,
      columnNumber: 25
    }, this) }, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 252,
      columnNumber: 21
    }, this),
    !searchQuery && /* @__PURE__ */ jsxDEV("header", { className: "mb-24 text-center animate-fade-in py-10", children: [
      /* @__PURE__ */ jsxDEV("p", { className: "text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4", children: "Official Artist Discography" }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 294,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("h2", { className: "text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-20 drop-shadow-2xl", children: [
        "Diosmasgym ",
        /* @__PURE__ */ jsxDEV("span", { className: "text-white/20", children: "Records" }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 296,
          columnNumber: 44
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 295,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "bg-white/5 p-8 rounded-[2.5rem] border border-blue-500/20 backdrop-blur-xl flex flex-col items-center shadow-[0_0_50px_rgba(59,130,246,0.1)] transition-transform hover:scale-[1.02]", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4", children: "Diosmasgym" }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 300,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.diosmasgym.spotify, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-[#1DB954]/20 transition-all", children: /* @__PURE__ */ jsxDEV(SpotifyIcon, { className: "w-5 h-5 text-[#1DB954]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 302,
              columnNumber: 175
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 302,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.diosmasgym.youtube, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-[#FF0000]/20 transition-all", children: /* @__PURE__ */ jsxDEV(YoutubeMusicIcon, { className: "w-5 h-5 text-[#FF0000]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 303,
              columnNumber: 175
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 303,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.diosmasgym.tiktok, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-white/20 transition-all", children: /* @__PURE__ */ jsxDEV(TiktokIcon, { className: "w-5 h-5 text-white" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 304,
              columnNumber: 170
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 304,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 301,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 299,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/30 backdrop-blur-xl flex flex-col items-center shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-transform hover:scale-[1.02]", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4", children: "Juan 614" }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 308,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.juan614.spotify, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-[#1DB954]/20 transition-all", children: /* @__PURE__ */ jsxDEV(SpotifyIcon, { className: "w-5 h-5 text-[#1DB954]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 310,
              columnNumber: 172
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 310,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.juan614.apple, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-[#FA243C]/20 transition-all", children: /* @__PURE__ */ jsxDEV(AppleMusicIcon, { className: "w-5 h-5 text-[#FA243C]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 311,
              columnNumber: 170
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 311,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDEV("a", { href: SOCIAL_LINKS.juan614.tiktok, target: "_blank", className: "p-3 bg-black/40 rounded-xl hover:bg-white/20 transition-all", children: /* @__PURE__ */ jsxDEV(TiktokIcon, { className: "w-5 h-5 text-white" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 312,
              columnNumber: 167
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 312,
              columnNumber: 41
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 309,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 307,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 298,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 293,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "space-y-32", children: [
      searchQuery && searchTracks.length > 0 && /* @__PURE__ */ jsxDEV("section", { className: "animate-fade-in mt-16 px-2", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 mb-10", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-1.5 h-8 bg-[#1DB954] rounded-full shadow-[0_0_20px_rgba(29,185,84,0.6)]" }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 323,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-3xl font-black tracking-tighter uppercase", children: [
            "Canciones ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-[#1DB954]", children: "Encontradas" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 324,
              columnNumber: 110
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 324,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 322,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "bg-[#050b18] rounded-[2rem] p-6 md:p-10 border border-white/5 shadow-2xl backdrop-blur-xl", children: /* @__PURE__ */ jsxDEV(TopTracks, { tracks: searchTracks }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 327,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 326,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 321,
        columnNumber: 11
      }, this),
      !searchQuery && upcomingReleases.length > 0 && /* @__PURE__ */ jsxDEV("section", { className: "animate-fade-in", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4 mb-16 px-2", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 335,
            columnNumber: 37
          }, this),
          /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl font-black tracking-tighter uppercase", children: [
            "Próximos ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-blue-500", children: "Estrenos" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 336,
              columnNumber: 109
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 336,
            columnNumber: 37
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 334,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16", children: upcomingReleases.map(
          (release, idx) => /* @__PURE__ */ jsxDEV(UpcomingReleaseCard, { release }, `release-${idx}`, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 340,
            columnNumber: 15
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 338,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 333,
        columnNumber: 11
      }, this),
      !searchQuery && sheetReleases.length > 0 && /* @__PURE__ */ jsxDEV(NewReleasesSlider, { releases: sheetReleases }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 347,
        columnNumber: 11
      }, this),
      !searchQuery && /* @__PURE__ */ jsxDEV(
        RandomRecommendation,
        {
          albums: mergedAlbums,
          tracks: topTracks,
          onAlbumSelect: setSelectedAlbum,
          onTrackSelect: () => {
          }
        },
        void 0,
        false,
        {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 351,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("section", { id: "catalogo", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "flex flex-col sm:flex-row items-center justify-between mb-16 gap-8", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 362,
              columnNumber: 37
            }, this),
            /* @__PURE__ */ jsxDEV("h2", { className: "text-4xl font-black tracking-tighter uppercase", children: [
              "Catálogo ",
              /* @__PURE__ */ jsxDEV("span", { className: "text-blue-500", children: "Oficial" }, void 0, false, {
                fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
                lineNumber: 363,
                columnNumber: 109
              }, this)
            ] }, void 0, true, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 363,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 361,
            columnNumber: 33
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: "flex bg-slate-900 border border-white/10 p-1.5 rounded-2xl backdrop-blur-3xl", children: ["all", "album", "single"].map(
            (type) => /* @__PURE__ */ jsxDEV(
              "button",
              {
                onClick: () => {
                  setAlbumTypeFilter(type);
                  setVisibleCount(ITEMS_PER_PAGE);
                },
                className: `px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${albumTypeFilter === type ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`,
                children: type === "all" ? "Todo" : type === "album" ? "Álbumes" : "Singles"
              },
              type,
              false,
              {
                fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
                lineNumber: 367,
                columnNumber: 17
              },
              this
            )
          ) }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 365,
            columnNumber: 33
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 360,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-8", children: displayedAlbums.map(
          (album) => /* @__PURE__ */ jsxDEV(
            AlbumCard,
            {
              album,
              onSelect: setSelectedAlbum,
              isNewest: newestAlbumIds.has(album.id)
            },
            album.id,
            false,
            {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 380,
              columnNumber: 15
            },
            this
          )
        ) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 378,
          columnNumber: 29
        }, this),
        hasMore && /* @__PURE__ */ jsxDEV("div", { className: "mt-20 flex justify-center", children: /* @__PURE__ */ jsxDEV(
          "button",
          {
            onClick: handleLoadMore,
            className: "group relative bg-white/5 border border-white/10 hover:border-blue-500/50 px-16 py-6 rounded-3xl transition-all hover:scale-105 active:scale-95",
            children: [
              /* @__PURE__ */ jsxDEV("span", { className: "text-[10px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors", children: "Cargar más lanzamientos" }, void 0, false, {
                fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
                lineNumber: 395,
                columnNumber: 41
              }, this),
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_15px_rgba(59,130,246,0.8)]" }, void 0, false, {
                fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
                lineNumber: 398,
                columnNumber: 41
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 391,
            columnNumber: 37
          },
          this
        ) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 390,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 359,
        columnNumber: 25
      }, this),
      topTracks.length > 0 && /* @__PURE__ */ jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-16", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsxDEV("section", { className: "bg-[#050b18] rounded-[3rem] p-8 md:p-12 border border-white/5 shadow-3xl backdrop-blur-3xl h-full", children: [
          /* @__PURE__ */ jsxDEV("h2", { className: "text-2xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter", children: [
            /* @__PURE__ */ jsxDEV("div", { className: "p-2 bg-[#1DB954]/10 rounded-full", children: /* @__PURE__ */ jsxDEV(SpotifyIcon, { className: "w-8 h-8 text-[#1DB954]" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 409,
              columnNumber: 95
            }, this) }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 409,
              columnNumber: 45
            }, this),
            " Top ",
            /* @__PURE__ */ jsxDEV("span", { className: "text-[#1DB954]", children: "Hits" }, void 0, false, {
              fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
              lineNumber: 409,
              columnNumber: 156
            }, this)
          ] }, void 0, true, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 408,
            columnNumber: 41
          }, this),
          /* @__PURE__ */ jsxDEV(TopTracks, { tracks: topTracks }, void 0, false, {
            fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
            lineNumber: 411,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 407,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 406,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "lg:col-span-4", children: /* @__PURE__ */ jsxDEV(TikTokFeed, {}, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 415,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 414,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 405,
        columnNumber: 11
      }, this),
      !searchQuery && /* @__PURE__ */ jsxDEV(ContactForm, { albums: mergedAlbums, tracks: topTracks }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 420,
        columnNumber: 42
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 319,
      columnNumber: 21
    }, this),
    /* @__PURE__ */ jsxDEV(ScrollToTopButton, {}, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 423,
      columnNumber: 21
    }, this),
    showTimelineModal && /* @__PURE__ */ jsxDEV("div", { className: "fixed inset-0 z-[160] bg-slate-950 overflow-y-auto animate-fade-in custom-scrollbar", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "sticky top-0 z-[170] p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxDEV("h3", { className: "text-blue-500 font-black text-xs uppercase tracking-[0.5em]", children: "Diosmasgym Records History" }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 428,
          columnNumber: 33
        }, this),
        /* @__PURE__ */ jsxDEV("button", { onClick: () => setShowTimelineModal(false), className: "bg-white/5 p-4 rounded-full text-white border border-white/10", children: /* @__PURE__ */ jsxDEV("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxDEV("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 18L18 6M6 6l12 12" }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 430,
          columnNumber: 116
        }, this) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 430,
          columnNumber: 37
        }, this) }, void 0, false, {
          fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
          lineNumber: 429,
          columnNumber: 33
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 427,
        columnNumber: 29
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "pb-32", children: /* @__PURE__ */ jsxDEV(EvolutionTimeline, { albums: mergedAlbums, onSelect: (a) => {
        setSelectedAlbum(a);
        setShowTimelineModal(false);
      } }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 434,
        columnNumber: 33
      }, this) }, void 0, false, {
        fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
        lineNumber: 433,
        columnNumber: 29
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 426,
      columnNumber: 9
    }, this),
    selectedAlbum && /* @__PURE__ */ jsxDEV(AlbumDetailModal, { album: selectedAlbum, onClose: () => setSelectedAlbum(null) }, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 439,
      columnNumber: 39
    }, this),
    showQuoteModal && /* @__PURE__ */ jsxDEV(QuoteGeneratorModal, { onClose: () => setShowQuoteModal(false), albums: mergedAlbums }, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 440,
      columnNumber: 40
    }, this),
    showBioModal && /* @__PURE__ */ jsxDEV(Biography, { onClose: () => setShowBioModal(false) }, void 0, false, {
      fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
      lineNumber: 441,
      columnNumber: 38
    }, this)
  ] }, void 0, true, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 235,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx",
    lineNumber: 229,
    columnNumber: 5
  }, this);
};
_s(App, "pUnDfDprgsjJyYXZodsRL7/gA4Y=");
_c2 = App;
export default App;
var _c, _c2;
$RefreshReg$(_c, "BellIcon");
$RefreshReg$(_c2, "App");
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}
function $RefreshReg$(type, id) {
  return RefreshRuntime.register(type, "C:/Users/redim/OneDrive/Escritorio/App/src/App.tsx " + id);
}
function $RefreshSig$() {
  return RefreshRuntime.createSignatureFunctionForTransform();
}

//# sourceMappingURL=data:application/json;base64,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YTtBQUFBLE1BQWJBO0FBZ1lOLGVBQWVBO0FBQUksSUFBQUQsSUFBQTZIO0FBQUEsYUFBQTdILElBQUE7QUFBQSxhQUFBNkgsS0FBQSIsIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlQ2FsbGJhY2siLCJ1c2VNZW1vIiwiZ2V0QXJ0aXN0QWxidW1zIiwiZ2V0QXJ0aXN0RGV0YWlscyIsImdldEFydGlzdFRvcFRyYWNrcyIsImdldFNwb3RpZnlBcnRpc3RUb3BUcmFja3MiLCJnZXRDYXRhbG9nRnJvbVNoZWV0IiwiZ2V0VXBjb21pbmdSZWxlYXNlcyIsIkFsYnVtQ2FyZCIsIlRvcFRyYWNrcyIsIlNrZWxldG9uTG9hZGVyIiwiU2Nyb2xsVG9Ub3BCdXR0b24iLCJVcGNvbWluZ1JlbGVhc2VDYXJkIiwiVGlrVG9rRmVlZCIsIkJpb2dyYXBoeSIsIkJpYmxpY2FsRWFzdGVyRWdnIiwiUXVvdGVHZW5lcmF0b3JNb2RhbCIsIkFsYnVtRGV0YWlsTW9kYWwiLCJTcG90aWZ5SWNvbiIsIllvdXR1YmVNdXNpY0ljb24iLCJBcHBsZU11c2ljSWNvbiIsIlRpa3Rva0ljb24iLCJQcmVzYXZlTW9kYWwiLCJSYW5kb21SZWNvbW1lbmRhdGlvbiIsIkV2b2x1dGlvblRpbWVsaW5lIiwiQ29udGFjdEZvcm0iLCJGb2xsb3dVc01vZGFsIiwiTmV3UmVsZWFzZXNTbGlkZXIiLCJBUlRJU1RfSURTIiwiTUFJTl9BUlRJU1RfSUQiLCJTT0NJQUxfTElOS1MiLCJkaW9zbWFzZ3ltIiwic3BvdGlmeSIsInlvdXR1YmUiLCJpbnN0YWdyYW0iLCJ0aWt0b2siLCJqdWFuNjE0IiwiYXBwbGUiLCJJVEVNU19QRVJfUEFHRSIsInNodWZmbGVBcnJheSIsImFycmF5Iiwic2h1ZmZsZWQiLCJpIiwibGVuZ3RoIiwiaiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsIkJlbGxJY29uIiwiY2xhc3NOYW1lIiwiYWN0aXZlIiwiX2MiLCJBcHAiLCJfcyIsImNvbnNvbGUiLCJsb2ciLCJtZXJnZWRBbGJ1bXMiLCJzZXRNZXJnZWRBbGJ1bXMiLCJuZXdlc3RBbGJ1bUlkcyIsInNldE5ld2VzdEFsYnVtSWRzIiwiU2V0IiwibWFpbkFydGlzdCIsInNldE1haW5BcnRpc3QiLCJ0b3BUcmFja3MiLCJzZXRUb3BUcmFja3MiLCJzaGVldFJlbGVhc2VzIiwic2V0U2hlZXRSZWxlYXNlcyIsImxvYWRpbmciLCJzZXRMb2FkaW5nIiwiYWxidW1UeXBlRmlsdGVyIiwic2V0QWxidW1UeXBlRmlsdGVyIiwic2VhcmNoUXVlcnkiLCJzZXRTZWFyY2hRdWVyeSIsInZpc2libGVDb3VudCIsInNldFZpc2libGVDb3VudCIsInVwY29taW5nUmVsZWFzZXMiLCJzZXRVcGNvbWluZ1JlbGVhc2VzIiwic2VsZWN0ZWRBbGJ1bSIsInNldFNlbGVjdGVkQWxidW0iLCJzaG93UXVvdGVNb2RhbCIsInNldFNob3dRdW90ZU1vZGFsIiwic2hvd0Jpb01vZGFsIiwic2V0U2hvd0Jpb01vZGFsIiwic2hvd1RpbWVsaW5lTW9kYWwiLCJzZXRTaG93VGltZWxpbmVNb2RhbCIsInNob3dMYW5kaW5nIiwic2V0U2hvd0xhbmRpbmciLCJjdXJyZW50UmVsZWFzZXNIYXNoIiwic2V0Q3VycmVudFJlbGVhc2VzSGFzaCIsIm5vdGlmaWNhdGlvbnNBY3RpdmUiLCJzZXROb3RpZmljYXRpb25zQWN0aXZlIiwic2hvd05vdGlmeVRvYXN0Iiwic2V0U2hvd05vdGlmeVRvYXN0Iiwic2Nyb2xsZWQiLCJzZXRTY3JvbGxlZCIsImhhbmRsZVNjcm9sbCIsIndpbmRvdyIsInNjcm9sbFkiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInNhdmVkTm90aWZ5IiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInRvZ2dsZU5vdGlmaWNhdGlvbnMiLCJuZXdTdGF0ZSIsInNldEl0ZW0iLCJ0b1N0cmluZyIsInNldFRpbWVvdXQiLCJmZXRjaEFydGlzdERhdGEiLCJ1cFJlcyIsIlByb21pc2UiLCJhbGwiLCJjYXRjaCIsImUiLCJlcnJvciIsImhhc2giLCJtYXAiLCJyIiwibmFtZSIsInJlbGVhc2VEYXRlIiwiam9pbiIsImxhc3RBY2tub3dsZWRnZWRIYXNoIiwic2Vzc2lvbkZsYWciLCJzZXNzaW9uU3RvcmFnZSIsImFydFJlcyIsImFsYnVtUmVzdWx0cyIsInNwb3RpZnlUb3BUcmFja3NSZXN1bHRzIiwic2hlZXRUcmFja3MiLCJpZCIsImFsbFNwb3RpZnlUcmFja3MiLCJmbGF0IiwidHJhY2tNYXAiLCJNYXAiLCJmb3JFYWNoIiwidCIsInNldCIsImhhcyIsIm1lcmdlZFRvcFRyYWNrcyIsIkFycmF5IiwiZnJvbSIsInZhbHVlcyIsInNsaWNlIiwiYWxsQWxidW1zIiwidW5pcXVlQWxidW1zIiwiYSIsInNvcnRlZEJ5RGF0ZSIsInNvcnQiLCJiIiwiRGF0ZSIsInJlbGVhc2VfZGF0ZSIsImdldFRpbWUiLCJuZXdlc3RJZHMiLCJlcnIiLCJoYW5kbGVDbG9zZUxhbmRpbmciLCJjYXRhbG9nQWxidW1zIiwiYWxidW1zIiwiZmlsdGVyIiwidG9Mb3dlckNhc2UiLCJpbmNsdWRlcyIsImFsYnVtX3R5cGUiLCJzZWFyY2hUcmFja3MiLCJxdWVyeSIsImFsbFRyYWNrcyIsInVuaXF1ZSIsImFydGlzdHMiLCJzb21lIiwiZGlzcGxheWVkQWxidW1zIiwiaGFzTW9yZSIsImhhbmRsZUxvYWRNb3JlIiwicHJldiIsInRhcmdldCIsInZhbHVlIiwicmVsZWFzZSIsImlkeCIsInR5cGUiLCJhbGJ1bSIsIl9jMiJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJBcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZUNhbGxiYWNrLCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZ2V0QXJ0aXN0QWxidW1zLCBnZXRBcnRpc3REZXRhaWxzLCBnZXRBcnRpc3RUb3BUcmFja3MgYXMgZ2V0U3BvdGlmeUFydGlzdFRvcFRyYWNrcyB9IGZyb20gJy4vc2VydmljZXMvc3BvdGlmeVNlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0Q2F0YWxvZ0Zyb21TaGVldCB9IGZyb20gJy4vc2VydmljZXMvY2F0YWxvZ1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0VXBjb21pbmdSZWxlYXNlcyB9IGZyb20gJy4vc2VydmljZXMvcmVsZWFzZVNlcnZpY2UnO1xuaW1wb3J0IHR5cGUgeyBBbGJ1bSwgQXJ0aXN0LCBUcmFjaywgVXBjb21pbmdSZWxlYXNlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgQWxidW1DYXJkIGZyb20gJy4vY29tcG9uZW50cy9BbGJ1bUNhcmQnO1xuaW1wb3J0IFRvcFRyYWNrcyBmcm9tICcuL2NvbXBvbmVudHMvVG9wVHJhY2tzJztcbmltcG9ydCBTa2VsZXRvbkxvYWRlciBmcm9tICcuL2NvbXBvbmVudHMvU2tlbGV0b25Mb2FkZXInO1xuaW1wb3J0IFNjcm9sbFRvVG9wQnV0dG9uIGZyb20gJy4vY29tcG9uZW50cy9TY3JvbGxUb1RvcEJ1dHRvbic7XG5pbXBvcnQgVXBjb21pbmdSZWxlYXNlQ2FyZCBmcm9tICcuL2NvbXBvbmVudHMvVXBjb21pbmdSZWxlYXNlQ2FyZCc7XG5pbXBvcnQgVGlrVG9rRmVlZCBmcm9tICcuL2NvbXBvbmVudHMvVGlrVG9rRmVlZCc7XG5pbXBvcnQgQmlvZ3JhcGh5IGZyb20gJy4vY29tcG9uZW50cy9CaW9ncmFwaHknO1xuaW1wb3J0IEJpYmxpY2FsRWFzdGVyRWdnIGZyb20gJy4vY29tcG9uZW50cy9CaWJsaWNhbEVhc3RlckVnZyc7XG5pbXBvcnQgUXVvdGVHZW5lcmF0b3JNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvUXVvdGVHZW5lcmF0b3JNb2RhbCc7XG5pbXBvcnQgQWxidW1EZXRhaWxNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvQWxidW1EZXRhaWxNb2RhbCc7XG5pbXBvcnQgU3BvdGlmeUljb24gZnJvbSAnLi9jb21wb25lbnRzL1Nwb3RpZnlJY29uJztcbmltcG9ydCBZb3V0dWJlTXVzaWNJY29uIGZyb20gJy4vY29tcG9uZW50cy9Zb3V0dWJlTXVzaWNJY29uJztcbmltcG9ydCBBcHBsZU11c2ljSWNvbiBmcm9tICcuL2NvbXBvbmVudHMvQXBwbGVNdXNpY0ljb24nO1xuaW1wb3J0IFRpa3Rva0ljb24gZnJvbSAnLi9jb21wb25lbnRzL1Rpa3Rva0ljb24nO1xuaW1wb3J0IFByZXNhdmVNb2RhbCBmcm9tICcuL2NvbXBvbmVudHMvUHJlc2F2ZU1vZGFsJztcbmltcG9ydCBSYW5kb21SZWNvbW1lbmRhdGlvbiBmcm9tICcuL2NvbXBvbmVudHMvUmFuZG9tUmVjb21tZW5kYXRpb24nO1xuaW1wb3J0IEV2b2x1dGlvblRpbWVsaW5lIGZyb20gJy4vY29tcG9uZW50cy9Fdm9sdXRpb25UaW1lbGluZSc7XG5pbXBvcnQgQ29udGFjdEZvcm0gZnJvbSAnLi9jb21wb25lbnRzL0NvbnRhY3RGb3JtJztcbmltcG9ydCBGb2xsb3dVc01vZGFsIGZyb20gJy4vY29tcG9uZW50cy9Gb2xsb3dVc01vZGFsJztcbmltcG9ydCBOZXdSZWxlYXNlc1NsaWRlciBmcm9tICcuL2NvbXBvbmVudHMvTmV3UmVsZWFzZXNTbGlkZXInO1xuXG5jb25zdCBBUlRJU1RfSURTID0gW1wiMm1Fb2VkY2pESjd4NlNDVkxNSTREb1wiLCBcIjB2RUthNUFPY0JrUVZYTmZHYjJGTmhcIl07XG5jb25zdCBNQUlOX0FSVElTVF9JRCA9IEFSVElTVF9JRFNbMF07XG5cbmNvbnN0IFNPQ0lBTF9MSU5LUyA9IHtcbiAgICBkaW9zbWFzZ3ltOiB7XG4gICAgICAgIHNwb3RpZnk6IFwiaHR0cHM6Ly9vcGVuLnNwb3RpZnkuY29tL2FydGlzdC8ybUVvZWRjakRKN3g2U0NWTE1JNERvXCIsXG4gICAgICAgIHlvdXR1YmU6IFwiaHR0cHM6Ly9tdXNpYy55b3V0dWJlLmNvbS9jaGFubmVsL1VDYVhUekl3Tm9acWhIdzZXcEhTZG5vd1wiLFxuICAgICAgICBpbnN0YWdyYW06IFwiaHR0cHM6Ly93d3cuaW5zdGFncmFtLmNvbS9kaW9zbWFzZ3ltXCIsXG4gICAgICAgIHRpa3RvazogXCJodHRwczovL3Rpa3Rvay5jb20vQGRpb3NtYXNneW1cIlxuICAgIH0sXG4gICAganVhbjYxNDoge1xuICAgICAgICBzcG90aWZ5OiBcImh0dHBzOi8vb3Blbi5zcG90aWZ5LmNvbS9hcnRpc3QvMHZFS2E1QU9jQmtRVlhOZkdiMkZOaFwiLFxuICAgICAgICB5b3V0dWJlOiBcImh0dHBzOi8vbXVzaWMueW91dHViZS5jb20vc2VhcmNoP3E9SnVhbis2MTRcIixcbiAgICAgICAgYXBwbGU6IFwiaHR0cHM6Ly9tdXNpYy5hcHBsZS5jb20vdXMvYXJ0aXN0L2p1YW4tNjE0LzE4NzA3MjE0ODhcIixcbiAgICAgICAgdGlrdG9rOiBcImh0dHBzOi8vd3d3LnRpa3Rvay5jb20vQGp1YW42MTRvZmljaWFsXCJcbiAgICB9XG59O1xuXG5jb25zdCBJVEVNU19QRVJfUEFHRSA9IDE4O1xuXG5jb25zdCBzaHVmZmxlQXJyYXkgPSA8VCw+KGFycmF5OiBUW10pOiBUW10gPT4ge1xuICAgIGNvbnN0IHNodWZmbGVkID0gWy4uLmFycmF5XTtcbiAgICBmb3IgKGxldCBpID0gc2h1ZmZsZWQubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICBjb25zdCBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XG4gICAgICAgIFtzaHVmZmxlZFtpXSwgc2h1ZmZsZWRbal1dID0gW3NodWZmbGVkW2pdLCBzaHVmZmxlZFtpXV07XG4gICAgfVxuICAgIHJldHVybiBzaHVmZmxlZDtcbn07XG5cbmNvbnN0IEJlbGxJY29uID0gKHsgY2xhc3NOYW1lLCBhY3RpdmUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcsIGFjdGl2ZT86IGJvb2xlYW4gfSkgPT4gKFxuICAgIDxzdmcgdmlld0JveD1cIjAgMCAyNCAyNFwiIGZpbGw9e2FjdGl2ZSA/IFwiY3VycmVudENvbG9yXCIgOiBcIm5vbmVcIn0gc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIyXCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgICAgPHBhdGggZD1cIk0xOCA4QTYgNiAwIDAgMCA2IDhjMCA3LTMgOS0zIDloMThzLTMtMi0zLTlcIj48L3BhdGg+XG4gICAgICAgIDxwYXRoIGQ9XCJNMTMuNzMgMjFhMiAyIDAgMCAxLTMuNDYgMFwiPjwvcGF0aD5cbiAgICA8L3N2Zz5cbik7XG5cbmNvbnN0IEFwcDogUmVhY3QuRkMgPSAoKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJORVcgQVBQIERFUExPWUVEISEhIVwiKTtcbiAgICBjb25zdCBbbWVyZ2VkQWxidW1zLCBzZXRNZXJnZWRBbGJ1bXNdID0gdXNlU3RhdGU8QWxidW1bXT4oW10pO1xuICAgIGNvbnN0IFtuZXdlc3RBbGJ1bUlkcywgc2V0TmV3ZXN0QWxidW1JZHNdID0gdXNlU3RhdGU8U2V0PHN0cmluZz4+KG5ldyBTZXQoKSk7XG4gICAgY29uc3QgW21haW5BcnRpc3QsIHNldE1haW5BcnRpc3RdID0gdXNlU3RhdGU8QXJ0aXN0IHwgbnVsbD4obnVsbCk7XG4gICAgY29uc3QgW3RvcFRyYWNrcywgc2V0VG9wVHJhY2tzXSA9IHVzZVN0YXRlPFRyYWNrW10+KFtdKTtcbiAgICBjb25zdCBbc2hlZXRSZWxlYXNlcywgc2V0U2hlZXRSZWxlYXNlc10gPSB1c2VTdGF0ZTxUcmFja1tdPihbXSk7XG4gICAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gICAgY29uc3QgW2FsYnVtVHlwZUZpbHRlciwgc2V0QWxidW1UeXBlRmlsdGVyXSA9IHVzZVN0YXRlPCdhbGwnIHwgJ2FsYnVtJyB8ICdzaW5nbGUnPignYWxsJyk7XG4gICAgY29uc3QgW3NlYXJjaFF1ZXJ5LCBzZXRTZWFyY2hRdWVyeV0gPSB1c2VTdGF0ZSgnJyk7XG4gICAgY29uc3QgW3Zpc2libGVDb3VudCwgc2V0VmlzaWJsZUNvdW50XSA9IHVzZVN0YXRlKElURU1TX1BFUl9QQUdFKTtcblxuICAgIGNvbnN0IFt1cGNvbWluZ1JlbGVhc2VzLCBzZXRVcGNvbWluZ1JlbGVhc2VzXSA9IHVzZVN0YXRlPFVwY29taW5nUmVsZWFzZVtdPihbXSk7XG4gICAgY29uc3QgW3NlbGVjdGVkQWxidW0sIHNldFNlbGVjdGVkQWxidW1dID0gdXNlU3RhdGU8QWxidW0gfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbc2hvd1F1b3RlTW9kYWwsIHNldFNob3dRdW90ZU1vZGFsXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbc2hvd0Jpb01vZGFsLCBzZXRTaG93QmlvTW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzaG93VGltZWxpbmVNb2RhbCwgc2V0U2hvd1RpbWVsaW5lTW9kYWxdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzaG93TGFuZGluZywgc2V0U2hvd0xhbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtjdXJyZW50UmVsZWFzZXNIYXNoLCBzZXRDdXJyZW50UmVsZWFzZXNIYXNoXSA9IHVzZVN0YXRlKCcnKTtcblxuICAgIC8vIE5vdGlmaWNhY2lvbmVzXG4gICAgY29uc3QgW25vdGlmaWNhdGlvbnNBY3RpdmUsIHNldE5vdGlmaWNhdGlvbnNBY3RpdmVdID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtzaG93Tm90aWZ5VG9hc3QsIHNldFNob3dOb3RpZnlUb2FzdF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gICAgY29uc3QgW3Njcm9sbGVkLCBzZXRTY3JvbGxlZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVTY3JvbGwgPSAoKSA9PiBzZXRTY3JvbGxlZCh3aW5kb3cuc2Nyb2xsWSA+IDUwKTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGhhbmRsZVNjcm9sbCk7XG4gICAgICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgaGFuZGxlU2Nyb2xsKTtcbiAgICB9LCBbXSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBzYXZlZE5vdGlmeSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkbWdfbm90aWZpY2F0aW9uc192MScpO1xuICAgICAgICBpZiAoc2F2ZWROb3RpZnkgPT09ICd0cnVlJykgc2V0Tm90aWZpY2F0aW9uc0FjdGl2ZSh0cnVlKTtcbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCB0b2dnbGVOb3RpZmljYXRpb25zID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBuZXdTdGF0ZSA9ICFub3RpZmljYXRpb25zQWN0aXZlO1xuICAgICAgICBzZXROb3RpZmljYXRpb25zQWN0aXZlKG5ld1N0YXRlKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RtZ19ub3RpZmljYXRpb25zX3YxJywgbmV3U3RhdGUudG9TdHJpbmcoKSk7XG4gICAgICAgIHNldFNob3dOb3RpZnlUb2FzdCh0cnVlKTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiBzZXRTaG93Tm90aWZ5VG9hc3QoZmFsc2UpLCAzMDAwKTtcbiAgICB9O1xuXG4gICAgY29uc3QgZmV0Y2hBcnRpc3REYXRhID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFwcDogU3RhcnRpbmcgZmV0Y2hBcnRpc3REYXRhLi4uXCIpO1xuICAgICAgICBzZXRMb2FkaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgW3VwUmVzXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICBnZXRVcGNvbWluZ1JlbGVhc2VzKCkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkFwcDogRXJyb3IgZmV0Y2hpbmcgdXBjb21pbmcgcmVsZWFzZXM6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQXBwOiBGZXRjaGVkICR7dXBSZXMubGVuZ3RofSByZWxlYXNlcy5gKTtcbiAgICAgICAgICAgIHNldFVwY29taW5nUmVsZWFzZXModXBSZXMpO1xuXG4gICAgICAgICAgICBpZiAodXBSZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc2ggPSB1cFJlcy5tYXAociA9PiByLm5hbWUgKyByLnJlbGVhc2VEYXRlKS5qb2luKCd8Jyk7XG4gICAgICAgICAgICAgICAgc2V0Q3VycmVudFJlbGVhc2VzSGFzaChoYXNoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0QWNrbm93bGVkZ2VkSGFzaCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdkbWdfbGFzdF9yZWxlYXNlc19oYXNoJyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2Vzc2lvbkZsYWcgPSBzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKCdkbWdfbGFuZGluZ19zaG93bl9zZXNzaW9uJyk7XG4gICAgICAgICAgICAgICAgaWYgKGhhc2ggIT09IGxhc3RBY2tub3dsZWRnZWRIYXNoICYmICFzZXNzaW9uRmxhZykge1xuICAgICAgICAgICAgICAgICAgICBzZXRTaG93TGFuZGluZyh0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXBwOiBGZXRjaGluZyBTcG90aWZ5IGFuZCBTaGVldCBkYXRhLi4uXCIpO1xuICAgICAgICAgICAgY29uc3QgW2FydFJlcywgYWxidW1SZXN1bHRzLCBzcG90aWZ5VG9wVHJhY2tzUmVzdWx0cywgc2hlZXRUcmFja3NdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIGdldEFydGlzdERldGFpbHMoTUFJTl9BUlRJU1RfSUQpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBcHA6IEVycm9yIGZldGNoaW5nIGFydGlzdCBkZXRhaWxzOlwiLCBlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFSVElTVF9JRFMubWFwKGlkID0+IGdldEFydGlzdEFsYnVtcyhpZCkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYEFwcDogRXJyb3IgZmV0Y2hpbmcgYWxidW1zIGZvciBhcnRpc3QgJHtpZH06YCwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICksXG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwoXG4gICAgICAgICAgICAgICAgICAgIEFSVElTVF9JRFMubWFwKGlkID0+IGdldFNwb3RpZnlBcnRpc3RUb3BUcmFja3MoaWQpLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBBcHA6IEVycm9yIGZldGNoaW5nIFNwb3RpZnkgdG9wIHRyYWNrcyBmb3IgYXJ0aXN0ICR7aWR9OmAsIGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGdldENhdGFsb2dGcm9tU2hlZXQoKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiQXBwOiBFcnJvciBmZXRjaGluZyBzaGVldCB0cmFja3M6XCIsIGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBpZiAoYXJ0UmVzKSBzZXRNYWluQXJ0aXN0KGFydFJlcyk7XG5cbiAgICAgICAgICAgIGNvbnN0IGFsbFNwb3RpZnlUcmFja3MgPSBzcG90aWZ5VG9wVHJhY2tzUmVzdWx0cy5mbGF0KCk7XG4gICAgICAgICAgICBjb25zdCB0cmFja01hcCA9IG5ldyBNYXA8c3RyaW5nLCBUcmFjaz4oKTtcblxuICAgICAgICAgICAgYWxsU3BvdGlmeVRyYWNrcy5mb3JFYWNoKHQgPT4gdHJhY2tNYXAuc2V0KHQuaWQsIHQpKTtcbiAgICAgICAgICAgIHNoZWV0VHJhY2tzLmZvckVhY2godCA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0cmFja01hcC5oYXModC5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhY2tNYXAuc2V0KHQuaWQsIHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBtZXJnZWRUb3BUcmFja3MgPSBBcnJheS5mcm9tKHRyYWNrTWFwLnZhbHVlcygpKTtcbiAgICAgICAgICAgIHNldFRvcFRyYWNrcyhtZXJnZWRUb3BUcmFja3Muc2xpY2UoMCwgNSkpOyAvLyBMaW1pdCB0byBleGFjdGx5IDUgZGlzdGluY3QgdHJhY2tzXG4gICAgICAgICAgICBzZXRTaGVldFJlbGVhc2VzKHNoZWV0VHJhY2tzKTtcblxuICAgICAgICAgICAgY29uc3QgYWxsQWxidW1zID0gYWxidW1SZXN1bHRzLmZsYXQoKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBBcHA6IFRvdGFsIGFsYnVtcyBmZXRjaGVkOiAke2FsbEFsYnVtcy5sZW5ndGh9YCk7XG4gICAgICAgICAgICBpZiAoYWxsQWxidW1zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1bmlxdWVBbGJ1bXMgPSBBcnJheS5mcm9tKG5ldyBNYXAoYWxsQWxidW1zLm1hcChhID0+IFthLmlkLCBhXSkpLnZhbHVlcygpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzb3J0ZWRCeURhdGUgPSBbLi4udW5pcXVlQWxidW1zXS5zb3J0KChhLCBiKSA9PlxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZShiLnJlbGVhc2VfZGF0ZSkuZ2V0VGltZSgpIC0gbmV3IERhdGUoYS5yZWxlYXNlX2RhdGUpLmdldFRpbWUoKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3ZXN0SWRzID0gbmV3IFNldChzb3J0ZWRCeURhdGUuc2xpY2UoMCwgNSkubWFwKGEgPT4gYS5pZCkpO1xuICAgICAgICAgICAgICAgIHNldE5ld2VzdEFsYnVtSWRzKG5ld2VzdElkcyk7XG4gICAgICAgICAgICAgICAgc2V0TWVyZ2VkQWxidW1zKHVuaXF1ZUFsYnVtcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiRmV0Y2ggRXJyb3I6XCIsIGVycik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBzZXRMb2FkaW5nKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7IGZldGNoQXJ0aXN0RGF0YSgpOyB9LCBbZmV0Y2hBcnRpc3REYXRhXSk7XG5cbiAgICBjb25zdCBoYW5kbGVDbG9zZUxhbmRpbmcgPSAoKSA9PiB7XG4gICAgICAgIHNldFNob3dMYW5kaW5nKGZhbHNlKTtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2RtZ19sYXN0X3JlbGVhc2VzX2hhc2gnLCBjdXJyZW50UmVsZWFzZXNIYXNoKTtcbiAgICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbSgnZG1nX2xhbmRpbmdfc2hvd25fc2Vzc2lvbicsICd0cnVlJyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNhdGFsb2dBbGJ1bXMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgbGV0IGFsYnVtcyA9IHNlYXJjaFF1ZXJ5XG4gICAgICAgICAgICA/IG1lcmdlZEFsYnVtcy5maWx0ZXIoYSA9PiBhLm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyhzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpKSlcbiAgICAgICAgICAgIDogWy4uLm1lcmdlZEFsYnVtc107XG5cbiAgICAgICAgaWYgKCFzZWFyY2hRdWVyeSAmJiBhbGJ1bVR5cGVGaWx0ZXIgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICBhbGJ1bXMgPSBhbGJ1bXMuZmlsdGVyKGEgPT4gYS5hbGJ1bV90eXBlID09PSBhbGJ1bVR5cGVGaWx0ZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlYXJjaFF1ZXJ5ID8gYWxidW1zIDogc2h1ZmZsZUFycmF5KGFsYnVtcyk7XG4gICAgfSwgW21lcmdlZEFsYnVtcywgYWxidW1UeXBlRmlsdGVyLCBzZWFyY2hRdWVyeV0pO1xuXG4gICAgY29uc3Qgc2VhcmNoVHJhY2tzID0gdXNlTWVtbygoKSA9PiB7XG4gICAgICAgIGlmICghc2VhcmNoUXVlcnkpIHJldHVybiBbXTtcbiAgICAgICAgY29uc3QgcXVlcnkgPSBzZWFyY2hRdWVyeS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBjb25zdCBhbGxUcmFja3MgPSBbLi4udG9wVHJhY2tzLCAuLi5zaGVldFJlbGVhc2VzXTtcbiAgICAgICAgY29uc3QgdW5pcXVlID0gQXJyYXkuZnJvbShuZXcgTWFwKGFsbFRyYWNrcy5tYXAodCA9PiBbdC5pZCwgdF0pKS52YWx1ZXMoKSk7XG4gICAgICAgIHJldHVybiB1bmlxdWUuZmlsdGVyKHQgPT4gdC5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkpIHx8IHQuYXJ0aXN0cy5zb21lKGEgPT4gYS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMocXVlcnkpKSk7XG4gICAgfSwgW3NlYXJjaFF1ZXJ5LCB0b3BUcmFja3MsIHNoZWV0UmVsZWFzZXNdKTtcblxuICAgIGNvbnN0IGRpc3BsYXllZEFsYnVtcyA9IHVzZU1lbW8oKCkgPT4ge1xuICAgICAgICByZXR1cm4gY2F0YWxvZ0FsYnVtcy5zbGljZSgwLCB2aXNpYmxlQ291bnQpO1xuICAgIH0sIFtjYXRhbG9nQWxidW1zLCB2aXNpYmxlQ291bnRdKTtcblxuICAgIGNvbnN0IGhhc01vcmUgPSB2aXNpYmxlQ291bnQgPCBjYXRhbG9nQWxidW1zLmxlbmd0aDtcblxuICAgIGNvbnN0IGhhbmRsZUxvYWRNb3JlID0gKCkgPT4ge1xuICAgICAgICBzZXRWaXNpYmxlQ291bnQocHJldiA9PiBwcmV2ICsgSVRFTVNfUEVSX1BBR0UpO1xuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1pbi1oLXNjcmVlbiBiZy1bIzAyMDYxN10gdGV4dC1zbGF0ZS0yMDAgc2VsZWN0aW9uOmJnLWJsdWUtNTAwLzMwXCI+XG4gICAgICAgICAgICB7bG9hZGluZyAmJiAhbWFpbkFydGlzdCAmJiBtZXJnZWRBbGJ1bXMubGVuZ3RoID09PSAwID8gKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctc2NyZWVuLTJ4bCBteC1hdXRvIHB4LTQgcHQtNDBcIj5cbiAgICAgICAgICAgICAgICAgICAgPFNrZWxldG9uTG9hZGVyIC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctc2NyZWVuLTJ4bCBteC1hdXRvIHB4LTQgbWQ6cHgtNiBwYi0yNCBmb250LXNhbnMgdGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgICAgICAgICB7c2hvd0xhbmRpbmcgJiYgdXBjb21pbmdSZWxlYXNlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxQcmVzYXZlTW9kYWwgcmVsZWFzZXM9e3VwY29taW5nUmVsZWFzZXN9IG9uQ2xvc2U9e2hhbmRsZUNsb3NlTGFuZGluZ30gLz5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICB7IXNob3dMYW5kaW5nICYmIDxGb2xsb3dVc01vZGFsIC8+fVxuXG4gICAgICAgICAgICAgICAgICAgIHsvKiBUb2FzdCBkZSBOb3RpZmljYWNpb25lcyAqL31cbiAgICAgICAgICAgICAgICAgICAge3Nob3dOb3RpZnlUb2FzdCAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpeGVkIHRvcC0yNCByaWdodC02IHotWzIwMF0gYmctYmx1ZS02MDAgdGV4dC13aGl0ZSBweC02IHB5LTQgcm91bmRlZC0yeGwgc2hhZG93LTJ4bCBhbmltYXRlLWZhZGUtaW4gZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTMgYm9yZGVyIGJvcmRlci13aGl0ZS8yMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCZWxsSWNvbiBjbGFzc05hbWU9XCJ3LTUgaC01XCIgYWN0aXZlIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctd2lkZXN0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtub3RpZmljYXRpb25zQWN0aXZlID8gJ8KhTm90aWZpY2FjaW9uZXMgQWN0aXZhZGFzIScgOiAnTm90aWZpY2FjaW9uZXMgRGVzYWN0aXZhZGFzJ31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICA8bmF2IGNsYXNzTmFtZT17YHN0aWNreSB0b3AtNCB6LVs0NV0gbWItMTIgdHJhbnNpdGlvbi1hbGwgZHVyYXRpb24tNTAwICR7c2Nyb2xsZWQgPyAnc2NhbGUtOTUnIDogJ3NjYWxlLTEwMCd9YH0+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YGJnLXNsYXRlLTkwMC84MCBiYWNrZHJvcC1ibHVyLTN4bCBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHJvdW5kZWQtZnVsbCBweC02IHB5LTMgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuIGdhcC00IHNoYWRvdy0yeGwgdHJhbnNpdGlvbi1hbGwgJHtzY3JvbGxlZCA/ICdib3JkZXItYmx1ZS01MDAvMzAgc2hhZG93LWJsdWUtNTAwLzEwJyA6ICcnfWB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJpYmxpY2FsRWFzdGVyRWdnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyYz1cIi9kaW9zbWFzZ3ltX3Byb2ZpbGUuanBnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbHQ9XCJMb2dvXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93QmlvTW9kYWwodHJ1ZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy0xMCBoLTEwIHJvdW5kZWQtZnVsbCBib3JkZXIgYm9yZGVyLXdoaXRlLzIwIGN1cnNvci1wb2ludGVyIGhvdmVyOnJvdGF0ZS0xMiB0cmFuc2l0aW9uLXRyYW5zZm9ybSBzaGFkb3ctbGcgc2hhZG93LWJsdWUtNTAwLzIwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQmlibGljYWxFYXN0ZXJFZ2c+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJoaWRkZW4gc206YmxvY2sgdGV4dC1bMTFweF0gZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuM2VtXSB0ZXh0LWJsdWUtNTAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaW9zbWFzZ3ltIFJlY29yZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9oMT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIG1kOmdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIkJ1c2Nhci4uLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlYXJjaFF1ZXJ5fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0U2VhcmNoUXVlcnkoZS50YXJnZXQudmFsdWUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJnLXdoaXRlLzUgYm9yZGVyIGJvcmRlci13aGl0ZS8xMCByb3VuZGVkLWZ1bGwgcHktMi41IHB4LTQgcGwtMTAgdGV4dC1bMTBweF0gc206dGV4dC14cyBmb250LWJvbGQgdGV4dC13aGl0ZSBwbGFjZWhvbGRlcjp0ZXh0LXdoaXRlLzQwIGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpib3JkZXItYmx1ZS01MDAgdy0zMiBzbTp3LTQ4IG1kOnctNjQgdHJhbnNpdGlvbi1hbGwgc2hhZG93LWlubmVyXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cInctNCBoLTQgdGV4dC13aGl0ZS80MCBhYnNvbHV0ZSBsZWZ0LTMuNSB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzJcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlV2lkdGg9ezIuNX0gZD1cIk0yMSAyMWwtNi02bTItNWE3IDcgMCAxMS0xNCAwIDcgNyAwIDAxMTQgMHpcIiAvPjwvc3ZnPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlTm90aWZpY2F0aW9uc31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHAtMi41IHJvdW5kZWQtZnVsbCBib3JkZXIgdHJhbnNpdGlvbi1hbGwgJHtub3RpZmljYXRpb25zQWN0aXZlID8gJ2JnLWJsdWUtNjAwIGJvcmRlci1ibHVlLTQwMCB0ZXh0LXdoaXRlJyA6ICdiZy13aGl0ZS81IGJvcmRlci13aGl0ZS8xMCB0ZXh0LXdoaXRlLzQwIGhvdmVyOnRleHQtd2hpdGUnfWB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT17bm90aWZpY2F0aW9uc0FjdGl2ZSA/IFwiRGVzYWN0aXZhciBub3RpZmljYWNpb25lc1wiIDogXCJBY3RpdmFyIG5vdGlmaWNhY2lvbmVzXCJ9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCZWxsSWNvbiBjbGFzc05hbWU9XCJ3LTUgaC01XCIgYWN0aXZlPXtub3RpZmljYXRpb25zQWN0aXZlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93UXVvdGVNb2RhbCh0cnVlKX0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZ2FwLTIgdGV4dC1bOXB4XSBmb250LWJsYWNrIHVwcGVyY2FzZSB0cmFja2luZy13aWRlc3QgYmctYmx1ZS02MDAgaG92ZXI6YmctYmx1ZS01MDAgdGV4dC13aGl0ZSBweC02IHB5LTIuNSByb3VuZGVkLWZ1bGwgc2hhZG93LWxnIHRyYW5zaXRpb24tYWxsIGFjdGl2ZTpzY2FsZS05NVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3JlYXIgRnJhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPC9uYXY+XG5cbiAgICAgICAgICAgICAgICAgICAgeyFzZWFyY2hRdWVyeSAmJiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cIm1iLTI0IHRleHQtY2VudGVyIGFuaW1hdGUtZmFkZS1pbiBweS0xMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtYmx1ZS01MDAgZm9udC1ibGFjayB1cHBlcmNhc2UgdHJhY2tpbmctWzAuNGVtXSB0ZXh0LVsxMHB4XSBtYi00XCI+T2ZmaWNpYWwgQXJ0aXN0IERpc2NvZ3JhcGh5PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LTZ4bCBtZDp0ZXh0LTl4bCBmb250LWJsYWNrIHRyYWNraW5nLXRpZ2h0ZXIgdXBwZXJjYXNlIGxlYWRpbmctbm9uZSBtYi0yMCBkcm9wLXNoYWRvdy0yeGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlvc21hc2d5bSA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzIwXCI+UmVjb3Jkczwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtOCBtYXgtdy00eGwgbXgtYXV0b1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlLzUgcC04IHJvdW5kZWQtWzIuNXJlbV0gYm9yZGVyIGJvcmRlci1ibHVlLTUwMC8yMCBiYWNrZHJvcC1ibHVyLXhsIGZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIHNoYWRvdy1bMF8wXzUwcHhfcmdiYSg1OSwxMzAsMjQ2LDAuMSldIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOnNjYWxlLVsxLjAyXVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB0ZXh0LWJsdWUtNTAwIHVwcGVyY2FzZSB0cmFja2luZy1bMC40ZW1dIG1iLTRcIj5EaW9zbWFzZ3ltPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17U09DSUFMX0xJTktTLmRpb3NtYXNneW0uc3BvdGlmeX0gdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3NOYW1lPVwicC0zIGJnLWJsYWNrLzQwIHJvdW5kZWQteGwgaG92ZXI6YmctWyMxREI5NTRdLzIwIHRyYW5zaXRpb24tYWxsXCI+PFNwb3RpZnlJY29uIGNsYXNzTmFtZT1cInctNSBoLTUgdGV4dC1bIzFEQjk1NF1cIiAvPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtTT0NJQUxfTElOS1MuZGlvc21hc2d5bS55b3V0dWJlfSB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzc05hbWU9XCJwLTMgYmctYmxhY2svNDAgcm91bmRlZC14bCBob3ZlcjpiZy1bI0ZGMDAwMF0vMjAgdHJhbnNpdGlvbi1hbGxcIj48WW91dHViZU11c2ljSWNvbiBjbGFzc05hbWU9XCJ3LTUgaC01IHRleHQtWyNGRjAwMDBdXCIgLz48L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj17U09DSUFMX0xJTktTLmRpb3NtYXNneW0udGlrdG9rfSB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzc05hbWU9XCJwLTMgYmctYmxhY2svNDAgcm91bmRlZC14bCBob3ZlcjpiZy13aGl0ZS8yMCB0cmFuc2l0aW9uLWFsbFwiPjxUaWt0b2tJY29uIGNsYXNzTmFtZT1cInctNSBoLTUgdGV4dC13aGl0ZVwiIC8+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWFtYmVyLTUwMC81IHAtOCByb3VuZGVkLVsyLjVyZW1dIGJvcmRlciBib3JkZXItYW1iZXItNTAwLzMwIGJhY2tkcm9wLWJsdXIteGwgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgc2hhZG93LVswXzBfNTBweF9yZ2JhKDI0NSwxNTgsMTEsMC4xNSldIHRyYW5zaXRpb24tdHJhbnNmb3JtIGhvdmVyOnNjYWxlLVsxLjAyXVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bMTBweF0gZm9udC1ibGFjayB0ZXh0LWFtYmVyLTUwMCB1cHBlcmNhc2UgdHJhY2tpbmctWzAuNGVtXSBtYi00XCI+SnVhbiA2MTQ8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZ2FwLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtTT0NJQUxfTElOS1MuanVhbjYxNC5zcG90aWZ5fSB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzc05hbWU9XCJwLTMgYmctYmxhY2svNDAgcm91bmRlZC14bCBob3ZlcjpiZy1bIzFEQjk1NF0vMjAgdHJhbnNpdGlvbi1hbGxcIj48U3BvdGlmeUljb24gY2xhc3NOYW1lPVwidy01IGgtNSB0ZXh0LVsjMURCOTU0XVwiIC8+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e1NPQ0lBTF9MSU5LUy5qdWFuNjE0LmFwcGxlfSB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzc05hbWU9XCJwLTMgYmctYmxhY2svNDAgcm91bmRlZC14bCBob3ZlcjpiZy1bI0ZBMjQzQ10vMjAgdHJhbnNpdGlvbi1hbGxcIj48QXBwbGVNdXNpY0ljb24gY2xhc3NOYW1lPVwidy01IGgtNSB0ZXh0LVsjRkEyNDNDXVwiIC8+PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e1NPQ0lBTF9MSU5LUy5qdWFuNjE0LnRpa3Rva30gdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3NOYW1lPVwicC0zIGJnLWJsYWNrLzQwIHJvdW5kZWQteGwgaG92ZXI6Ymctd2hpdGUvMjAgdHJhbnNpdGlvbi1hbGxcIj48VGlrdG9rSWNvbiBjbGFzc05hbWU9XCJ3LTUgaC01IHRleHQtd2hpdGVcIiAvPjwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3NlYXJjaFF1ZXJ5ICYmIHNlYXJjaFRyYWNrcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJhbmltYXRlLWZhZGUtaW4gbXQtMTYgcHgtMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00IG1iLTEwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMS41IGgtOCBiZy1bIzFEQjk1NF0gcm91bmRlZC1mdWxsIHNoYWRvdy1bMF8wXzIwcHhfcmdiYSgyOSwxODUsODQsMC42KV1cIj48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJsYWNrIHRyYWNraW5nLXRpZ2h0ZXIgdXBwZXJjYXNlXCI+Q2FuY2lvbmVzIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWyMxREI5NTRdXCI+RW5jb250cmFkYXM8L3NwYW4+PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctWyMwNTBiMThdIHJvdW5kZWQtWzJyZW1dIHAtNiBtZDpwLTEwIGJvcmRlciBib3JkZXItd2hpdGUvNSBzaGFkb3ctMnhsIGJhY2tkcm9wLWJsdXIteGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUb3BUcmFja3MgdHJhY2tzPXtzZWFyY2hUcmFja3N9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHshc2VhcmNoUXVlcnkgJiYgdXBjb21pbmdSZWxlYXNlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzc05hbWU9XCJhbmltYXRlLWZhZGUtaW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCBtYi0xNiBweC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMS41IGgtMTAgYmctYmx1ZS02MDAgcm91bmRlZC1mdWxsIHNoYWRvdy1bMF8wXzIwcHhfcmdiYSg1OSwxMzAsMjQ2LDAuNildXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC00eGwgZm9udC1ibGFjayB0cmFja2luZy10aWdodGVyIHVwcGVyY2FzZVwiPlByw7N4aW1vcyA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNTAwXCI+RXN0cmVub3M8L3NwYW4+PC9oMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMSBtZDpncmlkLWNvbHMtMiBnYXAtOCBsZzpnYXAtMTZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt1cGNvbWluZ1JlbGVhc2VzLm1hcCgocmVsZWFzZSwgaWR4KSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFVwY29taW5nUmVsZWFzZUNhcmQga2V5PXtgcmVsZWFzZS0ke2lkeH1gfSByZWxlYXNlPXtyZWxlYXNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHshc2VhcmNoUXVlcnkgJiYgc2hlZXRSZWxlYXNlcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TmV3UmVsZWFzZXNTbGlkZXIgcmVsZWFzZXM9e3NoZWV0UmVsZWFzZXN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7IXNlYXJjaFF1ZXJ5ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8UmFuZG9tUmVjb21tZW5kYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxidW1zPXttZXJnZWRBbGJ1bXN9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYWNrcz17dG9wVHJhY2tzfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFsYnVtU2VsZWN0PXtzZXRTZWxlY3RlZEFsYnVtfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblRyYWNrU2VsZWN0PXsoKSA9PiB7IH19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICl9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGlkPVwiY2F0YWxvZ29cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgc206ZmxleC1yb3cgaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0xNiBnYXAtOFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC00XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMS41IGgtMTAgYmctYmx1ZS02MDAgcm91bmRlZC1mdWxsIHNoYWRvdy1bMF8wXzIwcHhfcmdiYSg1OSwxMzAsMjQ2LDAuNildXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC00eGwgZm9udC1ibGFjayB0cmFja2luZy10aWdodGVyIHVwcGVyY2FzZVwiPkNhdMOhbG9nbyA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNTAwXCI+T2ZpY2lhbDwvc3Bhbj48L2gyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGJnLXNsYXRlLTkwMCBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIHAtMS41IHJvdW5kZWQtMnhsIGJhY2tkcm9wLWJsdXItM3hsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KFsnYWxsJywgJ2FsYnVtJywgJ3NpbmdsZSddIGFzIGNvbnN0KS5tYXAodHlwZSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBrZXk9e3R5cGV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHsgc2V0QWxidW1UeXBlRmlsdGVyKHR5cGUpOyBzZXRWaXNpYmxlQ291bnQoSVRFTVNfUEVSX1BBR0UpOyB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e2BweC04IHB5LTMgcm91bmRlZC14bCB0ZXh0LVs5cHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLXdpZGVzdCB0cmFuc2l0aW9uLWFsbCAke2FsYnVtVHlwZUZpbHRlciA9PT0gdHlwZSA/ICdiZy1ibHVlLTYwMCB0ZXh0LXdoaXRlIHNoYWRvdy1sZycgOiAndGV4dC1ncmF5LTUwMCBob3Zlcjp0ZXh0LXdoaXRlJ31gfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3R5cGUgPT09ICdhbGwnID8gJ1RvZG8nIDogdHlwZSA9PT0gJ2FsYnVtJyA/ICfDgWxidW1lcycgOiAnU2luZ2xlcyd9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgc206Z3JpZC1jb2xzLTMgbGc6Z3JpZC1jb2xzLTQgeGw6Z3JpZC1jb2xzLTYgZ2FwLTQgbWQ6Z2FwLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Rpc3BsYXllZEFsYnVtcy5tYXAoKGFsYnVtKSA9PiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QWxidW1DYXJkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAga2V5PXthbGJ1bS5pZH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGJ1bT17YWxidW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TZWxlY3Q9e3NldFNlbGVjdGVkQWxidW19XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNOZXdlc3Q9e25ld2VzdEFsYnVtSWRzLmhhcyhhbGJ1bS5pZCl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtoYXNNb3JlICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0yMCBmbGV4IGp1c3RpZnktY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlTG9hZE1vcmV9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ3JvdXAgcmVsYXRpdmUgYmctd2hpdGUvNSBib3JkZXIgYm9yZGVyLXdoaXRlLzEwIGhvdmVyOmJvcmRlci1ibHVlLTUwMC81MCBweC0xNiBweS02IHJvdW5kZWQtM3hsIHRyYW5zaXRpb24tYWxsIGhvdmVyOnNjYWxlLTEwNSBhY3RpdmU6c2NhbGUtOTVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtWzEwcHhdIGZvbnQtYmxhY2sgdXBwZXJjYXNlIHRyYWNraW5nLVswLjRlbV0gdGV4dC13aGl0ZS80MCBncm91cC1ob3Zlcjp0ZXh0LXdoaXRlIHRyYW5zaXRpb24tY29sb3JzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENhcmdhciBtw6FzIGxhbnphbWllbnRvc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC1ib3R0b20tMiBsZWZ0LTEvMiAtdHJhbnNsYXRlLXgtMS8yIHctMTIgaC0xIGJnLWJsdWUtNjAwIHJvdW5kZWQtZnVsbCBvcGFjaXR5LTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5IHNoYWRvdy1bMF8wXzE1cHhfcmdiYSg1OSwxMzAsMjQ2LDAuOCldXCI+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgICAgICAgICAgICAgICAgICAge3RvcFRyYWNrcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbGc6Z3JpZC1jb2xzLTEyIGdhcC0xNlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOmNvbC1zcGFuLThcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImJnLVsjMDUwYjE4XSByb3VuZGVkLVszcmVtXSBwLTggbWQ6cC0xMiBib3JkZXIgYm9yZGVyLXdoaXRlLzUgc2hhZG93LTN4bCBiYWNrZHJvcC1ibHVyLTN4bCBoLWZ1bGxcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ibGFjayBtYi0xMiBmbGV4IGl0ZW1zLWNlbnRlciBnYXAtNCB1cHBlcmNhc2UgdHJhY2tpbmctdGlnaHRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtMiBiZy1bIzFEQjk1NF0vMTAgcm91bmRlZC1mdWxsXCI+PFNwb3RpZnlJY29uIGNsYXNzTmFtZT1cInctOCBoLTggdGV4dC1bIzFEQjk1NF1cIiAvPjwvZGl2PiBUb3AgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1bIzFEQjk1NF1cIj5IaXRzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRvcFRyYWNrcyB0cmFja3M9e3RvcFRyYWNrc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGc6Y29sLXNwYW4tNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRpa1Rva0ZlZWQgLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICApfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB7IXNlYXJjaFF1ZXJ5ICYmIDxDb250YWN0Rm9ybSBhbGJ1bXM9e21lcmdlZEFsYnVtc30gdHJhY2tzPXt0b3BUcmFja3N9IC8+fVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICAgICAgICA8U2Nyb2xsVG9Ub3BCdXR0b24gLz5cblxuICAgICAgICAgICAgICAgICAgICB7c2hvd1RpbWVsaW5lTW9kYWwgJiYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotWzE2MF0gYmctc2xhdGUtOTUwIG92ZXJmbG93LXktYXV0byBhbmltYXRlLWZhZGUtaW4gY3VzdG9tLXNjcm9sbGJhclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3RpY2t5IHRvcC0wIHotWzE3MF0gcC02IGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBiZy1zbGF0ZS05NTAvODAgYmFja2Ryb3AtYmx1ci1tZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTUwMCBmb250LWJsYWNrIHRleHQteHMgdXBwZXJjYXNlIHRyYWNraW5nLVswLjVlbV1cIj5EaW9zbWFzZ3ltIFJlY29yZHMgSGlzdG9yeTwvaDM+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0U2hvd1RpbWVsaW5lTW9kYWwoZmFsc2UpfSBjbGFzc05hbWU9XCJiZy13aGl0ZS81IHAtNCByb3VuZGVkLWZ1bGwgdGV4dC13aGl0ZSBib3JkZXIgYm9yZGVyLXdoaXRlLzEwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzTmFtZT1cInctNiBoLTZcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj48cGF0aCBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIgc3Ryb2tlV2lkdGg9ezIuNX0gZD1cIk02IDE4TDE4IDZNNiA2bDEyIDEyXCIgLz48L3N2Zz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYi0zMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RXZvbHV0aW9uVGltZWxpbmUgYWxidW1zPXttZXJnZWRBbGJ1bXN9IG9uU2VsZWN0PXsoYSkgPT4geyBzZXRTZWxlY3RlZEFsYnVtKGEpOyBzZXRTaG93VGltZWxpbmVNb2RhbChmYWxzZSk7IH19IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cblxuICAgICAgICAgICAgICAgICAgICB7c2VsZWN0ZWRBbGJ1bSAmJiA8QWxidW1EZXRhaWxNb2RhbCBhbGJ1bT17c2VsZWN0ZWRBbGJ1bX0gb25DbG9zZT17KCkgPT4gc2V0U2VsZWN0ZWRBbGJ1bShudWxsKX0gLz59XG4gICAgICAgICAgICAgICAgICAgIHtzaG93UXVvdGVNb2RhbCAmJiA8UXVvdGVHZW5lcmF0b3JNb2RhbCBvbkNsb3NlPXsoKSA9PiBzZXRTaG93UXVvdGVNb2RhbChmYWxzZSl9IGFsYnVtcz17bWVyZ2VkQWxidW1zfSAvPn1cbiAgICAgICAgICAgICAgICAgICAge3Nob3dCaW9Nb2RhbCAmJiA8QmlvZ3JhcGh5IG9uQ2xvc2U9eygpID0+IHNldFNob3dCaW9Nb2RhbChmYWxzZSl9IC8+fVxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDtcbiJdLCJmaWxlIjoiQzovVXNlcnMvcmVkaW0vT25lRHJpdmUvRXNjcml0b3Jpby9BcHAvc3JjL0FwcC50c3gifQ==