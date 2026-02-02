
import React, { useState, useRef, useEffect } from 'react';

// Icons replacement for lucide-react (since we can't install packages)
const Camera = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
);
const List = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
const User = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const Check = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
);
const ChevronRight = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"/></svg>
);
const ChevronLeft = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="15 18 9 12 15 6"/></svg>
);
const Download = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const X = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const Disc = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
);
const Loader2 = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

// Iconos de Marcas OFICIALES y SIMPLIFICADOS (SVG Clean)
const BrandIcons = {
  Spotify: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  AppleMusic: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M22.54 5.36a1.69 1.69 0 0 0-1.27-.47H9.7a1.69 1.69 0 0 0-1.7 1.62v10.17a3.66 3.66 0 0 0-2.58-.85c-2.2 0-4 1.62-4 3.6s1.8 3.6 4 3.6c2.1 0 3.8-1.46 3.98-3.36h.02V10.47h11.17v5.3a3.66 3.66 0 0 0-2.58-.85c-2.2 0-4 1.62-4 3.6s1.8 3.6 4 3.6c2.1 0 3.8-1.46 3.98-3.36h.02V7a1.65 1.65 0 0 0-.47-1.64z"/>
    </svg>
  ),
  TikTok: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  ),
  Instagram: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
    </svg>
  )
};

interface CoverMasterProps {
    onClose: () => void;
}

