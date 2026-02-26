
import React, { useState, useEffect, useRef } from 'react';
import type { Album, Track } from '../types';
import { getAlbumTracks } from '../services/spotifyService';
import TrackItem from './TrackItem';
import Spinner from './Spinner';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';
import { GoogleGenAI } from "@google/genai";

interface AlbumDetailModalProps {
    album: Album | null;
    onClose: () => void;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({ album, onClose }) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLyricsTrack, setSelectedLyricsTrack] = useState<Track | null>(null);
    const [lyrics, setLyrics] = useState<string>("");
    const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
    const [loadingLyrics, setLoadingLyrics] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (album) {
            document.body.style.overflow = 'hidden';
            setLoading(true);
            setTracks([]);
            getAlbumTracks(album.id)
                .then(simplifiedTracks => {
                    const fullTracks: Track[] = simplifiedTracks.map(st => ({
                        ...st,
                        album: album,
                        source: 'spotify',
                    }));
                    setTracks(fullTracks);
                })
                .catch(err => {
                    console.error("Failed to load album tracks:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [album]);

    const fetchLyrics = async (track: Track) => {
        setSelectedLyricsTrack(track);
        setLoadingLyrics(true);
        setLyrics("");
        setSources([]);
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const artistName = track.artists.map(a => a.name).join(", ");
            
            // Prompt optimizado para búsqueda real y extracción de texto
            const prompt = `Search the web using Google to find the official lyrics for the song "${track.name}" by "${artistName}". 
            IMPORTANT: Do not summarize. Find the actual text of the lyrics from the search results and display it here word for word as found. 
            If the lyrics are available on sites like Genius, AZLyrics, or similar, use those. 
            Format the output with clear line breaks. Only provide the lyrics.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    tools: [{ googleSearch: {} }]
                }
            });
            
            // Extraer fuentes de grounding
            const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
            const extractedSources: {title: string, uri: string}[] = [];
            
            if (groundingMetadata?.groundingChunks) {
                groundingMetadata.groundingChunks.forEach((chunk: any) => {
                    if (chunk.web && chunk.web.uri) {
                        extractedSources.push({
                            title: chunk.web.title || "Ver fuente original",
                            uri: chunk.web.uri
                        });
                    }
                });
            }

            // Eliminar duplicados de fuentes
            const uniqueSources = extractedSources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);
            setSources(uniqueSources);

            // Obtener el texto generado/extraído
            let text = response.text || "";
            // Limpieza básica de markdown si el modelo lo incluye por error
            text = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
            
            if (!text || text.length < 20) {
                setLyrics("No se pudo extraer el texto de la letra de los resultados de búsqueda. Intenta buscarla directamente en los enlaces de abajo.");
            } else {
                setLyrics(text);
            }
            
        } catch (error) {
            console.error("Error fetching lyrics with Google Search:", error);
            setLyrics("Hubo un error al realizar la búsqueda en Google. Por favor, intenta de nuevo en unos segundos.");
        } finally {
            setLoadingLyrics(false);
        }
    };

    if (!album) return null;
    
    const artistName = album.artists.map(a => a.name).join(', ');
    const youtubeUrl = `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + artistName)}`;
    const appleMusicUrl = `https://music.apple.com/us/search?term=${encodeURIComponent(album.name + " " + artistName)}`;
    const spotifyUrl = album.external_urls.spotify || '';

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 animate-fade-in overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/95 md:backdrop-blur-2xl transition-all duration-700" onClick={onClose}></div>

            <div 
                className="relative w-full h-full md:h-[85vh] md:max-w-7xl bg-slate-950 md:rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] border-t md:border border-white/10 flex flex-col md:flex-row animate-pop-in"
            >
                <div 
                    className="absolute inset-0 opacity-30 blur-[120px] pointer-events-none scale-150 transition-all duration-1000"
                    style={{ backgroundImage: `url(${album.images?.[0]?.url})`, backgroundSize: 'cover' }}
                ></div>

                {/* Visor de Letras (Overlay con prioridad máxima) */}
                {selectedLyricsTrack && (
                    <div className="absolute inset-0 z-[200] bg-slate-950 flex flex-col animate-fade-in">
                        <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <img src={selectedLyricsTrack.album.images[0].url} className="w-12 h-12 rounded-lg shadow-lg border border-white/10" alt="" />
                                <div>
                                    <h4 className="text-white font-black text-sm uppercase tracking-tight">{selectedLyricsTrack.name}</h4>
                                    <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest">{artistName}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedLyricsTrack(null)}
                                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all border border-white/10"
                            >
                                <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-20 text-center bg-gradient-to-b from-transparent to-blue-900/10">
                            {loadingLyrics ? (
                                <div className="h-full flex flex-col items-center justify-center gap-6">
                                    <Spinner />
                                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Buscando letra en la web...</p>
                                </div>
                            ) : (
                                <div className="max-w-2xl mx-auto pb-20">
                                    <pre className="text-white text-xl md:text-3xl font-bold leading-[1.6] whitespace-pre-wrap font-sans tracking-tight animate-fade-in">
                                        {lyrics}
                                    </pre>
                                    
                                    {sources.length > 0 && (
                                        <div className="mt-20 pt-10 border-t border-white/5 text-left">
                                            <p className="text-blue-500 text-[9px] font-black uppercase tracking-[0.5em] mb-4">Fuentes encontradas:</p>
                                            <div className="flex flex-col gap-3">
                                                {sources.map((s, idx) => (
                                                    <a key={idx} href={s.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/40 hover:text-blue-400 text-[11px] font-bold transition-colors group">
                                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                                        <span className="underline decoration-white/10 group-hover:decoration-blue-500/50">{s.title}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-10 pt-10 border-t border-white/5">
                                        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">Diosmasgym Records • Letras Reales</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="relative z-20 w-full md:w-[40%] p-8 md:p-12 flex flex-col items-center md:items-start justify-center md:border-r border-white/5 bg-gradient-to-br from-black/40 to-transparent">
                    <button onClick={onClose} className="absolute top-6 right-6 md:hidden p-3 bg-white/10 rounded-full border border-white/20 z-50">
                        <CloseIcon className="w-5 h-5 text-white" />
                    </button>

                    <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-full md:aspect-square mb-8 group">
                        <div className="absolute -inset-6 bg-blue-600/30 blur-[60px] rounded-full opacity-60"></div>
                        <img 
                            src={album.images?.[0]?.url} 
                            alt={album.name} 
                            className="relative w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,1)] border border-white/20"
                        />
                    </div>

                    <div className="text-center md:text-left w-full">
                        <div className="inline-flex items-center gap-2 mb-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-xl">
                            <span className="text-blue-400 text-[9px] font-black uppercase tracking-[0.3em]">
                                {album.album_type === 'single' ? 'Sencillo' : 'Álbum Oficial'}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tighter leading-tight drop-shadow-2xl">
                            {album.name}
                        </h2>
                        <p className="text-lg text-blue-500/80 font-black mb-8 uppercase tracking-[0.4em] truncate">{artistName}</p>
                    </div>
                </div>

                <div className="relative z-20 flex-1 flex flex-col min-h-0 bg-black/60 backdrop-blur-3xl">
                    <div ref={scrollContainerRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:px-12 md:py-10">
                        <section className="mb-12 animate-fade-in">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Escuchar Catálogo Completo</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                <a href={spotifyUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <SpotifyIcon className="w-5 h-5" /> Spotify
                                </a>
                                <a href={appleMusicUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#FA243C] hover:bg-[#fa3c52] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <AppleMusicIcon className="w-5 h-5" /> Apple
                                </a>
                                <a href={youtubeUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-3 bg-[#FF0000] hover:bg-[#ff3333] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-lg border border-white/10">
                                    <YoutubeMusicIcon className="w-5 h-5" /> YouTube
                                </a>
                            </div>
                        </section>
                        <div className="h-px w-full bg-white/5 mb-10"></div>
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Contenido del Lanzamiento</h3>
                            </div>
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-6">
                                    <Spinner />
                                    <span className="text-[9px] font-black uppercase tracking-[0.5em] text-blue-500">Cargando pistas...</span>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 pb-12">
                                    {tracks.map((track, index) => (
                                        <TrackItem
                                            key={track.id}
                                            track={track}
                                            index={index}
                                            isPlaying={false}
                                            onShowLyrics={fetchLyrics}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                    <button onClick={onClose} className="hidden md:flex absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white border border-white/10 shadow-2xl z-[60]">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-pop-in {
                    animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(255, 255, 255, 0.1); 
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};

export default AlbumDetailModal;
