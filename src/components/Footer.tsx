import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Disc3, Heart, Mail, Shield, FileText } from 'lucide-react';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import InstagramIcon from './InstagramIcon';
import TiktokIcon from './TiktokIcon';

const SOCIAL = [
    { icon: <InstagramIcon className="w-5 h-5" />, url: 'https://www.instagram.com/diosmasgym', name: 'Instagram' },
    { icon: <TiktokIcon className="w-5 h-5" />, url: 'https://tiktok.com/@diosmasgym', name: 'TikTok' },
    { icon: <YoutubeMusicIcon className="w-5 h-5" />, url: 'https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow', name: 'YouTube' },
    { icon: <SpotifyIcon className="w-5 h-5" />, url: 'https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do', name: 'Spotify' },
];

const NAV_LINKS = [
    { label: 'Próximos Estrenos', anchor: '#' },
    { label: 'Catálogo', anchor: '#catalog-section' },
    { label: 'Lo Más Nuevo', anchor: '#' },
    { label: 'Top Hits', anchor: '#' },
    { label: 'Social Hub', anchor: '#' },
];

const LEGAL_LINKS = [
    { icon: <Shield size={12} />, label: 'Política de Privacidad', url: '#' },
    { icon: <FileText size={12} />, label: 'Términos de Uso', url: '#' },
    { icon: <Mail size={12} />, label: 'Contacto', url: 'mailto:contacto@diosmasgym.com' },
];

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-20 border-t border-white/5" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-8">

                {/* Top row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* Brand */}
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/20 flex items-center justify-center">
                                <Disc3 size={20} className="text-blue-400" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-white font-black text-sm uppercase tracking-wider">Diosmasgym</p>
                                <p className="text-white/30 text-[8px] uppercase tracking-[0.3em]">Records</p>
                            </div>
                        </div>
                        <p className="text-white/30 text-xs leading-relaxed max-w-xs">
                            Sello independiente de música cristiana urbana, regional y rap desde el norte de México. Fe, arte y producción de vanguardia.
                        </p>
                        {/* Social row */}
                        <div className="flex gap-3" role="list" aria-label="Redes sociales">
                            {SOCIAL.map(s => (
                                <motion.a
                                    key={s.name}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, scale: 1.1 }}
                                    title={s.name}
                                    role="listitem"
                                    aria-label={`Seguir en ${s.name}`}
                                    className="w-9 h-9 rounded-xl glass border border-white/8 flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all"
                                >
                                    {s.icon}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em] mb-6">Navegar</p>
                        <ul className="space-y-3">
                            {NAV_LINKS.map(l => (
                                <li key={l.label}>
                                    <a
                                        href={l.anchor}
                                        onClick={e => {
                                            if (l.anchor.startsWith('#') && l.anchor.length > 1) {
                                                e.preventDefault();
                                                document.querySelector(l.anchor)?.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }}
                                        className="flex items-center gap-2 text-white/40 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors group"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-blue-500 transition-all duration-300" />
                                        {l.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Listen now */}
                    <div>
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.4em] mb-6">Escuchar en</p>
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Escuchar en Spotify"
                                className="flex items-center justify-between px-4 py-3 rounded-xl glass border border-white/8 hover:border-green-500/30 hover:bg-green-500/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <SpotifyIcon className="w-4 h-4 text-green-400" aria-hidden="true" />
                                    <span className="text-white/60 group-hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors">Spotify</span>
                                </div>
                                <ArrowUpRight size={12} className="text-white/20 group-hover:text-white/60 transition-colors" aria-hidden="true" />
                            </a>
                            <a
                                href="https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Escuchar en YouTube Music"
                                className="flex items-center justify-between px-4 py-3 rounded-xl glass border border-white/8 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <YoutubeMusicIcon className="w-4 h-4 text-red-400" aria-hidden="true" />
                                    <span className="text-white/60 group-hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors">YouTube Music</span>
                                </div>
                                <ArrowUpRight size={12} className="text-white/20 group-hover:text-white/60 transition-colors" aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.instagram.com/diosmasgym"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Seguir en Instagram"
                                className="flex items-center justify-between px-4 py-3 rounded-xl glass border border-white/8 hover:border-pink-500/30 hover:bg-pink-500/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <InstagramIcon className="w-4 h-4 text-pink-400" aria-hidden="true" />
                                    <span className="text-white/60 group-hover:text-white text-[10px] font-black uppercase tracking-wider transition-colors">Instagram</span>
                                </div>
                                <ArrowUpRight size={12} className="text-white/20 group-hover:text-white/60 transition-colors" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Legal Links */}
                <div className="border-t border-white/5 pt-8 mb-8">
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        {LEGAL_LINKS.map(link => (
                            <a
                                key={link.label}
                                href={link.url}
                                className="flex items-center gap-2 text-white/30 hover:text-white/60 text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                                {link.icon}
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest">
                        © {year} Diosmasgym Records · Todos los derechos reservados
                    </p>
                    <p className="flex items-center gap-1.5 text-white/20 text-[9px]">
                        Hecho con <Heart size={10} className="text-red-500/60 fill-current" aria-hidden="true" /> en México · Música Independiente
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