const CoverMaster: React.FC<CoverMasterProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [albumCover, setAlbumCover] = useState<string | null>(null);
  const [artistName, setArtistName] = useState('Diosmasgym');
  const [albumTitle, setAlbumTitle] = useState('');
  const [numSongs, setNumSongs] = useState(4);
  const [tracklist, setTracklist] = useState<string[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light' | 'vibrant'>('dark');
  const [isDownloading, setIsDownloading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script already exists to avoid duplication
    if (!document.querySelector('script[src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"]')) {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
             // Optional: remove script on unmount, but generally fine to keep for cache
        }
    }
  }, []);

  useEffect(() => {
    setTracklist(Array(numSongs).fill(''));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAlbumCover(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async () => {
    // @ts-ignore
    if (!previewRef.current || !window.html2canvas) {
      alert("La herramienta de descarga aún se está cargando, intenta en un segundo.");
      return;
    }
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      // @ts-ignore
      const canvas = await window.html2canvas(previewRef.current, {
        scale: 3, // Alta calidad
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `Diosmasgym-${albumTitle || 'cover'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Hubo un problema generando la imagen.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNumSongsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setNumSongs(val);
    setTracklist(prev => {
      const newArr = Array(val).fill('');
      prev.forEach((t, i) => { if(i < val) newArr[i] = t; });
      return newArr;
    });
  };

  const handleTrackNameChange = (index: number, value: string) => {
    const newTracks = [...tracklist];
    newTracks[index] = value;
    setTracklist(newTracks);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const themes = {
    dark: {
      bg: 'bg-zinc-900',
      text: 'text-white',
      card: 'bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl',
      accent: 'text-emerald-400',
      gradient: 'from-zinc-900 to-black'
    },
    light: {
      bg: 'bg-gray-100',
      text: 'text-gray-900',
      card: 'bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl',
      accent: 'text-blue-600',
      gradient: 'from-gray-100 to-white'
    },
    vibrant: {
      bg: 'bg-purple-900',
      text: 'text-white',
      card: 'bg-purple-900/40 backdrop-blur-xl border border-white/10 shadow-purple-900/50',
      accent: 'text-pink-400',
      gradient: 'from-indigo-900 via-purple-900 to-pink-900'
    }
  };

  const currentTheme = themes[theme];
  
  const useTwoColumns = tracklist.length > 6; 
  const isMediumList = tracklist.length > 4 && !useTwoColumns; 
  const useTinyText = tracklist.length > 14;

  return (
    <div className={`fixed inset-0 z-[100] overflow-y-auto font-sans ${currentTheme.bg} transition-colors duration-500 animate-fade-in`}>
      <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-screen">
        
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-black'}`}>
              <Disc size={24} />
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              Cover<span className={theme === 'light' ? 'text-blue-600' : 'text-emerald-400'}>Master</span>
            </h1>
          </div>
          <div className="flex gap-4 items-center">
             <div className="flex gap-2">
                 {['dark', 'light', 'vibrant'].map((t) => (
                   <button 
                    key={t}
                    onClick={() => setTheme(t as any)}
                    className={`w-6 h-6 rounded-full border-2 ${theme === t ? 'border-emerald-400 scale-110' : 'border-transparent opacity-50'} transition-all`}
                    style={{ backgroundColor: t === 'dark' ? '#18181b' : t === 'light' ? '#f3f4f6' : '#581c87' }}
                   />
                 ))}
             </div>
             <button 
                onClick={onClose} 
                className={`p-2 rounded-full hover:bg-white/10 ${theme === 'light' ? 'text-gray-900 hover:bg-gray-200' : 'text-white'}`}
             >
                <X size={24} />
             </button>
          </div>
        </header>

        <div className="grid md:grid-cols-2 gap-8 pb-10">
          
          {/* Formulario */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6 px-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 
                    ${step >= s 
                      ? (theme === 'light' ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-black') 
                      : 'bg-gray-700 text-gray-400'}`}>
                    {s}
                  </div>
                  <span className={`text-[10px] mt-1 uppercase font-semibold ${theme === 'light' ? 'text-gray-500' : 'text-gray-400 opacity-60'}`}>
                    {s === 1 ? 'Foto' : s === 2 ? 'Datos' : s === 3 ? 'Tracks' : 'Fin'}
                  </span>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-2xl shadow-2xl transition-all duration-300 ${theme === 'light' ? 'bg-white' : 'bg-zinc-800'}`}>
              {step === 1 && (
                <div className="text-center py-8 animate-fadeIn">
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Sube la portada del álbum</h2>
                  <div className="relative group cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                    <div className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center transition-all ${albumCover ? 'border-emerald-500' : 'border-gray-500 group-hover:border-emerald-400'} ${theme === 'light' ? 'bg-gray-50' : 'bg-zinc-900'}`}>
                      {albumCover ? (
                        <img src={albumCover} alt="Preview" className="h-full w-full object-contain rounded-lg p-2" />
                      ) : (
                        <>
                          <Camera size={48} className="text-gray-400 mb-2" />
                          <p className="text-gray-400">Haz clic o arrastra tu imagen aquí</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 py-4 animate-fadeIn">
                  <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Detalles del Lanzamiento</h2>
                  <div>
                    <label className={`text-sm font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400 opacity-70'}`}>Nombre del Artista</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 opacity-50"><User size={18} /></div>
                      <input type="text" value={artistName} readOnly className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none border transition-all cursor-not-allowed opacity-80 font-bold ${theme === 'light' ? 'bg-gray-200 border-gray-300 text-gray-600' : 'bg-zinc-950 border-zinc-800 text-gray-400'}`}/>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400 opacity-70'}`}>Nombre del Álbum</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 opacity-50"><Disc size={18} /></div>
                      <input type="text" value={albumTitle} onChange={(e) => setAlbumTitle(e.target.value)} placeholder="Ej. Un Verano Sin Ti..." className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none border transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900' : 'bg-zinc-900 border-zinc-700 focus:border-emerald-500 text-white'}`}/>
                    </div>
                  </div>
                  <div>
                    <label className={`text-sm font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400 opacity-70'}`}>¿Cuántas canciones tiene?</label>
                    <div className="relative">
                      <div className="absolute left-3 top-3 opacity-50"><List size={18} /></div>
                      <input type="number" min="1" max="30" value={numSongs} onChange={handleNumSongsChange} className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none border transition-all ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900' : 'bg-zinc-900 border-zinc-700 focus:border-emerald-500 text-white'}`}/>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="py-2 animate-fadeIn">
                  <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>Tracklist <span className="text-sm font-normal opacity-50">({numSongs} canciones)</span></h2>
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                    {tracklist.map((track, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-6 text-right opacity-50 font-mono text-sm text-gray-500">{idx + 1}.</span>
                        <input type="text" value={track} onChange={(e) => handleTrackNameChange(idx, e.target.value)} placeholder={`Canción ${idx + 1}`} className={`flex-1 px-3 py-2 rounded-md outline-none border text-sm ${theme === 'light' ? 'bg-gray-50 border-gray-200 focus:border-blue-500 text-gray-900' : 'bg-zinc-900 border-zinc-700 focus:border-emerald-500 text-white'}`}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="text-center py-8 animate-fadeIn">
                  <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${theme === 'light' ? 'bg-green-100 text-green-600' : 'bg-emerald-900/30 text-emerald-400'}`}>
                    <Check size={40} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>¡Listo para publicar!</h2>
                  <button onClick={handleDownload} disabled={isDownloading} className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all ${theme === 'light' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-emerald-500 text-black hover:bg-emerald-400'} ${isDownloading ? 'opacity-70 cursor-wait' : ''}`}>
                    {isDownloading ? <><Loader2 size={24} className="animate-spin" /> Optimizando...</> : <><Download size={20} /> Descargar Imagen</>}
                  </button>
                  <p className="text-xs mt-3 opacity-50">Calidad Mejorada (High Res)</p>
                </div>
              )}

              <div className="flex justify-between mt-8 pt-4 border-t border-gray-700/20">
                {step > 1 ? (
                  <button onClick={prevStep} className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 hover:opacity-80 transition-opacity ${theme === 'light' ? 'text-gray-600 bg-gray-200' : 'text-gray-300 bg-zinc-700'}`}>
                    <ChevronLeft size={18} /> Atrás
                  </button>
                ) : <div></div>}
                
                {step < 4 ? (
                  <button onClick={nextStep} disabled={step === 1 && !albumCover} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${step === 1 && !albumCover ? 'opacity-50 cursor-not-allowed bg-gray-500 text-white' : (theme === 'light' ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30' : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20')}`}>
                    Siguiente <ChevronRight size={18} />
                  </button>
                ) : (
                  <button onClick={() => setStep(1)} className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    Nuevo <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* VISTA PREVIA (Lado Derecho) */}
          <div className="flex flex-col items-center justify-start sticky top-8">
            <h3 className={`uppercase text-xs font-bold tracking-widest opacity-50 mb-4 ${theme === 'light' ? 'text-gray-600' : 'text-white'}`}>Vista Previa</h3>
            
            <div 
              ref={previewRef}
              className={`relative w-full max-w-[320px] aspect-[4/5] overflow-hidden rounded-xl shadow-2xl flex flex-col font-sans select-none`}
            >
              {/* Fondo */}
              {albumCover ? (
                <div className="absolute inset-0 z-0">
                  <img src={albumCover} alt="bg" className="w-full h-full object-cover blur-2xl opacity-60" />
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient}`}></div>
              )}

              <div className="absolute inset-0 bg-black/60 z-0"></div>

              <div className="relative z-10 flex flex-col h-full p-4 text-white">
                
                {/* Header */}
                <div className="flex items-center gap-3 mb-2 shrink-0 p-3 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md shadow-lg">
                  <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden shadow-md border border-white/20 relative">
                    {albumCover ? (
                      <img src={albumCover} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/10"><span className="text-[8px] opacity-50">Portada</span></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className={`font-bold leading-relaxed pb-2 -mb-1 ${currentTheme.accent} drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-lg truncate`}>
                      {artistName}
                    </h1>
                    <h2 className="text-sm font-medium text-white opacity-90 truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] leading-relaxed pb-1">
                      {albumTitle || 'Título del Álbum'}
                    </h2>
                  </div>
                </div>

                {/* Tracklist */}
                <div className="flex-1 rounded-xl p-4 bg-black/50 border border-white/10 backdrop-blur-md shadow-inner flex flex-col relative overflow-hidden">
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar-hide">
                      <div className={`
                        ${useTwoColumns ? 'grid grid-cols-2 gap-x-4 gap-y-1' : 'flex flex-col gap-1'}
                      `}>
                        {tracklist.map((track, i) => (
                           <div key={i} className={`flex items-center gap-2 
                             ${useTwoColumns ? 'py-0.5' : isMediumList ? 'py-1' : 'py-2'}
                           `}>
                             <span className={`font-mono font-bold text-white/50 shrink-0 text-right drop-shadow-md ${useTwoColumns ? 'text-[8px] w-3' : 'text-[10px] w-4'}`}>
                               {(i + 1).toString().padStart(2, '0')}
                             </span>
                             <span className={`font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] truncate leading-relaxed pb-1 flex-1 ${
                               useTinyText ? 'text-[9px]' : 
                               useTwoColumns ? 'text-[10px]' : 
                               isMediumList ? 'text-[10px]' : 'text-xs' 
                             }`}>
                               {track || <span className="opacity-30 italic font-normal">...</span>}
                             </span>
                           </div>
                        ))}
                      </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-3 shrink-0">
                   <div className="flex flex-col items-center">
                      <span className="text-[8px] uppercase tracking-widest opacity-70 mb-1.5 drop-shadow-md font-semibold">Disponible en todas las plataformas</span>
                      <div className="flex flex-wrap justify-center gap-2 mb-2">
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.Spotify /></div>
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.AppleMusic /></div>
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.Youtube /></div>
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.TikTok /></div>
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.Instagram /></div>
                         <div className="bg-black/40 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors"><BrandIcons.Facebook /></div>
                      </div>
                      <span className="text-[8px] font-medium opacity-60 tracking-wide drop-shadow-[0_0_3px_rgba(255,255,255,0.2)]">
                        musica.diosmasgym.com
                      </span>
                   </div>
                </div>

              </div>
            </div>
            <p className="mt-4 text-xs opacity-40 text-center max-w-[200px]">
              Diseño limpio y sin cortes.
            </p>
          </div>

        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CoverMaster;
