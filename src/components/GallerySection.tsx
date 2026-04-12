import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Camera } from 'lucide-react';

const IMAGES = [
    { id: 1, url: '/gallery-1.png', span: 'col-span-2 row-span-2' },
    { id: 2, url: '/hero-bg.png', span: 'col-span-1 row-span-1' },
    { id: 3, url: '/logo.png', span: 'col-span-1 row-span-1' },
    { id: 4, url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 row-span-2' },
    { id: 5, url: 'https://images.unsplash.com/photo-1514525253344-f81bcd04595a?auto=format&fit=crop&q=80&w=800', span: 'col-span-1 row-span-1' },
];

const GallerySection: React.FC = () => {
    return (
        <section className="py-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Captures</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Momentos <span className="text-white/20">En Vivo</span></h2>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-purple-500/20">
                        <Instagram size={14} />
                        Seguir en Instagram
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                {IMAGES.map((img, idx) => (
                    <motion.div
                        key={img.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`${img.span} relative group overflow-hidden rounded-[2rem] glass border border-white/5`}
                    >
                        <img 
                            src={img.url} 
                            alt={`Gallery ${img.id}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                            <div className="flex items-center gap-2 text-white/60">
                                <Camera size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Backstage / 2024</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default GallerySection;
