
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
);

const AlignTopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h18M12 9v10.5" />
    </svg>
);

const AlignCenterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
    </svg>
);

const AlignBottomIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19.5h18M12 4.5v10.5" />
    </svg>
);


// SVG Paths for Canvas Drawing
const ICONS = {
    instagram: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    tiktok: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.98-1.59-2.04-2.16-4.72-1.74-7.24.42-2.52 2.16-4.63 4.25-5.97.02-.01.03-.02.05-.04 1.48-1.04 3.39-1.34 5.22-1.08.16.02.33.04.5.05v4.52c-.88-.23-1.79-.32-2.69-.28-1.39.07-2.77.49-3.92 1.25-1.14.76-2.04 1.89-2.48 3.21-1.13 3.44 2.13 6.75 5.46 5.61 1.68-.57 2.84-2.09 3.11-3.8.03-.2.05-.4.05-.61v-8.41c-.01-.01.01-.01.01-.02z",
    youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
};

// Frases estilo Diosmasgym (Fe + Gym + Calle)
const PREDEFINED_QUOTES = [
    "Todo lo puedo en Cristo que me fortalece.",
    "El dolor de hoy es la fuerza de mañana.",
    "No es por vista, es por fe.",
    "Entrena tu cuerpo, alimenta tu espíritu.",
    "Dios no te da cargas que no puedas soportar.",
    "Sigo firme, no por suerte, sino por gracia.",
    "Disciplina es hacer lo que tengas que hacer, aunque no quieras.",
    "Mientras tenga vida, tengo esperanza.",
    "Mi competencia soy yo mismo ayer.",
    "Si Dios está conmigo, ¿quién contra mí?",
    "La gloria es de Dios, el esfuerzo es mío.",
    "Cada repetición cuenta, cada oración llega.",
    "No te rindas, tu milagro está cerca.",
    "Fe inquebrantable, espíritu indomable.",
    "Del barrio para el cielo.",
    "Construyendo un legado, no un momento.",
    "Limpia tu mente, fortalece tu alma.",
    "La humildad te abre puertas que el orgullo te cierra."
];

