
import React, { useState } from 'react';

const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        // Simulación de envío
        setTimeout(() => setStatus('success'), 2000);
    };

    if (status === 'success') {
        return (
            <div className="bg-slate-900/40 border border-emerald-500/30 p-12 rounded-[3rem] text-center animate-fade-in backdrop-blur-3xl">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">¡Mensaje Enviado!</h3>
                <p className="text-gray-400">Nos pondremos en contacto contigo pronto. Bendiciones.</p>
                <button onClick={() => setStatus('idle')} className="mt-8 text-blue-500 font-black uppercase tracking-widest text-[10px]">Enviar otro mensaje</button>
            </div>
        );
    }

    return (
        <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-900 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-slate-900/80 border border-white/5 p-8 md:p-16 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Booking & Contacto</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Ponte en <span className="text-blue-600">Contacto</span></h2>
                        <p className="text-gray-500 text-sm md:text-lg">¿Quieres trabajar con nosotros o tienes alguna duda? Escríbenos.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Nombre Completo</label>
                                <input required type="text" placeholder="Tu nombre..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Email</label>
                                <input required type="email" placeholder="tu@email.com" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Asunto</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all appearance-none">
                                <option>Booking / Eventos</option>
                                <option>Colaboraciones</option>
                                <option>Dudas / Soporte</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4">Mensaje</label>
                            <textarea required rows={4} placeholder="Escribe tu mensaje aquí..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                        </div>
                        <button disabled={status === 'sending'} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                            {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje Ahora'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
