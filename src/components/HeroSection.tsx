import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Users, ChevronDown } from 'lucide-react';

interface HeroSectionProps {
    onActionClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onActionClick }) => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
                style={{ backgroundImage: 'url("/hero-bg.png")' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/60 to-[#020617]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="inline-block px-4 py-1.5 mb-6 glass-pill rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                        Official Artist Portal
                    </span>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-[0.9] mb-8 text-white drop-shadow-2xl">
                        Diosmasgym <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Records</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                        Definiendo el sonido del mañana con fe y ritmo. Explora la discografía oficial y los últimos lanzamientos de la casa.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onActionClick}
                            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                        >
                            <Play className="fill-current w-4 h-4" />
                            Escuchar Ahora
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 glass border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all"
                        >
                            <Calendar className="w-4 h-4" />
                            Ver Gira
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown className="w-4 h-4" />
            </motion.div>

            {/* Side Stats */}
            <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col gap-12 text-right">
                <div className="space-y-1">
                    <p className="text-3xl font-black text-white">1.2M+</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Oyentes</p>
                </div>
                <div className="space-y-1">
                    <p className="text-3xl font-black text-white">450K</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Suscriptores</p>
                </div>
                <div className="space-y-1">
                    <p className="text-3xl font-black text-white">24</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-blue-500">Álbumes</p>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
