import React, { useState, useRef, useEffect } from 'react';
import type { Album } from '../types';

interface QuoteGeneratorModalProps {
    onClose: () => void;
    albums: Album[];
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

const ShuffleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662" />
    </svg>
);

// SVGs as Data URIs for Canvas Drawing - Updated with explicit dimensions and clean base64
const IG_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTcuOCAyaDguNEMxOS40IDIgMjIgNC42IDIyIDcuOHY4LjRhNS44IDUuOCAwIDAgMS01LjggNS44SDcuOEM0LjYgMjIgMiAxOS40IDIgMTYuMlY3LjhBNS44IDUuOCAwIDAgMSA3LjggMm0tLjIgMkEzLjYgMy42IDAgMCAwIDQgNy42djguOEM0IDE4LjM5IDUuNjEgMjAgNy42IDIwaDguOGEzLjYgMy42IDAgMCAwIDMuNi0zLjZWNy42QzIwIDUuNjEgMTguMzkgNCAxNi40IDRINy42bTkuNjUgMS41YTEuMjUgMS4yNSAwIDAgMSAxLjI1IDEuMjVBMS4yNSAxLjI1IDAgMCAxIDE3LjI1IDggMS4yNSAxLjI1IDAgMCAxIDE2IDYuNzVhMS4yNSAxLjI1IDAgMCAxIDEuMjUtMS4yNU0xMiA3YTUgNSAwIDAgMSA1IDUgNSA1IDAgMCAxLTUgNSA1IDAgMCAxLTUtNSA1IDAgMCAxIDUtNW0wIDJhMyAzIDAgMCAwLTMgMyAzIDMgMCAwIDAgMyAzIDMgMyAwIDAgMCAzLTMgMyAzIDAgMCAwLTMtM3oiLz48L3N2Zz4=";
const TIKTOK_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyLjUyNS4wMmMxLjMxLS4wMiAyLjYxLS4wMSAzLjkxLS4wMi4wOCAxLjUzLjYzIDMuMDkgMS43NSA0LjE3IDEuMTIgMS4xMSAyLjcgMS42MiA0LjI0IDEuNzl2NC4wM2MtMS40NC0uMDUtMi44OS0uMzUtNC4yLS45Ny0uNTctLjI2LTEuMS0uNTktMS42Mi0uOTMtLjAxIDIuOTIuMDEgNS44NC0uMDIgOC43NS0uMDggMS40LS41NCAyLjc5LTEuMzUgMy45NC0xLjMxIDEuOTItMy41OCAzLjE3LTUuOTEgMy4yMS0yLjQzLjA1LTQuODQtLjk1LTYuNDMtMi45OC0xLjU5LTIuMDQtMi4xNi00LjcyLTEuNzQtNy4yNC40Mi0yLjUyIDIuMTYtNC42MyA0LjI1LTUuOTcuMDItLjAxLjAzLS4wMi4wNS0uMDQgMS40OC0xLjA0IDMuMzktMS4zNCA1LjIyLTEuMDguMTYuMDIuMzMuMDQuNS4wNXY0LjUyYy0uODgtLjIzLTEuNzktLjMyLTIuNjktLjI4LTEuMzkuMDctMi43Ny40OS0zLjkyIDEuMjUtMS4xNC43Ni0yLjA0IDEuODktMi40OCAzLjIxLTEuMTMgMy40NCAyLjEzIDYuNzUgNS40NiA1LjYxIDEuNjg5LS41NyAyLjg0LTIuMDkgMy4xMS0zLjguMDMtLjIuMDUtLjQuMDUtLjYxdi04LjQxYy0uMDEtLjAxLjAxLS4wMS4wMS0uMDJ6Ii8+PC9zdmc+";
const YOUTUBE_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTIzLjQ5OCA2LjE4NmEzLjAxNiAzLjAxNiAwIDAgMC0yLjEyMi0yLjEzNkMxOS41MDUgMy41NDUgMTIgMy41NDUgMTIgMy41NDVzLTcuNTA1IDAtOS4zNzcuNTA1QTMuMDE3IDMuMDE3IDAgMCAwIC41MDIgNi4xODZDMCA4LjA3IDAgMTIgMCAxMnMwIDMuOTMuNTAyIDUuODE0YTMuMDE2IDMuMDE2IDAgMCAwIDIuMTIyIDIuMTM2YzEuODcxLjUwNSA5LjM3Ni41MDUgOS4zNzYuNTA1czcuNTA1IDAgOS4zNzctLjUwNWEzLjAxNSAzLjAxNSAwIDAgMCAyLjEyMi0yLjEzNkMyNCAxNS45MyAyNCAxMiAyNCAxMnMwLTMuOTMtLjUwMi01LjgxNHpNOS41NDUgMTUuNTY4VjguNDMyTDE1LjgxOCAxMmwtNi4yNzMgMy41Njh6Ii8+PC9zdmc+";
const SPOTIFY_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDBDNS4zNzMgMCAwIDUuMzczIDAgMTJzNS4zNzMgMTIgMTIgMTIgMTItNS4zNzMgMTItMTJTMTguNjI3IDAgMTIgMHptNS45MjMgMTcuNTQyYy0uMjIzLjM1OC0uNjkuNDYzLTEuMDQ4LjI0bC0zLjUzLTIuMTUyYy0uMzU3LS4yMjItLjQ2My0uNjktLjI0LTEuMDQ4LjIyMi0uMzU3LjY5LS40NjMgMS4wNDgtLjI0bDMuNTMgMi4xNTNjLjM1Ny4yMi40NjMuNjg4LjI0IDEuMDQ3em0xLjE0LTIuMzRjLS4yNzguNDQ0LS44Ni41NzgtMS4zMDQuM2wtNC40NC0yLjcwNGMtLjQ0NC0uMjc4LS41NzctLjg2LS4zLTEuMzA0LjI3OC0uNDQ0Ljg2LS41NzcgMS4zMDQuM2wtNC40NCAyLjcwNGMuNDQ0LjI3OC41NzguODYuMyAxLjMwNHptLjEyLTIuNTgzYy0uMzM0LjUzMy0xLjAyNS43LTEuNTU4LjM1OGwtNS4zNC0zLjI1Yy0uNTMzLS4zMzQtLjctLjEwMjUtLjM2LS4xNTU4LjMzMy0uNTMzIDEuMDI1LS43IDEuNTU4LS4zNThsNS4zNCAzLjI1Yy41MzMuMzQyLjcuMTAyNS4zNi4xNTZ6Ii8+PC9zdmc+";
const APPLE_MUSIC_ICON_URI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEyIDN2MTAuNTVjLS41OS0uMzQtMS4yNy0uNTUtMi0uNTVBNCBMIDQgMCAwIDAgNiAxN2E0IDQgMCAwIDAgNCA0IDQgNCAwIDAgMCA0LTRWN2g0VjNoLTZ6Ii8+PC9zdmc+";

