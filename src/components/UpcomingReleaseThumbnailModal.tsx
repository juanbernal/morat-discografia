import React, { useState, useRef, useEffect } from 'react';
import type { UpcomingRelease, Album } from '../types';
import { toPng } from 'html-to-image';
import SpotifyIcon from './SpotifyIcon';
import TiktokIcon from './TiktokIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';
import AmazonMusicIcon from './AmazonMusicIcon';
import InstagramIcon from './InstagramIcon';
import CountdownTimer from './CountdownTimer';
import ReleaseSchedule from './ReleaseSchedule';

interface UpcomingReleaseThumbnailModalProps {
    onClose: () => void;
    releases: UpcomingRelease[];
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5" transform="rotate(180 12 12)" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5" />
    </svg>
);

type AspectRatio = '1:1' | '4:5' | '9:16';

interface Dimensions {
    width: number;
    height: number;
    label: string;
    containerClass: string;
}

const DIMENSIONS: Record<AspectRatio, Dimensions> = {
    '1:1': { width: 1080, height: 1080, label: 'Cuadrado (Post)', containerClass: 'aspect-square max-w-[500px]' },
    '4:5': { width: 1080, height: 1350, label: 'Retrato (Feed)', containerClass: 'aspect-[4/5] max-w-[400px]' },
    '9:16': { width: 1080, height: 1920, label: 'TikTok / Historia', containerClass: 'aspect-[9/16] max-w-[300px]' }
};

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

