import React from 'react';
import { motion } from 'framer-motion';
import { Disc3, ArrowUpRight, Radio, Music2 } from 'lucide-react';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import InstagramIcon from './InstagramIcon';
import TiktokIcon from './TiktokIcon';

const PLATFORMS = [
    {
        name: 'Spotify',
        label: 'Escuchar ahora',
        icon: <SpotifyIcon className="w-5 h-5" />,
        color: 'hover:border-green-500/40 hover:bg-green-500/5',
        iconColor: 'text-green-400',
        url: 'https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do',
    },
    {
        name: 'YouTube Music',
        label: 'Ver videos',
        icon: <YoutubeMusicIcon className="w-5 h-5" />,
        color: 'hover:border-red-500/40 hover:bg-red-500/5',
        iconColor: 'text-red-400',
        url: 'https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow',
    },
    {
        name: 'Instagram',
        label: '@diosmasgym',
        icon: <InstagramIcon className="w-5 h-5" />,
        color: 'hover:border-pink-500/40 hover:bg-pink-500/5',
        iconColor: 'text-pink-400',
        url: 'https://www.instagram.com/diosmasgym',
    },
    {
        name: 'TikTok',
        label: '@diosmasgym',
        icon: <TiktokIcon className="w-5 h-5" />,
        color: 'hover:border-white/20 hover:bg-white/5',
        iconColor: 'text-white',
        url: 'https://tiktok.com/@diosmasgym',
    },
];

const GENRES = ['Christian Rap', 'Urban Gospel', 'Regional', 'Corrido', 'Banda'];

const SidebarExtras: React.FC = () => {
    return (
        <div className="flex flex-col gap-5 mt-5">

            {/* Plataformas */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-[2rem] border border-white/8 p-5"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Radio size={14} className="text-blue-400" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Plataformas</span>
                </div>
                <div className="flex flex-col gap-2">
                    {PLATFORMS.map(p => (
                        <a
                            key={p.name}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 transition-all ${p.color}`}
                        >
                            <span className={p.iconColor}>{p.icon}</span>
                            <div className="flex-grow">
                                <p className="text-white text-[10px] font-black uppercase tracking-wider">{p.name}</p>
                                <p className="text-white/30 text-[8px]">{p.label}</p>
                            </div>
                            <ArrowUpRight size={12} className="text-white/20 flex-shrink-0" />
                        </a>
                    ))}
                </div>
            </motion.div>

            {/* Mini About the Label */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[2rem] border border-white/8 p-5 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <Disc3 size={14} className="text-blue-400" />
                    </div>
                    <div>
                        <p className="text-white text-[10px] font-black uppercase tracking-wider">Diosmasgym Records</p>
                        <p className="text-white/30 text-[8px]">Sello Independiente</p>
                    </div>
                </div>
                <p className="text-white/40 text-[9px] leading-relaxed">
                    Música con propósito. Fe, arte y producción de vanguardia desde el norte de México.
                </p>
                <div className="flex flex-wrap gap-1.5 mt-4">
                    {GENRES.map(g => (
                        <span key={g} className="text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/8 text-white/30">
                            {g}
                        </span>
                    ))}
                </div>
            </motion.div>

            {/* Quick Listen CTA */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="relative rounded-[2rem] overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/20 border border-blue-500/20 rounded-[2rem]" />
                <div className="relative p-5 text-center">
                    <Music2 size={28} className="text-blue-400 mx-auto mb-3" />
                    <p className="text-white font-black text-sm uppercase tracking-tight mb-1">¿No sabes qué escuchar?</p>
                    <p className="text-white/40 text-[9px] mb-4">Deja que la música te encuentre</p>
                    <a
                        href="https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-black text-[8px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                    >
                        <SpotifyIcon className="w-3.5 h-3.5" />
                        Shuffle en Spotify
                    </a>
                </div>
            </motion.div>

        </div>
    );
};

export default SidebarExtras;