const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({ onClose, albums }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [text, setText] = useState('Todo lo puedo en Cristo que me fortalece.');
    const [selectedBackground, setSelectedBackground] = useState<string>('gradient-1');
    const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('center');
    
    // Get ALL unique album covers for backgrounds using Set to remove duplicates
    const uniqueImages = Array.from(new Set(albums.map(a => a.images[0]?.url).filter((url): url is string => !!url))) as string[];
    
    const backgrounds = [
        { id: 'gradient-1', value: 'linear-gradient(45deg, #0f172a, #334155)', label: 'Oscuro' },
        { id: 'gradient-2', value: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', label: 'Azul' },
        { id: 'gradient-3', value: 'linear-gradient(45deg, #581c87, #a855f7)', label: 'Púrpura' },
        { id: 'gradient-4', value: 'linear-gradient(135deg, #000000, #434343)', label: 'Negro Mate' },
        ...uniqueImages.map((img, i) => ({ id: `album-${i}`, value: img, label: 'Album' }))
    ];

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions Ultra High Resolution (2160x2160 - 4K for social media)
        canvas.width = 2160;
        canvas.height = 2160;
        
        // Ensure high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // --- DRAW BACKGROUND ---
        const bg = backgrounds.find(b => b.id === selectedBackground);
        
        const finishDrawing = () => {
             // --- VIGNETTE & OVERLAY ---
            // Gradient Vignette for focus
            const vignette = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, canvas.width * 0.4,
                canvas.width / 2, canvas.height / 2, canvas.width
            );
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, 'rgba(0,0,0,0.7)');
            ctx.fillStyle = vignette;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // --- NOISE TEXTURE (Film Grain) ---
            drawNoise(ctx, canvas);

            // Add gradient floor for footer readability
            const bottomGrad = ctx.createLinearGradient(0, canvas.height - 700, 0, canvas.height);
            bottomGrad.addColorStop(0, 'transparent');
            bottomGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
            ctx.fillStyle = bottomGrad;
            ctx.fillRect(0, canvas.height - 700, canvas.width, 700);

            drawTextLayer(ctx, canvas);
        };

        if (bg?.id.startsWith('gradient')) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            if (bg.id === 'gradient-1') { gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#334155'); }
            if (bg.id === 'gradient-2') { gradient.addColorStop(0, '#1e3a8a'); gradient.addColorStop(1, '#3b82f6'); }
            if (bg.id === 'gradient-3') { gradient.addColorStop(0, '#581c87'); gradient.addColorStop(1, '#a855f7'); }
            if (bg.id === 'gradient-4') { gradient.addColorStop(0, '#000000'); gradient.addColorStop(1, '#434343'); }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            finishDrawing();
        } else if (bg?.value) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = bg.value;
            img.onload = () => {
                // Cover fit logic
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                // Dark Tint Overlay for readability over images
                // Stronger tint if it's an image
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                finishDrawing();
            };
            // Fallback if image load fails
            img.onerror = () => {
                 ctx.fillStyle = '#000';
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
                 finishDrawing();
            }
        } else {
             finishDrawing();
        }
    };
    
    // Function to add subtle grain
    const drawNoise = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        const w = canvas.width;
        const h = canvas.height;
        
        ctx.save();
        ctx.globalAlpha = 0.05; 
        ctx.globalCompositeOperation = 'overlay';
        
        // Fast random noise generation
        for(let i=0; i<4000; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#000';
            ctx.fillRect(Math.random() * w, Math.random() * h, 3, 3);
        }
        ctx.restore();
    };

    const drawIcon = (ctx: CanvasRenderingContext2D, pathString: string, x: number, y: number, size: number) => {
        const scale = size / 24;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        const path = new Path2D(pathString);
        ctx.fill(path);
        ctx.restore();
    };

    const drawTextLayer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // --- TEXT SIZING LOGIC ---
        // Adjust font size based on text length to fill space better
        const textLength = text.length;
        let baseFontSize = 130;
        if (textLength < 20) baseFontSize = 200;
        else if (textLength < 50) baseFontSize = 160;
        else if (textLength > 100) baseFontSize = 100;

        ctx.font = `900 ${baseFontSize}px system-ui, -apple-system, sans-serif`; 
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Outline Logic for Readability (Stroke)
        ctx.lineWidth = baseFontSize * 0.08; // Proportional outline
        ctx.strokeStyle = 'rgba(0,0,0, 0.9)'; // Hard black outline
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;

        // Shadow Logic (Soft Glow)
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 10;

        const maxWidth = canvas.width * 0.85;
        const words = text.split(' ');
        let line = '';
        const lines = [];
        
        // Word Wrapping
        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(line);
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const lineHeight = baseFontSize * 1.25; 
        const totalHeight = lines.length * lineHeight;
        
        // --- VERTICAL POSITIONING ---
        let startY = (canvas.height - totalHeight) / 2; // Default Center
        
        if (textPosition === 'top') {
            startY = 350; // Top Padding
        } else if (textPosition === 'bottom') {
            startY = canvas.height - 400 - totalHeight; // Bottom padding accounting for footer
        } else {
            // Center - Slight adjustment up to look optically centered with footer
            startY -= 100;
        }

        // --- DRAW TEXT ---
        ctx.fillStyle = '#ffffff';

        lines.forEach((l, i) => {
            const y = startY + (i * lineHeight);
            // Draw Stroke First
            ctx.strokeText(l.trim(), canvas.width / 2, y);
            // Draw Fill
            ctx.fillText(l.trim(), canvas.width / 2, y);
        });

        // --- DECORATIVE QUOTE MARKS ---
        // Only show quote mark if text is centered or top
        if (textPosition !== 'bottom') {
             ctx.font = 'italic 300px serif';
             ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
             // No outline for this
             ctx.shadowBlur = 0;
             ctx.lineWidth = 0;
             ctx.fillText('"', canvas.width / 2, startY - (baseFontSize * 0.8));
        }
        
        // --- SOCIAL FOOTER ---
        const footerY = canvas.height - 150;
        const iconSize = 80;
        const iconGap = 40;
        const textGap = 40;
        const handleText = "@Diosmasgym";
        
        ctx.font = 'bold 85px system-ui, -apple-system, sans-serif';
        const textMetrics = ctx.measureText(handleText);
        
        const totalGroupWidth = (iconSize * 3) + (iconGap * 2) + textGap + textMetrics.width;
        let startX = (canvas.width - totalGroupWidth) / 2;

        // Draw Icons (White)
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        drawIcon(ctx, ICONS.instagram, startX, footerY - (iconSize/1.5), iconSize);
        startX += iconSize + iconGap;
        
        drawIcon(ctx, ICONS.tiktok, startX, footerY - (iconSize/1.5), iconSize);
        startX += iconSize + iconGap;

        drawIcon(ctx, ICONS.youtube, startX, footerY - (iconSize/1.5), iconSize);
        startX += iconSize + textGap;

        // Draw Text Handle
        ctx.textAlign = 'left';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.strokeText(handleText, startX, footerY);

        ctx.fillStyle = '#60A5FA'; // Blue-400
        ctx.fillText(handleText, startX, footerY);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
             drawCanvas();
        }, 100);
        return () => clearTimeout(timer);
    }, [text, selectedBackground, textPosition]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.download = `diosmasgym-frase-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (e) {
            alert('Error al descargar. Intenta mantener pulsada la imagen para guardarla.');
        }
    };

    const handleRandomQuote = () => {
        const random = PREDEFINED_QUOTES[Math.floor(Math.random() * PREDEFINED_QUOTES.length)];
        setText(random);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-4 animate-fade-in overflow-y-auto">
            <div className="bg-slate-900 w-full h-full md:h-auto md:max-w-6xl md:rounded-2xl shadow-2xl border-none md:border border-slate-700 flex flex-col md:flex-row overflow-hidden">
                
                {/* Preview Area */}
                <div className="w-full md:w-1/2 p-4 md:p-8 bg-black flex items-center justify-center relative flex-shrink-0">
                    <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800">
                        <canvas 
                            ref={canvasRef} 
                            className="w-full h-auto max-w-[350px] md:max-w-[500px]"
                            style={{ aspectRatio: '1/1' }}
                        />
                    </div>
                     <div className="absolute top-4 left-4 md:hidden z-10">
                        <button onClick={onClose} className="bg-black/50 p-2 rounded-full text-white"><CloseIcon /></button>
                     </div>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 bg-slate-900 overflow-y-auto max-h-[100vh]">
                    <div className="hidden md:flex justify-between items-center mb-2">
                        <h2 className="text-2xl font-bold text-white">Diseñador de Frases</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white"><CloseIcon /></button>
                    </div>

                    {/* Text Input */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                             <label className="block text-sm font-medium text-gray-400">Tu Frase</label>
                             <button 
                                onClick={handleRandomQuote}
                                className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                             >
                                <ShuffleIcon /> Aleatorio
                             </button>
                        </div>
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-lg"
                            placeholder="Escribe algo inspirador..."
                            maxLength={120}
                        />
                    </div>

                    {/* Positioning Controls */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Posición del Texto</label>
                        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                            <button 
                                onClick={() => setTextPosition('top')}
                                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${textPosition === 'top' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                            >
                                <AlignTopIcon /> Arriba
                            </button>
                            <button 
                                onClick={() => setTextPosition('center')}
                                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${textPosition === 'center' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                            >
                                <AlignCenterIcon /> Centro
                            </button>
                            <button 
                                onClick={() => setTextPosition('bottom')}
                                className={`flex-1 py-2 rounded-md flex items-center justify-center gap-2 transition-colors ${textPosition === 'bottom' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-slate-700'}`}
                            >
                                <AlignBottomIcon /> Abajo
                            </button>
                        </div>
                    </div>

                    {/* Background Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Fondo</label>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {backgrounds.map((bg) => (
                                <button
                                    key={bg.id}
                                    onClick={() => setSelectedBackground(bg.id)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative group ${selectedBackground === bg.id ? 'border-blue-500 scale-95 ring-2 ring-blue-500/50' : 'border-slate-700 hover:border-slate-500'}`}
                                >
                                    {bg.id.startsWith('gradient') ? (
                                        <div className="w-full h-full" style={{ background: bg.value }}></div>
                                    ) : (
                                        <img src={bg.value} alt="bg" className="w-full h-full object-cover" />
                                    )}
                                    {selectedBackground === bg.id && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full shadow-md"></div>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-800">
                        <button 
                            onClick={handleDownload}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-blue-900/30"
                        >
                            <DownloadIcon /> Descargar Imagen HD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteGeneratorModal;
