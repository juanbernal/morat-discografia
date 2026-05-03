import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shuffle, Play, Music2, Headphones } from 'lucide-react';
import type { Album, Track } from '../types';

interface ShuffleDiscoveryProps {
    albums: Album[];
    onTrackSelect: (track: Track) => void;
}

function getRandomItems<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

const ShuffleDiscovery: React.FC<ShuffleDiscoveryProps> = ({ albums, onTrackSelect }) => {
    const [seed, setSeed] = useState(0);

    const featured = useMemo(() => {
        return getRandomItems(albums, 5);
    }, [albums, seed]);

    const handlePlay = (album: Album) => {
        const youtubeUrl = album.external_urls.youtube ||
            `https://music.youtube.com/search?q=${encodeURIComponent(album.name + ' ' + album.artists.map(a => a.name).join(' '))}`;
        onTrackSelect({
            id: album.id,
            name: album.name,
            album,
            artists: album.artists,
            duration_ms: 0,
            explicit: false,
            external_urls: { youtube: youtubeUrl },
            preview_url: '',
            source: 'youtube',
        });
    };

    if (albums.length === 0) return null;

    return (
        <section className="py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-6">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">
                        Escucha Ahora
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">
                        Descubre <span className="text-white/20">Mi Música</span>
                    </h2>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSeed(s => s + 1)}
                    className="flex items-center gap-3 glass border border-white/10 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-white/5 transition-all"
                >
                    <Shuffle size={16} className="text-blue-400" />
                    Refrescar Mix
                </motion.button>
            </div>

            {/* Big Feature Card */}
            {featured[0] && (
                <motion.div
                    key={seed + '-main'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[3rem] overflow-hidden mb-8 cursor-pointer group"
                    onClick={() => handlePlay(featured[0])}
                >
                    <div className="aspect-[21/9] relative">
                        <img
                            src={featured[0].images[0]?.url}
                            alt={featured[0].name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-black/40 to-transparent" />
                        <div className="absolute inset-0 flex items-end p-10 md:p-16">
                            <div className="flex items-end gap-8 w-full">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl flex-shrink-0"
                                >
                                    <Play size={32} className="text-black ml-1 fill-current" />
                                </motion.div>
                                <div>
                                    <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
                                        {featured[0].artists[0]?.name} · {featured[0].album_type === 'single' ? 'Sencillo' : 'Álbum'}
                                    </p>
                                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                                        {featured[0].name}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Small Cards Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featured.slice(1, 5).map((album, i) => (
                    <motion.div
                        key={seed + '-' + album.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => handlePlay(album)}
                        className="group relative rounded-[2rem] overflow-hidden cursor-pointer"
                    >
                        <div className="aspect-square relative">
                            <img
                                src={album.images[0]?.url}
                                alt={album.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl">
                                    <Play size={22} className="text-black ml-1 fill-current" />
                                </div>
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                <p className="text-white font-black text-xs uppercase tracking-tight truncate">{album.name}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Play All Button */}
            <div className="mt-10 flex justify-center">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => featured[0] && handlePlay(featured[0])}
                    className="flex items-center gap-3 bg-blue-600 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-[9px] hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]"
                >
                    <Headphones size={18} />
                    Escuchar Selección Aleatoria
                </motion.button>
            </div>
        </section>
    );
};

export default ShuffleDiscovery;
