import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

import YoutubeMusicIcon from './YoutubeMusicIcon';

const VIDEOS = [
    { 
        id: '1', 
        title: 'Pronto Volvemos', 
        artist: 'Diosmasgym', 
        videoId: 'dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1200'
    },
    { 
        id: '2', 
        title: 'Desde el Cielo', 
        artist: 'Juan 614', 
        videoId: 'dQw4w9WgXcQ', // Placeholder 
        thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200'
    },
    { 
        id: '3', 
        title: 'Fe Infinita', 
        artist: 'Diosmasgym', 
        videoId: 'dQw4w9WgXcQ', // Placeholder
        thumbnail: 'https://images.unsplash.com/photo-1514525253361-bee8a187499b?auto=format&fit=crop&q=80&w=1200'
    }
];

const VideoShowcase: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const next = () => setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + VIDEOS.length) % VIDEOS.length);

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Visual Experience</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Video <span className="text-white/20">Showcase</span></h2>
                </div>
                <div className="flex gap-4">
                    <button onClick={prev} className="p-4 rounded-full glass border border-white/10 text-white hover:bg-white/10 transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={next} className="p-4 rounded-full glass border border-white/10 text-white hover:bg-white/10 transition-all">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="relative aspect-video max-w-6xl mx-auto rounded-[3rem] overflow-hidden glass border border-white/10 shadow-3xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src={VIDEOS[currentIndex].thumbnail} 
                            alt={VIDEOS[currentIndex].title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
                        
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.5)] mb-8"
                            >
                                <Play size={40} className="text-white fill-current ml-2" />
                            </motion.button>
                            
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-2 block">
                                    {VIDEOS[currentIndex].artist}
                                </span>
                                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                                    {VIDEOS[currentIndex].title}
                                </h3>
                                <button className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                                    <YoutubeMusicIcon className="w-4 h-4" />
                                    Watch on YouTube <ExternalLink size={12} />
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default VideoShowcase;
