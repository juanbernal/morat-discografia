import React, { useState, useEffect, useRef } from 'react';
import type { Track } from '../types';

interface AudioPlayerProps {
    track: Track | null;
    onClose: () => void;
}

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z"></path></svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
);


const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, onClose }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (track && audioRef.current) {
            audioRef.current.src = track.preview_url!;
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch(e => console.error("Audio playback failed:", e));
        } else {
            setIsPlaying(false);
            setProgress(0);
        }
    }, [track]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };
        const handleEnded = () => {
            setIsPlaying(false);
            onClose(); 
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onClose]);

    const togglePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    if (!track) {
        return null;
    }

    const imageUrl = track.album.images?.[2]?.url || track.album.images?.[0]?.url;

    return (
        <div className={`fixed bottom-0 left-0 right-0 h-20 bg-[#181818] border-t border-gray-800 text-white z-20 transform transition-transform duration-300 ease-out ${track ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="h-full max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center gap-4">
                {imageUrl && (
                    <img src={imageUrl} alt={track.album.name} className="w-12 h-12 rounded" />
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{track.name}</p>
                    <p className="text-gray-400 text-sm truncate">{track.artists.map(a => a.name).join(', ')}</p>
                </div>

                <button onClick={togglePlayPause} className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white text-black rounded-full transition-transform hover:scale-105" aria-label={isPlaying ? 'Pausar' : 'Reproducir'}>
                    {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                </button>
                
                <button onClick={onClose} className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-gray-400 transition-colors hover:text-white" aria-label="Cerrar reproductor">
                    <CloseIcon className="w-6 h-6" />
                </button>

            </div>
             <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-amber-400" style={{ width: `${progress}%` }}></div>
            </div>
            <audio ref={audioRef} />
        </div>
    );
};

export default AudioPlayer;
