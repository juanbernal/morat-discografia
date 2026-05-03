import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Play, ExternalLink } from 'lucide-react';
import type { Album, Track } from '../types';

interface LatestReleasesProps {
    albums: Album[];
    newestIds: Set<string>;
    onSelect: (album: Album) => void;
    onTrackSelect: (track: Track) => void;
}

const LatestReleases: React.FC<LatestReleasesProps> = ({ albums, newestIds, onSelect, onTrackSelect }) => {
    // Sort by release date descending, take top 6
    const sorted = [...albums]
        .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
        .slice(0, 6);

    if (sorted.length === 0) return null;

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
        } as Track);
    };

    const [hero, ...rest] = sorted;

    return (
        <section className="py-16">
            {/* Header */}
            <div className="flex items-center gap-4 mb-12">
                <div className="w-1.5 h-10 bg-purple-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
                <div>
                    <span className="text-purple-400 font-black uppercase tracking-[0.4em] text-[10px] mb-1 block">Recién llegado</span>
                    <h2 className="text-4xl font-black tracking-tighter uppercase text-white">
                        Lo Más <span className="text-white/20">Nuevo</span>
                    </h2>
                </div>
                <Sparkles className="ml-2 text-purple-400 w-6 h-6 opacity-60" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Hero card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative group cursor-pointer rounded-[2.5rem] overflow-hidden"
                    onClick={() => onSelect(hero)}
                >
                    <div className="aspect-square relative">
                        <img
                            src={hero.images[0]?.url}
                            alt={hero.name}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                        {/* "NEW" badge */}
                        <div className="absolute top-5 left-5 flex items-center gap-2 bg-purple-600/90 backdrop-blur-md px-3 py-1.5 rounded-full">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white">Nuevo</span>
                        </div>

                        {/* Play button on hover */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl"
                                onClick={(e) => { e.stopPropagation(); handlePlay(hero); }}
                            >
                                <Play size={30} className="text-black fill-current ml-1" />
                            </motion.button>
                        </div>

                        {/* Bottom info */}
                        <div className="absolute bottom-0 inset-x-0 p-8">
                            <p className="text-purple-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">
                                {hero.artists[0]?.name} · {hero.album_type === 'single' ? 'Sencillo' : 'Álbum'}
                            </p>
                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">{hero.name}</h3>
                            <p className="text-white/40 text-[9px] font-bold mt-1">
                                {new Date(hero.release_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Compact list */}
                <div className="flex flex-col gap-4">
                    {rest.map((album, i) => (
                        <motion.div
                            key={album.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="group flex items-center gap-5 glass rounded-[1.5rem] p-4 border border-white/5 hover:border-purple-500/20 transition-all cursor-pointer"
                            onClick={() => onSelect(album)}
                        >
                            {/* Thumb */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <img src={album.images[0]?.url} alt={album.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePlay(album); }}
                                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                                    >
                                        <Play size={12} className="text-black fill-current ml-0.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-grow min-w-0">
                                <p className="text-white font-black text-sm uppercase tracking-tight truncate group-hover:text-purple-400 transition-colors">
                                    {album.name}
                                </p>
                                <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-0.5">
                                    {album.artists[0]?.name}
                                </p>
                                <p className="text-white/20 text-[8px] mt-1">
                                    {new Date(album.release_date).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}
                                </p>
                            </div>

                            {/* Type Tag */}
                            <span className="flex-shrink-0 text-[8px] font-black px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                                {album.album_type === 'single' ? 'Single' : 'Album'}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestReleases;
