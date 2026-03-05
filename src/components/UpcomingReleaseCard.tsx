
import React, { useState, useEffect } from 'react';
import type { UpcomingRelease } from '../types';
import SpotifyIcon from './SpotifyIcon';
import AppleMusicIcon from './AppleMusicIcon';
import CountdownTimer from './CountdownTimer';
import ReleaseSchedule from './ReleaseSchedule';
import html2canvas from 'html2canvas';

interface UpcomingReleaseCardProps {
    release: UpcomingRelease;
}

const parseCustomDateString = (dateStr: string): Date => {
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return new Date(dateStr);
    const parts = dateStr.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const month = parseInt(parts[2], 10) - 1;
        let year = parseInt(parts[3], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day);
    }
    return new Date(dateStr);
};

const calculateTimeLeft = (releaseDate: string) => {
    const target = parseCustomDateString(releaseDate);
    const difference = +target - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, hasReleased: true };

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        hasReleased: false
    };
};

const UpcomingReleaseCard: React.FC<UpcomingReleaseCardProps> = ({ release }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(release.releaseDate));
    const cardId = `upcoming-card-${release.name.replace(/\s+/g, '-').toLowerCase()}`;

    const downloadCard = async () => {
        const element = document.getElementById(cardId);
        if (!element) return;

        const btn = document.getElementById(`download-btn-${cardId}`);
        const watermark = document.getElementById(`watermark-${cardId}`);
        const imgElement = document.getElementById(`img-${cardId}`) as HTMLImageElement;

        let originalSrc = '';
        let objectUrl = '';

        try {
            if (btn) btn.style.display = 'none'; // ocultar botón en la foto
            if (watermark) watermark.style.display = 'block'; // mostrar marca de agua en la foto

            // Hack para bypass CORS radical: Blob Fetch via AllOrigins
            if (imgElement && imgElement.src) {
                originalSrc = imgElement.src;

                try {
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(originalSrc)}`;
                    const res = await fetch(proxyUrl);
                    if (!res.ok) throw new Error('Proxy falló');

                    const blob = await res.blob();
                    objectUrl = URL.createObjectURL(blob);

                    const imageLoadPromise = new Promise((resolve, reject) => {
                        imgElement.onload = resolve;
                        imgElement.onerror = reject;
                    });

                    imgElement.crossOrigin = "anonymous";
                    imgElement.src = objectUrl;
                    await imageLoadPromise;
                } catch (imgError) {
                    console.error("Error cargando imagen puente:", imgError);
                    // Retiramos crossOrigin si el proxy falla para que html2canvas intente ignorarlo o taintarlo
                    imgElement.crossOrigin = null;
                    imgElement.src = originalSrc;
                }
            }

            const canvas = await html2canvas(element, {
                backgroundColor: '#050b18',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false
            });
            const link = document.createElement('a');
            link.download = `Estreno_${release.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading image', error);
            alert("Hubo un problema de seguridad de red al generar la imagen. Por favor, toma una captura de pantalla normal manualmente.");
        } finally {
            if (btn) btn.style.display = 'flex';
            if (watermark) watermark.style.display = 'none'; // ocultar marca de agua

            // Restaurar imagen original sin crossOrigin para no romper caché
            if (imgElement && originalSrc) {
                imgElement.crossOrigin = null;
                imgElement.src = originalSrc;
            }
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(release.releaseDate));
        }, 1000);
        return () => clearInterval(timer);
    }, [release.releaseDate]);

    const isJuan614 = release.artistName.toLowerCase().includes('614');

    const releaseDateObj = parseCustomDateString(release.releaseDate);
    const formattedDate = releaseDateObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long'
    }).toUpperCase();

    return (
        <div id={cardId} className="relative flex flex-col w-full bg-[#050b18] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 hover:shadow-[0_20px_60px_rgba(59,130,246,0.15)] group/card">
            {/* Botón de descarga oculto por defecto, visible al hacer hover en desktop, siempre visible en móvil */}
            <button
                id={`download-btn-${cardId}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); downloadCard(); }}
                className="absolute top-6 right-6 z-[100] w-12 h-12 bg-white/10 hover:bg-blue-600 backdrop-blur-md rounded-full items-center justify-center transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 hover:scale-110 flex opacity-100 md:opacity-0 md:group-hover/card:opacity-100"
                title="Descargar imagen completa"
            >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </button>
            <div className="relative z-10 p-8 md:p-10 flex flex-col h-full border border-white/5 rounded-[2.5rem]">

                {/* Header Badge */}
                <div className="flex justify-between items-center mb-10">
                    <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${isJuan614 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {release.artistName.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">PRÓXIMO ESTRENO</span>
                    </div>
                </div>

                {/* Art & Title Area */}
                <div className="flex flex-col items-center text-center flex-1">
                    <div className="relative w-full aspect-square max-w-[280px] mb-10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 group">
                        <img id={`img-${cardId}`} src={release.coverImageUrl} alt={release.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tighter mb-4 max-w-xs mx-auto">
                        {release.name}
                    </h3>

                    <p className={`text-[11px] font-black mb-8 tracking-[0.4em] uppercase ${isJuan614 ? 'text-amber-500' : 'text-blue-500'}`}>
                        DISPONIBLE EL {formattedDate}
                    </p>

                    {/* Countdown Exacto */}
                    <div className="w-full mb-8 bg-white/5 rounded-[2rem] p-6 border border-white/5 shadow-inner">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">TIEMPO RESTANTE</p>
                        {timeLeft.hasReleased ? (
                            <span className="text-2xl font-black text-emerald-400 animate-bounce block uppercase">¡YA DISPONIBLE!</span>
                        ) : (
                            <CountdownTimer {...timeLeft} />
                        )}
                    </div>

                    {/* Bandera de Estrenos (Horarios) */}
                    <div className="w-full mb-10">
                        <ReleaseSchedule variant={isJuan614 ? 'amber' : 'blue'} />
                    </div>
                </div>

                {/* Enlaces de Acción */}
                <div className="grid grid-cols-1 gap-4 mt-auto">
                    <a
                        href={release.preSaveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-[#1DB954] hover:bg-[#1ed760] p-6 rounded-[1.8rem] transition-all group shadow-xl active:scale-[0.97]"
                    >
                        <div className="flex items-center gap-4 text-white">
                            <SpotifyIcon className="w-8 h-8" />
                            <span className="font-black text-xl tracking-tight">Pre-Save</span>
                        </div>
                        <span className="text-[10px] font-black text-white bg-black/20 px-6 py-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-[#1DB954]">GUARDAR</span>
                    </a>
                </div>

                {/* Footer del card para captura de pantalla (oculto por defecto) */}
                <div id={`watermark-${cardId}`} className="mt-8 text-center opacity-80" style={{ display: 'none' }}>
                    <p className="text-[9px] font-black text-white/40 tracking-[0.3em] uppercase">
                        ESCUCHA TODOS LOS ESTRENOS EN <span className="text-white/80">https://musica.diosmasgym.com/</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpcomingReleaseCard;
