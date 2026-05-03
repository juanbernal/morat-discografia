import React from 'react';
import { motion } from 'framer-motion';
import { Disc3, ExternalLink, Music2 } from 'lucide-react';
import SpotifyIcon from './SpotifyIcon';
import type { Album } from '../types';

interface FeaturedArtistSectionProps {
    albums?: Album[];
}

const FeaturedArtistSection: React.FC<FeaturedArtistSectionProps> = ({ albums = [] }) => {
    // Real stats derived from actual catalog
    const totalWorks = albums.length;
    const earliestYear = albums.length > 0
        ? Math.min(...albums.map(a => new Date(a.release_date).getFullYear()).filter(y => y > 2000))
        : new Date().getFullYear();
    const yearsActive = new Date().getFullYear() - earliestYear;
    const singlesCount = albums.filter(a => a.album_type === 'single').length;
    const albumsCount = albums.filter(a => a.album_type === 'album').length;

    const REAL_STATS = [
        { value: totalWorks > 0 ? `${totalWorks}+` : '—', label: 'Obras en Catálogo' },
        { value: singlesCount > 0 ? `${singlesCount}` : '—', label: 'Sencillos' },
        { value: albumsCount > 0 ? `${albumsCount}` : '—', label: 'Álbumes' },
        { value: yearsActive > 0 ? `${yearsActive}+` : '—', label: 'Años Activo' },
    ];

    return (
        <section className="py-8">
            {/* ——— MAGAZINE / PRESS-KIT STYLE BANNER ——— */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/8 bg-[#0b1120]"
            >
                {/* Subtle grid texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,1) 39px,rgba(255,255,255,1) 40px)',
                    }}
                />

                <div className="flex flex-col lg:flex-row">

                    {/* LEFT — Photo column */}
                    <div className="relative lg:w-[38%] flex-shrink-0">
                        <div className="aspect-[4/5] lg:aspect-auto lg:h-full relative overflow-hidden">
                            <img
                                src="/diosmasgym_profile.jpg"
                                alt="Foto de Diosmasgym, artista principal del sello"
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover object-top"
                                style={{ minHeight: '340px' }}
                            />
                            {/* Right-side fade to dark */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0b1120] hidden lg:block" />
                            {/* Bottom fade on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent lg:hidden" />

                            {/* "Sello" watermark on photo */}
                            <div className="absolute bottom-4 left-4 flex items-center gap-2 opacity-70">
                                <div className="w-1 h-10 bg-blue-500 rounded-full" />
                                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white writing-mode-vertical">
                                    Diosmasgym Records
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Content column */}
                    <div className="flex-1 flex flex-col justify-between p-8 md:p-12 lg:p-14">

                        {/* Top: label badge + tag */}
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-10">
                            <span className="text-[8px] font-black uppercase tracking-[0.5em] text-blue-500">
                                Artista Insignia · Diosmasgym Records
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 border border-white/10 px-3 py-1 rounded-full">
                                Música Independiente
                            </span>
                        </div>

                        {/* Large name */}
                        <div className="mb-8">
                            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                                Dios
                            </h2>
                            <h2 className="text-6xl md:text-8xl font-black text-white/20 uppercase tracking-tighter leading-none">
                                masgym
                            </h2>
                        </div>

                        {/* Quote / tagline */}
                        <blockquote className="border-l-2 border-blue-500 pl-5 mb-10">
                            <p className="text-slate-300 text-sm md:text-base leading-relaxed italic opacity-80 max-w-md">
                                "Música con propósito. Fusiona lírica de fe, producción urbana y raíces norteñas — una propuesta honesta que no persigue tendencias."
                            </p>
                        </blockquote>

                        {/* Real stats grid */}
                        <div className="grid grid-cols-4 gap-4 mb-10 border-t border-b border-white/5 py-6">
                            {REAL_STATS.map(stat => (
                                <div key={stat.label} className="text-center">
                                    <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                                    <p className="text-[7px] font-black uppercase tracking-widest text-white/30 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-[#1DB954] text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[8px] hover:brightness-110 transition-all shadow-lg"
                            >
                                <SpotifyIcon className="w-4 h-4" />
                                Spotify
                            </a>
                            <button
                                className="flex items-center gap-2 border border-white/15 text-white/70 px-6 py-3 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-white/5 hover:text-white transition-all"
                                onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <Disc3 size={13} />
                                Catálogo completo
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedArtistSection;
