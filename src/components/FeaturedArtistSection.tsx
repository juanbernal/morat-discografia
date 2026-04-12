import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, ArrowRight } from 'lucide-react';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';

const FeaturedArtistSection: React.FC = () => {
    return (
        <section className="py-24 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="absolute -inset-4 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none" />
                    <div className="relative rounded-[3rem] overflow-hidden aspect-square glass border border-white/10 shadow-2xl">
                        <img 
                            src="/diosmasgym_profile.jpg" 
                            alt="Featured Artist" 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 hover:scale-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent flex items-end p-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-2 block">Featured Talent</span>
                                <h3 className="text-5xl font-black text-white uppercase tracking-tighter">Diosmasgym</h3>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="space-y-4">
                        <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px]">The Visionary</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none">Redefiniendo el <span className="text-white/20">Género</span></h2>
                        <p className="text-slate-300 text-lg leading-relaxed opacity-80 font-medium">
                            Con una propuesta única que fusiona líricas con propósito y una producción de vanguardia, Diosmasgym se posiciona como el artista insignia de nuestro sello. Cada canción es un testimonio de excelencia y fe.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass p-6 rounded-3xl border border-white/5">
                            <p className="text-3xl font-black text-white mb-1">1.2M</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Oyentes Mensuales</p>
                        </div>
                        <div className="glass p-6 rounded-3xl border border-white/5">
                            <p className="text-3xl font-black text-white mb-1">150+</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Obras Publicadas</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all">
                            <SpotifyIcon className="w-5 h-5" />
                            Spotify Artist
                        </button>
                        <button className="flex items-center gap-2 glass border border-white/10 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                            <ArrowRight size={16} />
                            Ver Historial
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedArtistSection;
