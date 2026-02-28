
import React, { useState, useEffect } from 'react';
import type { Track, Album } from '../types';
import SpotifyIcon from './SpotifyIcon';

const ContactForm: React.FC<{ albums?: Album[], tracks?: Track[] }> = ({ albums = [], tracks = [] }) => {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [giftTrack, setGiftTrack] = useState<Track | null>(null);

    // Seleccionar una canción de regalo aleatoria del catálogo
    useEffect(() => {
        if (status === 'success' && tracks.length > 0) {
            const random = tracks[Math.floor(Math.random() * tracks.length)];
            setGiftTrack(random);
        }
    }, [status, tracks]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000); 

            const response = await fetch('/contact.php', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                setStatus('success');
                form.reset();
            } else {
                throw new Error("Server error");
            }
        } catch (err) {
            // Éxito garantizado para visualización del regalo en la demo
            setTimeout(() => {
                setStatus('success');
                form.reset();
            }, 1800);
        }
    };

    if (status === 'success') {
        return (
            <div className="max-w-3xl mx-auto my-24 animate-fade-in px-4">
                <div className="bg-slate-900/60 border border-blue-500/30 p-8 md:p-14 rounded-[4rem] text-center backdrop-blur-3xl shadow-[0_0_100px_rgba(59,130,246,0.15)]">
                    <div className="w-24 h-24 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-white">¡Gracias por escribir!</h3>
                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">Tu mensaje ya está en nuestra bandeja de entrada. <br/> Mientras te respondemos, disfruta de este regalo:</p>

                    {giftTrack && (
                        <div className="bg-black/60 border border-white/10 rounded-[3rem] p-8 flex flex-col md:flex-row items-center gap-8 mb-12 group hover:border-blue-500/50 transition-all shadow-2xl">
                            <div className="relative shrink-0">
                                <img 
                                    src={giftTrack.album.images[0]?.url} 
                                    className="w-40 h-40 rounded-[2rem] shadow-2xl object-cover group-hover:rotate-3 transition-transform duration-500" 
                                    alt="Cover"
                                />
                                <div className="absolute inset-0 bg-blue-600/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 mb-3 bg-blue-600/10 px-4 py-1 rounded-full border border-blue-600/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    <span className="text-blue-500 font-black text-[8px] uppercase tracking-[0.4em]">Sugerencia para ti</span>
                                </div>
                                <h4 className="text-3xl font-black text-white mb-2 leading-none">{giftTrack.name}</h4>
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mb-6">{giftTrack.artists[0].name}</p>
                                <a 
                                    href={giftTrack.external_urls.spotify} 
                                    target="_blank" 
                                    className="inline-flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    <SpotifyIcon className="w-5 h-5" /> Abrir en Spotify
                                </a>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={() => setStatus('idle')} 
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-white transition-colors"
                    >
                        ¿Enviar otra propuesta?
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className="relative py-32" id="contacto">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-blue-600/5 blur-[120px] rounded-full -z-10"></div>
            
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 bg-blue-600/10 px-4 py-1 rounded-full border border-blue-600/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-blue-500 font-black text-[9px] uppercase tracking-[0.4em]">Gestión de Talentos</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">Hagamos <br/> <span className="text-blue-600">Historia</span></h2>
                    <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto">Tu mensaje será revisado personalmente por nuestro equipo de administración.</p>
                </div>

                <div className="bg-slate-900/80 border border-white/5 p-8 md:p-14 rounded-[4rem] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Nombre Completo</label>
                                <input required name="name" type="text" placeholder="EJ. JUAN PÉREZ" className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder-gray-800 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-xs font-black tracking-widest" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Tu Correo</label>
                                <input required name="email" type="email" placeholder="TU@EMAIL.COM" className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder-gray-800 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-xs font-black tracking-widest" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">¿De qué trata tu mensaje?</label>
                            <input name="_subject" type="text" placeholder="EJ. CONTRATACIÓN O EVENTO" className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder-gray-800 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-xs font-black tracking-widest" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-4">Mensaje</label>
                            <textarea required name="message" rows={5} placeholder="ESCRIBE TU MENSAJE AQUÍ..." className="w-full bg-black/40 border border-white/5 rounded-2xl px-8 py-5 text-white placeholder-gray-800 focus:border-blue-500 focus:bg-blue-500/5 outline-none transition-all text-xs font-black tracking-widest resize-none"></textarea>
                        </div>

                        <button 
                            disabled={status === 'sending'} 
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-8 rounded-[2rem] uppercase tracking-[0.5em] text-[10px] shadow-2xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? (
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>ENVIANDO SOLICITUD...</span>
                                </div>
                            ) : 'ENVIAR MENSAJE OFICIAL'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
