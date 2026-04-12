import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Calendar, ChevronRight } from 'lucide-react';
import type { UpcomingRelease } from '../types';

interface ReleaseCountdownProps {
    release: UpcomingRelease | null;
}

const ReleaseCountdown: React.FC<ReleaseCountdownProps> = ({ release }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!release) return;
        
        const target = new Date(release.releaseDate).getTime();
        
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;
            
            if (distance < 0) {
                clearInterval(interval);
                return;
            }
            
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [release]);

    if (!release) return null;

    return (
        <section className="py-24 relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="relative glass rounded-[4rem] p-12 md:p-20 border border-white/10 shadow-3xl overflow-hidden">
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div>
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Calendar size={12} /> Próximo Gran Estreno
                            </span>
                            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                                {release.name}
                            </h2>
                            <p className="text-slate-400 text-lg font-medium opacity-80">
                                Pre-guarda ahora para ser el primero en escucharlo en todas las plataformas. El sello Diosmasgym Records sigue marcando la pauta.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button className="flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                                Pre-Save Now
                                <ChevronRight size={14} />
                            </button>
                            <button className="flex items-center gap-3 glass border border-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">
                                <Bell size={14} /> Notify Me
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end">
                        <div className="grid grid-cols-4 gap-4 md:gap-8">
                            {[
                                { label: 'Días', value: timeLeft.days },
                                { label: 'Horas', value: timeLeft.hours },
                                { label: 'Mins', value: timeLeft.minutes },
                                { label: 'Segs', value: timeLeft.seconds },
                            ].map((unit, i) => (
                                <motion.div 
                                    key={unit.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-20 h-24 md:w-28 md:h-32 glass rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl mb-3">
                                        <span className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                                            {String(unit.value).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">
                                        {unit.label}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReleaseCountdown;
