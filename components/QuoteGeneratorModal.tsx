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

const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({ onClose, albums }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [text, setText] = useState('Todo lo puedo en Cristo que me fortalece.');
    const [selectedBackground, setSelectedBackground] = useState<string>('gradient-1');
    const [author, setAuthor] = useState('@diosmasgym');
    
    // Get unique album covers for backgrounds
    const uniqueImages = albums.slice(0, 6).map(a => a.images[0]?.url).filter(Boolean);
    const backgrounds = [
        { id: 'gradient-1', value: 'linear-gradient(45deg, #0f172a, #334155)', label: 'Oscuro' },
        { id: 'gradient-2', value: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', label: 'Azul' },
        { id: 'gradient-3', value: 'linear-gradient(45deg, #581c87, #a855f7)', label: 'Púrpura' },
        ...uniqueImages.map((img, i) => ({ id: `album-${i}`, value: img, label: 'Album' }))
    ];

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set dimensions (Instagram Story ratio 9:16 roughly, simplified for sharing)
        canvas.width = 1080;
        canvas.height = 1080; // Square for feed is safer

        // Draw Background
        const bg = backgrounds.find(b => b.id === selectedBackground);
        
        if (bg?.id.startsWith('gradient')) {
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            if (bg.id === 'gradient-1') { gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#334155'); }
            if (bg.id === 'gradient-2') { gradient.addColorStop(0, '#1e3a8a'); gradient.addColorStop(1, '#3b82f6'); }
            if (bg.id === 'gradient-3') { gradient.addColorStop(0, '#581c87'); gradient.addColorStop(1, '#a855f7'); }
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawTextLayer(ctx, canvas);
        } else if (bg?.value) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = bg.value;
            img.onload = () => {
                // Cover fit
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                
                // Dark Overlay
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                drawTextLayer(ctx, canvas);
            };
            // If image fails or loads instantly from cache
            if (img.complete) {
                 // fallback handled by onload
            }
        }
    };

    const drawTextLayer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
        // Quote Text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 60px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const maxWidth = canvas.width * 0.8;
        const words = text.split(' ');
        let line = '';
        const lines = [];
        
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

        const lineHeight = 80;
        const totalHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalHeight) / 2;

        lines.forEach((l, i) => {
            ctx.fillText(l.trim(), canvas.width / 2, startY + (i * lineHeight));
        });

        // Quote Icon
        ctx.font = '120px serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText('"', canvas.width / 2, startY - 60);

        // Author
        ctx.fillStyle = '#60A5FA'; // Blue-400
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(author, canvas.width / 2, startY + totalHeight + 40);
        
        // Brand Footer
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '30px sans-serif';
        ctx.fillText('musica.diosmasgym.com', canvas.width / 2, canvas.height - 50);
    };

    useEffect(() => {
        drawCanvas();
    }, [text, selectedBackground, author]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        try {
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'diosmasgym-quote.png';
            link.href = dataUrl;
            link.click();
        } catch (e) {
            alert('No se pudo descargar debido a restricciones de seguridad del navegador con imágenes externas. Intenta usar un fondo de color.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
            <div className="bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col md:flex-row overflow-hidden">
                
                {/* Preview Area */}
                <div className="w-full md:w-1/2 p-8 bg-black flex items-center justify-center relative">
                    <canvas 
                        ref={canvasRef} 
                        className="w-full h-auto shadow-2xl rounded-lg max-w-[400px]"
                    />
                     <div className="absolute bottom-4 right-4 md:hidden">
                        <button onClick={onClose} className="bg-black/50 p-2 rounded-full text-white"><CloseIcon /></button>
                     </div>
                </div>

                {/* Controls Area */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">Crear Frase</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white hidden md:block"><CloseIcon /></button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tu Frase</label>
                        <textarea 
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32"
                            placeholder="Escribe algo inspirador..."
                            maxLength={150}
                        />
                         <div className="text-right text-xs text-gray-500 mt-1">{text.length}/150</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Firma</label>
                        <input 
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Fondo</label>
                        <div className="grid grid-cols-4 gap-2">
                            {backgrounds.map((bg) => (
                                <button
                                    key={bg.id}
                                    onClick={() => setSelectedBackground(bg.id)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedBackground === bg.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-slate-600'}`}
                                >
                                    {bg.id.startsWith('gradient') ? (
                                        <div className="w-full h-full" style={{ background: bg.value }}></div>
                                    ) : (
                                        <img src={bg.value} alt="bg" className="w-full h-full object-cover" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-700">
                        <button 
                            onClick={handleDownload}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-blue-900/20"
                        >
                            <DownloadIcon /> Descargar Imagen
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuoteGeneratorModal;