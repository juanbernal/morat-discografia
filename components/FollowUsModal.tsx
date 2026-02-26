
import React, { useEffect, useState } from 'react';
import FacebookIcon from './FacebookIcon';
import TiktokIcon from './TiktokIcon';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.17.91-.494 1.202-.82 1.23-.696.06-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.04-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.24-1.86-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.662 3.488-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
);

const FollowUsModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const lastShown = localStorage.getItem('dmg_social_popup_v1');
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // Una semana en milisegundos

        if (!lastShown || (now - parseInt(lastShown) > oneWeek)) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const closePopup = () => {
        setIsOpen(false);
        localStorage.setItem('dmg_social_popup_v1', Date.now().toString());
    };

    if (!isOpen) return null;

    const socialLinks = [
        { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/diosmasgymcom/', color: 'from-[#f09433] via-[#e6683c] to-[#bc1888]' },
        { name: 'Facebook', icon: FacebookIcon, url: 'https://www.facebook.com/people/Diosmasgym/61550221636271/#', color: 'bg-[#1877F2]' },
        { name: 'TikTok DMG', icon: TiktokIcon, url: 'https://tiktok.com/@diosmasgym', color: 'bg-black' },
        { name: 'TikTok Juan 614', icon: TiktokIcon, url: 'https://www.tiktok.com/@juan614oficial', color: 'bg-zinc-900' },
        { name: 'X / Twitter', icon: TwitterIcon, url: 'https://x.com/diosmasgym', color: 'bg-black' },
        { name: 'Telegram', icon: TelegramIcon, url: 'https://www.t.me/Diosmasgymbot', color: 'bg-[#0088cc]' }
    ];

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closePopup}></div>
            
            <div className="relative w-full max-w-xl bg-slate-950 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-pop-in">
                <div className="absolute top-0 right-0 p-6 z-10">
                    <button onClick={closePopup} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-8 pt-12 md:p-12 md:pt-16 flex flex-col items-center text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mb-6 md:mb-8 shadow-2xl shadow-blue-600/20">
                        <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-3">¡Únete a la <span className="text-blue-500">Familia</span>!</h2>
                    <p className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed max-w-md">Síguenos en nuestras redes oficiales para no perderte ningún estreno y contenido exclusivo de <span className="text-white font-bold">Diosmasgym Records</span>.</p>

                    <div className="grid grid-cols-2 gap-3 w-full overflow-y-auto max-h-[40vh] no-scrollbar py-1 mb-10">
                        {socialLinks.map((link) => (
                            <a 
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 transition-all hover:scale-105 active:scale-95 group ${link.name === 'Instagram' ? 'bg-gradient-to-tr ' + link.color : link.color}`}
                            >
                                <link.icon className="w-5 h-5 md:w-6 md:h-6 text-white mb-1.5 drop-shadow-lg" />
                                <span className="text-[7px] md:text-[8px] font-black text-white/90 uppercase tracking-widest text-center">{link.name}</span>
                            </a>
                        ))}
                    </div>

                    <button 
                        onClick={closePopup}
                        className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] hover:text-white transition-colors"
                    >
                        Ya te sigo, entrar ahora
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-pop-in {
                    animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default FollowUsModal;
