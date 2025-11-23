
import React, { useEffect, useRef, useState } from 'react';
import type { UpcomingRelease } from '../types';
import CountdownTimer from './CountdownTimer';
import TiktokIcon from './TiktokIcon';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';

interface PresaveModalProps {
    release: UpcomingRelease;
    onClose: () => void;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12 text-white ml-1">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-12 md:h-12 text-white">
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const getYoutubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const calculateTimeLeft = (releaseDate: string) => {
    const parseDate = (dateStr: string) => {
         if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
         const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
         if (parts) {
             let year = parseInt(parts[3], 10);
             if (year < 100) year += 2000;
             return new Date(year, parseInt(parts[2], 10) - 1, parseInt(parts[1], 10));
         }
         return new Date(dateStr);
    };

    const difference = +parseDate(releaseDate) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, hasReleased: true };
    
    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        hasReleased: false
    };
};

const PresaveModal: React.FC<PresaveModalProps> = ({ release, onClose }) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(release.releaseDate));
    
    const youtubeId = release.audioPreviewUrl ? getYoutubeVideoId(release.audioPreviewUrl) : null;
    const isYoutubePreview = !!youtubeId;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(release.releaseDate));
        }, 1000);
        return () => {
            document.body.style.overflow = 'auto';
            clearInterval(timer);
        };
    }, [release.releaseDate]);

    // Handle HTML5 Audio Time Limit (60 seconds)
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            if (audioRef.current.currentTime >= 60) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                setIsPlaying(false);
            }
        }
    };

    const togglePlay = () => {
        if (isYoutubePreview) {
            // For YouTube, "playing" state effectively just reveals the iframe
            setIsPlaying(!isPlaying);
        } else {
            // For standard audio
            if (!audioRef.current) return;
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black font-sans">
            {/* Dynamic Background */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 blur-3xl scale-125 transform transition-transform duration-[20s] ease-in-out hover:scale-110"
                style={{ backgroundImage: `url(${release.coverImageUrl})` }}
            ></div>
            
            {/* Noise Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

            {/* Main Container: Mobile First (Full Screen) -> Desktop (Card) */}
            <div className="relative z-10 w-full h-full md:h-auto md:max-h-[90vh] md:max-w-md md:rounded-3xl bg-black/60 backdrop-blur-3xl border-0 md:border md:border-white/10 shadow-2xl flex flex-col overflow-y-auto overflow-x-hidden md:my-8 animate-fade-in">
                
                {/* Close Button Mobile/Desktop */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-black/40 rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-colors"
                >
                    <CloseIcon />
                </button>

                {/* Content Wrapper */}
                <div className="flex flex-col items-center p-6 md:p-8 space-y-6 pt-12 md:pt-8 w-full max-w-sm mx-auto">
                    
                    {/* Header: Artist Name */}
                    <div className="text-center">
                        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase font-bold mb-1">Nuevo Lanzamiento</p>
                        <h2 className="text-white font-bold text-lg tracking-wide drop-shadow-md">Diosmasgym</h2>
                    </div>

                    {/* Album Art / Player Container */}
                    <div className={`relative w-64 h-64 md:w-72 md:h-72 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden group mx-auto border border-white/10 ${isPlaying && !isYoutubePreview ? 'animate-pulse-bright' : ''}`}>
                        
                        {/* If playing YouTube, show Iframe, otherwise show Image */}
                        {isYoutubePreview && isPlaying ? (
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&modestbranding=1&rel=0&controls=0`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                className="absolute inset-0 w-full h-full object-cover"
                            ></iframe>
                        ) : (
                            <img 
                                src={release.coverImageUrl} 
                                alt={release.name} 
                                className="w-full h-full object-cover"
                            />
                        )}
                        
                        {/* Play Button Overlay (Visible if Audio exists and NOT playing YouTube) */}
                        {/* If YouTube is playing, we hide this overlay so user sees the video. To stop, they click the iframe pause or we could add a stop button elsewhere. For simplicity, we assume they watch a bit or close modal. But actually, let's keep a small toggle or close button for the video state if needed. Re-clicking the cover is hard if iframe eats clicks. Let's add a "Stop Preview" button below if playing. */}
                        {release.audioPreviewUrl && !isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer" onClick={togglePlay}>
                                <div 
                                    className="w-16 h-16 bg-white/20 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center transition-all transform hover:scale-110 hover:bg-white/30 shadow-lg"
                                >
                                    <PlayIcon />
                                </div>
                            </div>
                        )}
                        
                         {/* Stop Overlay for HTML5 Audio */}
                        {!isYoutubePreview && isPlaying && (
                             <div className="absolute inset-0 flex items-center justify-center bg-transparent cursor-pointer" onClick={togglePlay}>
                                <div className="w-16 h-16 bg-black/40 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center transition-all transform hover:scale-110 hover:bg-black/60 shadow-lg opacity-0 group-hover:opacity-100">
                                    <PauseIcon />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Track Info */}
                    <div className="text-center w-full">
                         <h1 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-xl tracking-tight mb-2 truncate px-2">
                            {release.name}
                        </h1>
                        
                        {/* Preview Indicator */}
                         {release.audioPreviewUrl && (
                            <div className="flex flex-col items-center justify-center gap-2 mb-4">
                                <div className="flex items-center gap-2 cursor-pointer" onClick={togglePlay}>
                                    <span className="flex h-2 w-2 relative">
                                        {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
                                    </span>
                                    <p className="text-gray-300 text-xs font-bold tracking-wide uppercase hover:text-white transition-colors">
                                        {isPlaying ? (isYoutubePreview ? 'Viendo Video' : 'Escuchando Preview') : 'Escucha un adelanto'}
                                    </p>
                                </div>
                                {isPlaying && (
                                     <button onClick={togglePlay} className="text-[10px] text-red-400 border border-red-400/50 px-2 py-0.5 rounded-full hover:bg-red-400/10">
                                        Detener
                                     </button>
                                )}
                            </div>
                        )}

                        <div className="my-4">
                             {timeLeft.hasReleased ? (
                                <span className="text-xl font-bold text-green-400 animate-pulse">¡Ya Disponible!</span>
                            ) : (
                                <CountdownTimer {...timeLeft} />
                            )}
                        </div>
                    </div>

                    {/* Action Buttons (Hyperfollow Style) */}
                    <div className="w-full flex flex-col gap-3">
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full overflow-hidden bg-white text-black font-bold text-base py-4 px-6 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white p-0.5"><SpotifyIcon className="w-full h-full" /></span>
                            <span>Pre-Save en Spotify</span>
                            <span className="absolute right-4 hidden sm:block text-xs font-normal text-gray-500 uppercase tracking-wider group-hover:text-black">Guardar</span>
                        </a>
                        
                         <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full overflow-hidden bg-[#FA243C] text-white font-bold text-base py-4 px-6 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 group"
                        >
                           <AppleMusicIcon className="w-5 h-5" />
                           <span>Pre-Add en Apple Music</span>
                           <span className="absolute right-4 hidden sm:block text-xs font-normal text-white/70 uppercase tracking-wider group-hover:text-white">Agregar</span>
                        </a>
                        
                        <a 
                            href={release.preSaveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-full overflow-hidden bg-white/5 border border-white/20 hover:bg-white/10 text-white font-medium text-base py-3 px-6 rounded-full transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                           <span>Más Plataformas</span>
                        </a>
                    </div>
                    
                    {/* Social Footer */}
                    <div className="pt-6 mt-2 border-t border-white/10 w-full flex flex-col items-center gap-4">
                         <div className="flex gap-6">
                            <a href="https://www.instagram.com/diosmasgym" target="_blank" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"><span className="sr-only">Instagram</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                            <a href="https://www.tiktok.com/@diosmasgym" target="_blank" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"><TiktokIcon className="w-5 h-5" /></a>
                            <a href="https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow" target="_blank" className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"><YoutubeMusicIcon className="w-5 h-5" /></a>
                        </div>
                        
                        <button 
                            onClick={onClose}
                            className="text-xs text-white/40 hover:text-white transition-colors pb-4"
                        >
                            Continuar al sitio web &rarr;
                        </button>
                    </div>
                </div>
            </div>
            
             {/* Only render audio tag if it's NOT a YouTube video */}
             {!isYoutubePreview && (
                <audio 
                    ref={audioRef} 
                    src={release.audioPreviewUrl} 
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)} 
                />
             )}
        </div>
    );
};

export default PresaveModal;