const UpcomingReleaseThumbnailModal: React.FC<UpcomingReleaseThumbnailModalProps> = ({ onClose, releases }) => {
    const [selectedRelease, setSelectedRelease] = useState<UpcomingRelease>(releases[0] || null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const captureRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [base64Cover, setBase64Cover] = useState<string>('');

    useEffect(() => {
        if (!selectedRelease) return;
        let isMounted = true;

        const fetchImageAsBase64 = async () => {
            try {
                const response = await fetch(selectedRelease.coverImageUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (isMounted) setBase64Cover(reader.result as string);
                };
                reader.readAsDataURL(blob);
            } catch (error) {
                console.error("Error fetching release image for base64 bypass", error);
                if (isMounted) setBase64Cover(selectedRelease.coverImageUrl);
            }
        };

        fetchImageAsBase64();
        return () => { isMounted = false; };
    }, [selectedRelease]);

    // Si no hay releases, no mostramos nada
    if (!releases || releases.length === 0) return null;

    const release = selectedRelease;
    const isJuan614 = release.artistName.toLowerCase().includes('614');
    const releaseDateObj = parseCustomDateString(release.releaseDate);
    const formattedDate = releaseDateObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long'
    }).toUpperCase();

    const handleDownload = async () => {
        if (!captureRef.current) return;
        setIsDownloading(true);

        try {
            // Utilizamos toPng de html-to-image igual que en UpcomingReleaseCard
            const dataUrl = await toPng(captureRef.current, {
                cacheBust: true,
                backgroundColor: '#050b18',
                pixelRatio: 2,
                skipFonts: true,
                // Aplicamos las dimensiones seleccionadas para el renderizado
                width: DIMENSIONS[aspectRatio].width,
                height: DIMENSIONS[aspectRatio].height,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left',
                    width: `${DIMENSIONS[aspectRatio].width}px`,
                    height: `${DIMENSIONS[aspectRatio].height}px`,
                }
            });

            const link = document.createElement('a');
            link.download = `Estreno_${release.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${aspectRatio.replace(':', 'x')}.png`;
            link.href = dataUrl;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading image', error);
            alert("Hubo un problema al guardar la imagen. Inténtalo de nuevo.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Estilos dinámicos para el área de previsualización basados en el aspect ratio
    const isVertical = aspectRatio === '9:16' || aspectRatio === '4:5';
    const padding = aspectRatio === '1:1' ? 'p-12' : (aspectRatio === '4:5' ? 'p-16' : 'p-10 pt-20');
    const scaleFactor = aspectRatio === '9:16' ? 0.35 : (aspectRatio === '4:5' ? 0.45 : 0.5);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animate-fade-in">
            <div className="bg-slate-900 w-full md:max-w-6xl h-full md:h-[95vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-700">

                {/* 1. Preview Area */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden flex-shrink-0 min-h-[50vh] md:h-full border-b md:border-b-0 md:border-l border-slate-800 order-1 md:order-2">
                    {/* Checkerboard pattern for transparency indication */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                    {/* Contenedor de escala para encajar la previsualización en la pantalla */}
                    <div className="relative shadow-2xl shadow-black/50 flex items-center justify-center" style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'center' }}>

                        {/* Elemento a capturar */}
                        <div
                            ref={captureRef}
                            className={`relative bg-[#050b18] overflow-hidden flex flex-col ${padding}`}
                            style={{ width: DIMENSIONS[aspectRatio].width, height: DIMENSIONS[aspectRatio].height }}
                        >
                            {/* Blur Background del cover */}
                            <div className="absolute inset-0 opacity-20">
                                <img src={base64Cover || release.coverImageUrl} className="w-full h-full object-cover blur-3xl" alt="" />
                                <div className="absolute inset-0 bg-black/50"></div>
                            </div>

                            <div className="relative z-10 flex flex-col h-full border border-white/10 rounded-[3rem] p-12 bg-black/40 backdrop-blur-md">
                                {/* Header Badge */}
                                <div className="flex justify-between items-center mb-16">
                                    <span className={`px-6 py-2 rounded-full text-2xl font-black uppercase tracking-widest border ${isJuan614 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                        {release.artistName.toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></span>
                                        <span className="text-2xl font-black text-white/60 tracking-widest uppercase">PRÓXIMO ESTRENO</span>
                                    </div>
                                </div>

                                {/* Art & Title Area */}
                                <div className={`flex flex-col items-center flex-1 justify-center ${isVertical ? 'gap-12' : 'gap-4'}`}>
                                    <div className={`relative aspect-square rounded-[3rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 ${aspectRatio === '1:1' ? 'w-[400px]' : 'w-[600px] mt-10'}`}>
                                        <img src={base64Cover || release.coverImageUrl} alt={release.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="text-center w-full px-8">
                                        <h3 className={`${isVertical ? 'text-8xl mt-8' : 'text-6xl'} font-black text-white leading-tight tracking-tighter mb-6`}>
                                            {release.name}
                                        </h3>
                                        <p className={`${isVertical ? 'text-4xl' : 'text-3xl'} font-black tracking-[0.4em] uppercase ${isJuan614 ? 'text-amber-500' : 'text-blue-500'}`}>
                                            DISPONIBLE EL {formattedDate}
                                        </p>
                                    </div>
                                </div>

                                {/* Bottom Area: Horarios / Watermark */}
                                <div className="mt-auto pt-8">
                                    {/* Dependiendo de si es 1:1 o vertical, mostramos diferentes elementos de UI para no saturar */}
                                    <div className={`w-full ${isVertical ? 'mb-16 scale-125 origin-bottom' : 'mb-6'}`}>
                                        <ReleaseSchedule variant={isJuan614 ? 'amber' : 'blue'} />
                                    </div>

                                    <div className="flex flex-col items-center gap-4 mt-6 mb-2">
                                        <div className="flex bg-black/60 border border-white/20 backdrop-blur-md px-8 py-4 rounded-full gap-5 items-center shadow-xl">
                                            <InstagramIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <TiktokIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <YoutubeMusicIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <SpotifyIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <AppleMusicIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <AmazonMusicIcon className="w-8 h-8 text-amber-500 opacity-90 drop-shadow-md" />
                                            <span className="text-white font-black text-2xl ml-2 drop-shadow-md">{isJuan614 ? '@Juan614' : '@Diosmasgym'}</span>
                                        </div>
                                        <p className="text-2xl font-black text-white/50 tracking-[0.3em] uppercase mt-2">
                                            ESCUCHA TODOS LOS ESTRENOS EN <span className="text-white/90">https://musica.diosmasgym.com/</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Controls Area */}
                <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-900 order-2 md:order-1 h-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Crear Miniatura</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><CloseIcon /></button>
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Formato de Imagen</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`py-3 px-1 text-xs md:text-sm rounded-lg font-medium transition-all ${aspectRatio === ratio
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {DIMENSIONS[ratio].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Release Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Seleccionar Estreno</label>
                        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                            {releases.map(item => (
                                <button
                                    key={item.name}
                                    onClick={() => setSelectedRelease(item)}
                                    className={`flex items-center gap-4 p-3 rounded-xl transition-all border ${selectedRelease?.name === item.name ? 'border-blue-500 bg-blue-500/10' : 'border-slate-800 bg-slate-800/50 hover:bg-slate-800'}`}
                                >
                                    <img src={item.coverImageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover shadow-md" />
                                    <div className="text-left">
                                        <p className="font-bold text-white text-sm line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{item.artistName}</p>
                                        <p className="text-xs text-blue-400 mt-1">{item.releaseDate}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`mt-4 md:mt-auto w-full font-bold py-4 rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-transform mb-8 md:mb-0 ${isDownloading ? 'bg-blue-800 text-white/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02]'}`}
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando...
                            </>
                        ) : (
                            <>
                                <DownloadIcon /> Descargar Imagen
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpcomingReleaseThumbnailModal;
