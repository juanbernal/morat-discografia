import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronRight, Bell, Music } from 'lucide-react';
import type { UpcomingRelease } from '../types';

interface CountdownValues {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function parseDate(dateStr: string): number {
    // Handle "DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"
    const parts = dateStr.split(/[-/]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            // YYYY-MM-DD
            return new Date(+parts[0], +parts[1] - 1, +parts[2]).getTime();
        } else if (parts[2].length === 4) {
            // DD/MM/YYYY or MM/DD/YYYY — assume DD/MM since that's more common in MX
            return new Date(+parts[2], +parts[1] - 1, +parts[0]).getTime();
        }
    }
    return new Date(dateStr).getTime();
}

function calcTimeLeft(targetMs: number): CountdownValues {
    const distance = targetMs - Date.now();
    if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
}

const CountdownCard: React.FC<{ release: UpcomingRelease; featured?: boolean }> = ({ release, featured }) => {
    const targetMs = parseDate(release.releaseDate);
    const [timeLeft, setTimeLeft] = useState<CountdownValues>(calcTimeLeft(targetMs));
    const isPast = targetMs < Date.now();

    useEffect(() => {
        if (isPast) return;
        const id = setInterval(() => setTimeLeft(calcTimeLeft(targetMs)), 1000);
        return () => clearInterval(id);
    }, [targetMs, isPast]);

    const formattedDate = (() => {
        const d = new Date(targetMs);
        return d.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    })();

    if (featured) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative glass rounded-[3rem] border border-white/10 overflow-hidden"
            >
                {/* Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
                    {/* Left: info + cover */}
                    <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
                        {/* Miniatura */}
                        <div className="relative flex-shrink-0 w-40 h-40 md:w-52 md:h-52 group">
                            <div className="absolute -inset-2 bg-blue-600/20 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                            <img
                                src={release.coverImageUrl || '/album-placeholder.png'}
                                alt={release.name}
                                className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10"
                            />
                        </div>
                        <div className="space-y-4 text-center sm:text-left">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[9px] font-black uppercase tracking-[0.2em]">
                                <Calendar size={11} /> Próximo Estreno
                            </span>
                            <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                                {release.name}
                            </h2>
                            <p className="text-blue-400/80 text-[10px] font-black uppercase tracking-widest">
                                {release.artistName}
                            </p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
                                <Calendar size={10} className="inline mr-1" />{formattedDate}
                            </p>
                            <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
                                {release.preSaveLink && (
                                    <a
                                        href={release.preSaveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[8px] hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                                    >
                                        Pre-Save <ChevronRight size={12} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: countdown */}
                    <div className="flex justify-center md:justify-end">
                        {isPast ? (
                            <div className="flex items-center gap-3 text-green-400">
                                <Music size={20} />
                                <span className="font-black uppercase tracking-widest text-sm">¡Ya disponible!</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Días', value: timeLeft.days },
                                    { label: 'Horas', value: timeLeft.hours },
                                    { label: 'Mins', value: timeLeft.minutes },
                                    { label: 'Segs', value: timeLeft.seconds },
                                ].map((unit) => (
                                    <div key={unit.label} className="flex flex-col items-center gap-2">
                                        <div className="w-16 h-20 md:w-20 md:h-24 glass rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                                            <span className="text-xl md:text-3xl font-black text-white tabular-nums">
                                                {String(unit.value).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    // Compact card for secondary releases
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-[2rem] border border-white/5 p-6 flex items-center gap-5 hover:border-white/10 transition-all"
        >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={release.coverImageUrl || '/album-placeholder.png'} alt={release.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow min-w-0">
                <p className="text-white font-black text-sm uppercase tracking-tight truncate">{release.name}</p>
                <p className="text-blue-400/70 text-[9px] font-black uppercase tracking-widest mt-0.5">{release.artistName}</p>
                <p className="text-white/30 text-[9px] mt-1">{formattedDate}</p>
            </div>
            {!isPast && (
                <div className="flex-shrink-0 text-right">
                    <p className="text-2xl font-black text-white tabular-nums">{String(timeLeft.days).padStart(2, '0')}</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest">días</p>
                </div>
            )}
            {isPast && <span className="flex-shrink-0 text-green-400 text-[9px] font-black uppercase tracking-widest">Disponible</span>}
        </motion.div>
    );
};

interface ReleaseCountdownProps {
    releases: UpcomingRelease[];
}

const ReleaseCountdown: React.FC<ReleaseCountdownProps> = ({ releases }) => {
    if (!releases || releases.length === 0) return null;

    const [featured, ...rest] = releases;

    return (
        <section className="py-16 space-y-6">
            <div className="mb-10">
                <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-3 block">Coming Soon</span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">
                    Próximos <span className="text-white/20">Estrenos</span>
                </h2>
            </div>

            <CountdownCard release={featured} featured />

            {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {rest.map((r) => (
                        <CountdownCard key={r.name + r.releaseDate} release={r} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ReleaseCountdown;
