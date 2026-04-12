import React from 'react';
import { motion } from 'framer-motion';
import { Play, Music2, ArrowRight, Star, Disc3 } from 'lucide-react';
import SpotifyIcon from './SpotifyIcon';

const STATS = [
    { value: '150+', label: 'Obras Publicadas' },
    { value: '1.2M', label: 'Oyentes Mensuales' },
    { value: '5+', label: 'Años en la Industria' },
];

const TAGS = ['Christian Rap', 'Regional Mexicano', 'Urban Gospel', 'Prod. Independiente'];

const FeaturedArtistSection: React.FC = () => {
    return (
        <section className="relative py-8">
            {/* Full-width cinematic banner */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
                style={{ minHeight: '420px' }}
            >
                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src="/diosmasgym_profile.jpg"
                        alt="Diosmasgym"
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Gradient left-to-right for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent" />
                    {/* Bottom fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/60 via-transparent to-transparent" />
                </div>

                {/* Floating accent glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-14 max-w-2xl">
                    {/* Pre-title badge */}
                    <div className="flex items-center gap-2 mb-5">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md">
                            <Star size={10} className="text-blue-400 fill-current" />
                            <span className="text-blue-400 font-black text-[9px] uppercase tracking-[0.3em]">Artista Insignia · Diosmasgym Records</span>
                        </div>
                    </div>

                    {/* Name */}
                    <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                        Diosmasgym
                    </h2>

                    {/* Description */}
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed opacity-80 mb-7 max-w-lg">
                        Música con propósito. Fusiona líricas de fe, producción urbana y raíces regionales. Una propuesta honesta y diferente que marca su propio género.
                    </p>

                    {/* Genre tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {TAGS.map(tag => (
                            <span key={tag} className="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Stats row */}
                    <div className="flex flex-wrap gap-6 mb-8">
                        {STATS.map(s => (
                            <div key={s.label}>
                                <p className="text-2xl font-black text-white">{s.value}</p>
                                <p className="text-[8px] font-black uppercase tracking-widest text-white/30">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-[#1DB954] text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[9px] hover:brightness-110 transition-all shadow-lg"
                        >
                            <SpotifyIcon className="w-4 h-4" />
                            Escuchar en Spotify
                        </a>
                        <button
                            className="flex items-center gap-2 glass border border-white/10 text-white px-6 py-3 rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all"
                            onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            <Disc3 size={14} />
                            Ver Catálogo
                        </button>
                    </div>
                </div>

                {/* Right side: floating vinyl decoration (hidden on mobile) */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 items-end">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                        className="w-28 h-28 rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-xl"
                    >
                        <Music2 className="w-10 h-10 text-white/30" />
                    </motion.div>
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Independent Label</span>
                </div>
            </motion.div>
        </section>
    );
};

export default FeaturedArtistSection;
