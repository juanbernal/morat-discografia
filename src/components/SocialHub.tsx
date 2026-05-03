import React from 'react';
import { motion } from 'framer-motion';
import { Music2, Share2, ArrowUpRight } from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import TiktokIcon from './TiktokIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import SpotifyIcon from './SpotifyIcon';

const SOCIAL_CARDS = [
    { id: 1, name: 'Instagram', icon: <InstagramIcon className="w-8 h-8" />, color: 'from-purple-600 to-pink-600', link: 'https://www.instagram.com/diosmasgym', handle: '@diosmasgym' },
    { id: 2, name: 'TikTok', icon: <TiktokIcon className="w-8 h-8" />, color: 'from-slate-800 to-black', link: 'https://tiktok.com/@diosmasgym', handle: '@diosmasgym' },
    { id: 3, name: 'YouTube', icon: <YoutubeMusicIcon className="w-8 h-8" />, color: 'from-red-600 to-red-800', link: 'https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow', handle: 'Diosmasgym Records' },
    { id: 4, name: 'Spotify', icon: <SpotifyIcon className="w-8 h-8" />, color: 'from-green-600 to-green-800', link: 'https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do', handle: 'Diosmasgym' },
];

const SocialHub: React.FC = () => {
    return (
        <section className="py-24" aria-label="Redes sociales">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Connect</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Social <span className="text-white/20">Hub</span></h2>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({ title: 'Diosmasgym Records', url: window.location.href });
                            } else {
                                navigator.clipboard.writeText(window.location.href);
                            }
                        }}
                        aria-label="Comprimir perfil del artista"
                        className="flex items-center gap-2 px-8 py-4 rounded-full glass border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-all"
                    >
                        <Share2 size={14} aria-hidden="true" />
                        Compartir Perfil
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] lg:h-[450px]">
                {/* Featured Social Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="lg:col-span-12 group relative rounded-[3rem] overflow-hidden glass border border-white/5"
                >
                    <img src="/social-1.png" alt="Social Media" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 hover:opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-transparent p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-white/5 rounded-[2rem] backdrop-blur-xl border border-white/10">
                                <InstagramIcon className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Únete a la<br/>comunidad</h3>
                                <p className="text-blue-500 font-black text-xs uppercase tracking-widest">@diosmasgym</p>
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm max-w-sm mb-8 leading-relaxed">
                            Sigue el día a día del sello, lanzamientos exclusivos y contenido detrás de cámaras en nuestras redes oficiales.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            {SOCIAL_CARDS.map(social => (
                                <motion.a
                                    key={social.id}
                                    href={social.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.05 }}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-br ${social.color} text-white shadow-xl`}
                                >
                                    {social.icon}
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{social.name}</p>
                                        <p className="text-[8px] font-bold opacity-60 leading-none">{social.handle}</p>
                                    </div>
                                    <ArrowUpRight size={14} className="opacity-40" />
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default SocialHub;
