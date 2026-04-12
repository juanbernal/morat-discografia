import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Globe, Music } from 'lucide-react';

const STATS = [
    { id: 1, label: 'Monthly Listeners', value: '1.2M', icon: <Users className="w-6 h-6" />, color: 'text-green-500' },
    { id: 2, label: 'Global Streams', value: '85M+', icon: <Globe className="w-6 h-6" />, color: 'text-blue-500' },
    { id: 3, label: 'Official Awards', value: '12', icon: <Award className="w-6 h-6" />, color: 'text-amber-500' },
    { id: 4, label: 'Catalog Tracks', value: '150+', icon: <Music className="w-6 h-6" />, color: 'text-purple-500' },
];

import { Users } from 'lucide-react';

const StatsSection: React.FC = () => {
    return (
        <section className="py-24">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((stat, idx) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative p-8 glass rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center text-center hover:bg-white/5 transition-all overflow-hidden"
                    >
                        {/* Background Glow */}
                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40 rounded-full ${stat.color === 'text-green-500' ? 'bg-green-500' : stat.color === 'text-blue-500' ? 'bg-blue-500' : stat.color === 'text-amber-500' ? 'bg-amber-500' : 'bg-purple-500' }`} />
                        
                        <div className={`p-4 rounded-2xl bg-white/5 mb-6 group-hover:scale-110 transition-transform ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
                        
                        <div className="mt-4 flex items-center gap-1.5 text-green-500/80">
                            <TrendingUp size={12} />
                            <span className="text-[10px] font-bold">+12% this month</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