const PRESET_QUOTES = [
    "Todo lo puedo en Cristo que me fortalece.",
    "No es por vista, es por fe.",
    "Si Dios es por nosotros, ¿quién contra nosotros?",
    "Esfuérzate y sé valiente.",
    "La fe mueve montañas, pero la oración las escala.",
    "Tu gracia es suficiente.",
    "Dios no te da una carga que no puedas llevar.",
    "Donde terminan mis fuerzas, empiezan las de Dios.",
    "Confía en los tiempos de Dios.",
    "Soy un guerrero de Dios, mi armadura es la fe."
];

type AspectRatio = '1:1' | '4:5' | '9:16';

interface Dimensions {
    width: number;
    height: number;
    label: string;
}

const DIMENSIONS: Record<AspectRatio, Dimensions> = {
    '1:1': { width: 1080, height: 1080, label: 'Cuadrado (Post)' },
    '4:5': { width: 1080, height: 1350, label: 'Retrato (Feed)' },
    '9:16': { width: 1080, height: 1920, label: 'TikTok / Historia' }
};

const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({ onClose, albums }) => {
    const [text, setText] = useState(PRESET_QUOTES[0]);
    const [selectedImage, setSelectedImage] = useState<string>(albums[0]?.images[0]?.url || '');
    const [verticalAlign, setVerticalAlign] = useState<'top' | 'center' | 'bottom'>('center');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const iconsRef = useRef<HTMLImageElement[]>([]);
    const [iconsLoaded, setIconsLoaded] = useState(false);

    useEffect(() => {
        // Load icons exactly once
        const iconUris = [IG_ICON_URI, TIKTOK_ICON_URI, YOUTUBE_ICON_URI, SPOTIFY_ICON_URI, APPLE_MUSIC_ICON_URI];
        const loadedIcons: HTMLImageElement[] = iconUris.map(uri => {
            const img = new Image();
            img.src = uri;
            return img;
        });

        // Robust Promise.all to ensure we wait for all to be "ready" (loaded or errored)
        Promise.all(loadedIcons.map(img => {
            return new Promise<void>(resolve => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.error("Failed to load icon", img.src);
                        resolve(); // Resolve anyway so we don't block
                    };
                }
            });
        })).then(() => {
            iconsRef.current = loadedIcons;
            setIconsLoaded(true);
        });
    }, []);

    const handleShuffle = () => {
        const randomQuote = PRESET_QUOTES[Math.floor(Math.random() * PRESET_QUOTES.length)];
        setText(randomQuote);
        
        if (albums.length > 0) {
            const randomAlbum = albums[Math.floor(Math.random() * albums.length)];
            const img = randomAlbum.images[0]?.url;
            if (img) setSelectedImage(img);
        }
    };

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dims = DIMENSIONS[aspectRatio];
        canvas.width = dims.width;
        canvas.height = dims.height;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = selectedImage;
        
        img.onload = () => {
            // 1. Draw Background (Cover)
            const imgAspect = img.width / img.height;
            const canvasAspect = canvas.width / canvas.height;
            
            let renderWidth, renderHeight, offsetX, offsetY;

            if (imgAspect > canvasAspect) {
                renderHeight = canvas.height;
                renderWidth = img.width * (canvas.height / img.height);
                offsetX = (canvas.width - renderWidth) / 2;
                offsetY = 0;
            } else {
                renderWidth = canvas.width;
                renderHeight = img.height * (canvas.width / img.width);
                offsetX = 0;
                offsetY = (canvas.height - renderHeight) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);

            // 2. Add Overlay (Darker)
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Draw Text
            const fontSize = aspectRatio === '9:16' ? 60 : 50;
            ctx.font = `900 ${fontSize}px sans-serif`;
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 20;
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';

            // Word wrap logic
            const words = text.split(' ');
            let line = '';
            const lines = [];
            const maxWidth = canvas.width * 0.85;
            const lineHeight = fontSize * 1.3;

            for(let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = ctx.measureText(testLine);
                const testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            // Calculate Y position
            const totalTextHeight = lines.length * lineHeight;
            let startY = (canvas.height - totalTextHeight) / 2;

            if (verticalAlign === 'top') {
                startY = canvas.height * 0.2; // 20% from top
            } else if (verticalAlign === 'bottom') {
                startY = canvas.height * 0.8 - totalTextHeight; // 20% from bottom
            }

            // Draw Lines
            lines.forEach((l, i) => {
                const y = startY + (i * lineHeight);
                ctx.strokeText(l, canvas.width / 2, y); // Outline first
                ctx.fillText(l, canvas.width / 2, y);   // Fill second
            });

            // 4. Draw Footer with Icons
            const footerY = canvas.height - 60;
            const handleText = '@Diosmasgym';
            ctx.font = 'bold 30px sans-serif';
            const textMetrics = ctx.measureText(handleText);
            
            // Icon settings
            const iconSize = 30;
            const iconPadding = 15;
            
            // Use the length of the icons we actually have
            const numIcons = iconsRef.current.length > 0 ? iconsRef.current.length : 5;
            const totalIconsWidth = (iconSize * numIcons) + (iconPadding * (numIcons - 1));
            
            const paddingX = 30;
            const gapBetweenIconsAndText = 20;
            
            const bgWidth = totalIconsWidth + gapBetweenIconsAndText + textMetrics.width + (paddingX * 2);
            const bgHeight = 70;
            const bgX = (canvas.width / 2) - (bgWidth / 2);
            const bgY = footerY - (bgHeight / 2);

            // Reset shadow
            ctx.shadowBlur = 0;
            ctx.lineWidth = 0;

            // Semi-transparent pill background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            
            // Helper for rounded rect (Polyfill for compatibility)
            const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
                if (typeof ctx.roundRect === 'function') {
                    ctx.beginPath();
                    ctx.roundRect(x, y, w, h, r);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.lineTo(x + w - r, y);
                    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                    ctx.lineTo(x + w, y + h - r);
                    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                    ctx.lineTo(x + r, y + h);
                    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                    ctx.lineTo(x, y + r);
                    ctx.quadraticCurveTo(x, y, x + r, y);
                    ctx.closePath();
                    ctx.fill();
                }
            };

            roundRect(ctx, bgX, bgY, bgWidth, bgHeight, 35);

            // Draw Icons
            let currentIconX = bgX + paddingX;
            const iconY = footerY - (iconSize / 2);
            
            // Draw icons from ref
            if (iconsRef.current.length > 0) {
                iconsRef.current.forEach(iconImg => {
                    // Try to draw if it's available
                    try {
                         ctx.drawImage(iconImg, currentIconX, iconY, iconSize, iconSize);
                    } catch (e) {
                        console.warn("Error drawing icon onto canvas", e);
                    }
                    currentIconX += iconSize + iconPadding;
                });
            }

            // Draw Text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            const textX = currentIconX - iconPadding + gapBetweenIconsAndText; 
            ctx.fillText(handleText, textX, footerY);
        };
    };

    useEffect(() => {
        // Redraw whenever inputs change OR icons finish loading
        const timeout = setTimeout(() => {
             drawCanvas();
        }, 100);
        return () => clearTimeout(timeout);
    }, [text, selectedImage, verticalAlign, aspectRatio, iconsLoaded]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        try {
            const link = document.createElement('a');
            link.download = `diosmasgym-frase-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        } catch (err) {
            console.error("Error downloading image", err);
            alert("No se pudo descargar la imagen automáticamente. Intenta mantener presionada la imagen para guardarla.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animate-fade-in">
            <div className="bg-slate-900 w-full md:max-w-6xl h-full md:h-[95vh] md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-700">
                
                {/* 1. Preview Area (Top on Mobile) */}
                <div className="w-full md:w-2/3 bg-black flex items-center justify-center p-4 md:p-8 relative overflow-hidden flex-shrink-0 min-h-[45vh] md:h-full border-b md:border-b-0 md:border-l border-slate-800 order-1 md:order-2">
                     {/* Checkerboard pattern for transparency indication */}
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    
                    <div className="relative shadow-2xl shadow-black/50 h-full w-full flex items-center justify-center">
                         <canvas 
                            ref={canvasRef} 
                            className="max-h-full max-w-full object-contain rounded-sm shadow-xl"
                        />
                    </div>
                </div>

                {/* 2. Controls Area (Bottom on Mobile) */}
                <div className="w-full md:w-1/3 p-6 flex flex-col gap-6 overflow-y-auto bg-slate-900 order-2 md:order-1 h-full">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl md:text-2xl font-bold text-white">Crear Frase</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white bg-slate-800 p-2 rounded-full"><CloseIcon /></button>
                    </div>

                    {/* Aspect Ratio Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tamaño de Imagen</label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['1:1', '4:5', '9:16'] as AspectRatio[]).map((ratio) => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`py-2 px-1 text-xs md:text-sm rounded-lg font-medium transition-all ${
                                        aspectRatio === ratio 
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                    }`}
                                >
                                    {DIMENSIONS[ratio].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tu Frase</label>
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none h-20 resize-none"
                            placeholder="Escribe algo inspirador..."
                        />
                         <div className="flex gap-2 mt-2">
                            <button 
                                onClick={handleShuffle}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors"
                            >
                                <ShuffleIcon /> Aleatorio
                            </button>
                        </div>
                    </div>

                    {/* Position Controls */}
                    <div>
                         <label className="block text-sm font-medium text-gray-400 mb-2">Posición del Texto</label>
                         <div className="flex bg-slate-800 rounded-lg p-1">
                            <button 
                                onClick={() => setVerticalAlign('top')}
                                className={`flex-1 py-1 rounded text-sm ${verticalAlign === 'top' ? 'bg-slate-600 text-white' : 'text-gray-400'}`}
                            >Arriba</button>
                            <button 
                                onClick={() => setVerticalAlign('center')}
                                className={`flex-1 py-1 rounded text-sm ${verticalAlign === 'center' ? 'bg-slate-600 text-white' : 'text-gray-400'}`}
                            >Centro</button>
                            <button 
                                onClick={() => setVerticalAlign('bottom')}
                                className={`flex-1 py-1 rounded text-sm ${verticalAlign === 'bottom' ? 'bg-slate-600 text-white' : 'text-gray-400'}`}
                            >Abajo</button>
                         </div>
                    </div>

                    {/* Album Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Fondo (Álbum)</label>
                        <div className="grid grid-cols-4 gap-2 max-h-32 md:max-h-40 overflow-y-auto p-1">
                            {albums.map(album => (
                                <button
                                    key={album.id}
                                    onClick={() => setSelectedImage(album.images[0]?.url)}
                                    className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${selectedImage === album.images[0]?.url ? 'border-blue-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={album.images[0]?.url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="mt-4 md:mt-auto w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] mb-8 md:mb-0"
                    >
                        <DownloadIcon /> Descargar Imagen
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteGeneratorModal;