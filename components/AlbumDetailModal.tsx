
import React, { useState, useEffect, useRef } from 'react';
import type { Album, Track, SimplifiedTrack } from '../types';
import { getAlbumTracks } from '../services/spotifyService';
import TrackItem from './TrackItem';
import Spinner from './Spinner';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import ShareButtons from './ShareButtons';

interface AlbumDetailModalProps {
    album: Album | null;
    onClose: () => void;
    onTrackSelect: (track: Track) => void;
    playingTrackId: string | null | undefined;
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>
);

const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({ album, onClose, onTrackSelect, playingTrackId }) => {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const modalRef = useRef<HTMLDivElement>(null);
    const releaseYear = album ? new Date(album.release_date).getFullYear() : '';

    useEffect(() => {
        if (album) {
            document.body.style.overflow = 'hidden';
            setLoading(true);
            setTracks([]);
            getAlbumTracks(album.id)
                .then(simplifiedTracks => {
                    const fullTracks: Track[] = simplifiedTracks.map(st => ({
                        ...st,
                        album: album, // Augment simplified track with full album info
                        source: 'spotify',
                    }));
                    setTracks(fullTracks);
                })
                .catch(err => {
                    console.error("Failed to load album tracks:", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
             document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [album]);

     useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (album) {
            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [album, onClose]);

    if (!album) {
        return null;
    }
    
    // Logic: Use specific YouTube URL if available (and not just channel), otherwise search for Album + Artist
    const isGenericChannelLink = album.external_urls.youtube && album.external_urls.youtube.includes('/channel/');
    const youtubeUrl = (album.external_urls.youtube && !isGenericChannelLink)
        ? album.external_urls.youtube 
        : `https://music.youtube.com/search?q=${encodeURIComponent(album.name + " " + album.artists[0].name)}`;

    const spotifyUrl = album.external_urls.spotify || '';
    const targetUrl = spotifyUrl || youtubeUrl;

    return (
        <div className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center p-4 animate-fade-in" role="dialog" aria-modal="true">
            <div ref={modalRef} className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col md:flex-row overflow-hidden border border-slate-700">
                <div className="w-full md:w-1/3 flex-shrink-0 aspect-square md:aspect-auto group relative">
                     {/* Make the image clickable */}
                     <a 
                        href={targetUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full h-full cursor-pointer"
                        title="Abrir en plataforma de música"
                     >
                        <img src={album.images?.[0]?.url} alt={album.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold border border-white px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-transform">
                                {spotifyUrl ? <SpotifyIcon className="w-5 h-5" /> : <YoutubeMusicIcon className="w-5 h-5" />}
                                Escuchar
                            </span>
                        </div>
                     </a>
                </div>

                <div className="w-full md:w-2/3 flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm uppercase text-gray-400 tracking-wider">{album.album_type} &bull; {releaseYear}</p>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white my-2">{album.name}</h2>
                            <p className="text-gray-300 text-lg">{album.artists.map(a => a.name).join(', ')}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors flex-shrink-0" aria-label="Cerrar modal">
                            <CloseIcon className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 my-4">
                        <div className="flex items-center flex-wrap gap-2">
                             {spotifyUrl && (
                                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#1DB954] text-white text-sm font-semibold px-4 py-2 rounded-full transition-transform hover:scale-105">
                                    <SpotifyIcon className="w-5 h-5" /> Spotify
                                </a>
                            )}
                            
                            <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#FF0000] text-white text-sm font-semibold px-4 py-2 rounded-full transition-transform hover:scale-105">
                                <YoutubeMusicIcon className="w-5 h-5" /> YouTube
                            </a>
                            
                        </div>
                         {spotifyUrl && (
                            <ShareButtons url={spotifyUrl} title={`${album.name} por ${album.artists.map(a => a.name).join(', ')}`} />
                        )}
                    </div>
                    
                    <div className="border-t border-slate-700 my-2"></div>
                    
                    {loading ? (
                        <div className="flex items-center justify-center py-10">
                            <Spinner />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {tracks.map((track, index) => (
                                <TrackItem
                                    key={track.id}
                                    track={track}
                                    index={index}
                                    onSelect={() => onTrackSelect(track)}
                                    isPlaying={playingTrackId === track.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlbumDetailModal;
