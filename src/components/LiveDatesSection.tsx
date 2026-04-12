import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Ticket, Calendar } from 'lucide-react';

const EVENTS = [
    { id: 1, date: 'MAY 15', city: 'Ciudad de México, MX', venue: 'Palacio de los Deportes', status: 'Tickets' },
    { id: 2, date: 'MAY 22', city: 'Monterrey, MX', venue: 'Auditorio CitiBanamex', status: 'Sold Out' },
    { id: 3, date: 'JUN 05', city: 'Bogotá, CO', venue: 'Movistar Arena', status: 'Tickets' },
    { id: 4, date: 'JUN 12', city: 'San Juan, PR', venue: 'Coliseo de Puerto Rico', status: 'Coming Soon' },
    { id: 5, date: 'JUN 28', city: 'Miami, FL', venue: 'Kaseya Center', status: 'Tickets' },
];

const LiveDatesSection: React.FC = () => {
    return (
        <section className="py-24">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">On the road</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">Próximos <span className="text-white/20">Eventos</span></h2>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-all">Ver Gira Completa</button>
                </div>
            </div>

            <div className="space-y-4">
                {EVENTS.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex flex-col md:flex-row items-center justify-between p-8 glass rounded-[2rem] hover:bg-white/5 transition-all border border-white/5"
                    >
                        <div className="flex items-center gap-12 w-full md:w-auto mb-6 md:mb-0">
                            <div className="flex flex-col items-center">
                                <span className="text-blue-500 font-black text-2xl leading-none">{event.date.split(' ')[1]}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{event.date.split(' ')[0]}</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{event.city}</h3>
                                <div className="flex items-center gap-2 text-white/40 text-sm">
                                    <MapPin size={14} />
                                    <span>{event.venue}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex items-center gap-2 text-white/40">
                                <Calendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">8:00 PM</span>
                            </div>
                            <button 
                                className={`px-8 py-4 rounded-full font-black uppercase tracking-widest text-[9px] transition-all
                                    ${event.status === 'Tickets' ? 'bg-white text-black hover:bg-blue-600 hover:text-white' : 
                                      event.status === 'Sold Out' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                                      'bg-white/5 text-white/40 pointer-events-none border border-white/10'}`}
                            >
                                {event.status}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default LiveDatesSection;
