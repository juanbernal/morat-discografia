import React, { useRef } from 'react';
import type { Track } from '../types';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import html2canvas from 'html2canvas';

interface NewReleasesSliderProps {
    releases: Track[];
}

const NewReleasesSlider: React.FC<NewReleasesSliderProps> = ({ releases }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.offsetWidth * 0.8;
            current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    const downloadCard = async (track: Track) => {
        const element = document.getElementById(`release-card-${track.id}`);
        if (!element) return;

        const btn = document.getElementById(`download-btn-${track.id}`);
        if (btn) btn.style.display = 'none'; // ocultar botón en la foto

        try {
            const canvas = await html2canvas(element, {
                backgroundColor: '#0a0f1d',
                scale: 2,
                useCORS: true,
                logging: false
            });
            const link = document.createElement('a');
            link.download = `Estreno_${track.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading image', error);
        } finally {
            if (btn) btn.style.display = 'block';
        }
    };

    if (!releases || releases.length === 0) return null;

    return (
        <section className="mb-24 animate-fade-in">
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)]"></div>
                    <h2 className="text-4xl font-black tracking-tighter uppercase">Nuevos <span className="text-blue-500">Estrenos</span></h2>
                </div>
                <div className="flex gap-2 hidden md:flex">
                    <button onClick={() => scroll('left')} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all text-white/50 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={() => scroll('right')} className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all text-white/50 hover:text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 px-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {releases.map((track, idx) => (
                    <div
                        key={track.id || idx}
                        id={`release-card-${track.id}`}
                        className="snap-start shrink-0 w-72 md:w-80 lg:w-96 group relative bg-[#0a0f1d] border border-white/10 rounded-[2rem] p-4 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_20px_40px_rgba(59,130,246,0.15)] flex flex-col"
                    >
                        <div className="relative aspect-square rounded-[1.5rem] overflow-hidden mb-6 shadow-2xl">
                            <img
                                src={track.album.images[0]?.url || '/placeholder.png'}
                                alt={track.name}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="absolute top-4 left-4">
                                <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">New</span>
                            </div>

                            <div className="absolute top-4 right-4 z-50">
                                <button
                                    id={`download-btn-${track.id}`}
                                    onClick={(e) => { e.stopPropagation(); downloadCard(track); }}
                                    className="p-2.5 bg-black/60 hover:bg-blue-600 backdrop-blur text-white rounded-full transition-all shadow-xl border border-white/20 hover:border-blue-400 group/btn"
                                    title="Descargar imagen completa"
                                >
                                    <svg className="w-5 h-5 text-white/80 group-hover/btn:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-white mb-2 leading-tight line-clamp-2" title={track.name}>{track.name}</h3>
                                <p className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 line-clamp-1">
                                    {track.artists.map(a => a.name).join(', ')}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                {track.external_urls?.spotify && (
                                    <a
                                        href={track.external_urls.spotify}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-white py-3 rounded-xl transition-all duration-300 border border-[#1DB954]/20 hover:border-[#1DB954]"
                                    >
                                        <SpotifyIcon className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Spotify</span>
                                    </a>
                                )}
                                {track.external_urls?.youtube && (
                                    <a
                                        href={track.external_urls.youtube}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white py-3 rounded-xl transition-all duration-300 border border-[#FF0000]/20 hover:border-[#FF0000]"
                                    >
                                        <YoutubeMusicIcon className="w-5 h-5" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">YouTube</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewReleasesSlider;
