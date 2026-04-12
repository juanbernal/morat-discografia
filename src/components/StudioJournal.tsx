import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Music4, Headphones, Zap } from 'lucide-react';

const JOURNAL_POSTS = [
    { 
        id: 1, 
        title: 'Capturando la Esencia', 
        category: 'Studio Sessions',
        image: '/studio-1.png',
        desc: 'Explorando nuevas texturas vocales con el Neumann U87 para el próximo lanzamiento.'
    },
    { 
        id: 2, 
        title: 'The Blueprint', 
        category: 'Production',
        image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800',
        desc: 'Diseñando los ritmos que definirán el sonido de Diosmasgym Records este año.'
    }
];

const StudioJournal: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 relative z-10">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Inside the Lab</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Studio <span className="text-white/20">Journal</span></h2>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all text-white/60">Explorar Proceso</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {JOURNAL_POSTS.map((post, idx) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative h-[500px] rounded-[3rem] overflow-hidden glass border border-white/5"
                    >
                        <img 
                            src={post.image} 
                            alt={post.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent p-10 flex flex-col justify-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4">{post.category}</span>
                            <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">{post.title}</h3>
                            <p className="text-slate-300 text-sm leading-relaxed max-w-sm mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                {post.desc}
                            </p>
                            <div className="flex gap-4">
                                <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md"><Mic2 size={18} className="text-white" /></div>
                                <div className="p-3 bg-white/5 rounded-2xl backdrop-blur-md"><Zap size={18} className="text-white" /></div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Micro Stats Row */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center opacity-40">
                <div className="flex items-center gap-3">
                    <Headphones size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">High Fidelity<br/>Recording</span>
                </div>
                <div className="flex items-center gap-3">
                    <Zap size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Analog<br/>Workflow</span>
                </div>
                <div className="flex items-center gap-3">
                    <Music4 size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Artist<br/>Development</span>
                </div>
                <div className="flex items-center gap-3">
                    <Mic2 size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest leading-none">Production<br/>House</span>
                </div>
            </div>
        </section>
    );
};

export default StudioJournal;
