import React from 'react';
import type { Artist, Album, Track } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import AlbumCard from './AlbumCard';
import TopTracks from './TopTracks';
import SpotifyIcon from './SpotifyIcon';
import YoutubeMusicIcon from './YoutubeMusicIcon';
import AppleMusicIcon from './AppleMusicIcon';
import TiktokIcon from './TiktokIcon';

interface ArtistProfileProps {
    artistId: string;
    albums: Album[];
    tracks: Track[];
    onBack: () => void;
    onAlbumSelect: (album: Album) => void;
}

const ARTIST_DATA: Record<string, any> = {
    '2mEoedcjDJ7x6SCVLMI4Do': {
        name: 'Diosmasgym',
        bioKey: 'roster.diosma.bio',
        image: '/diosmasgym_profile.jpg',
        social: {
            spotify: 'https://open.spotify.com/artist/2mEoedcjDJ7x6SCVLMI4Do',
            youtube: 'https://music.youtube.com/channel/UCaXTzIwNoZqhHw6WpHSdnow',
            tiktok: 'https://tiktok.com/@diosmasgym'
        },
        theme: 'blue'
    },
    '0vEKa5AOcBkQVXNfGb2FNh': {
        name: 'Juan 614',
        bioKey: 'roster.juan.bio',
        image: '/juan-hero.jpg',
        social: {
            spotify: 'https://open.spotify.com/artist/0vEKa5AOcBkQVXNfGb2FNh',
            apple: 'https://music.apple.com/us/artist/juan-614/1870721488',
            tiktok: 'https://www.tiktok.com/@juan614oficial'
        },
        theme: 'amber'
    }
};

const ArtistProfile: React.FC<ArtistProfileProps> = ({ artistId, albums, tracks, onBack, onAlbumSelect }) => {
    const { t } = useLanguage();
    const data = ARTIST_DATA[artistId];

    if (!data) return null;

    const artistAlbums = albums.filter(a => a.artists.some(ar => ar.id === artistId || ar.name.toLowerCase().includes(data.name.toLowerCase())));
    const artistTracks = tracks.filter(t => t.artists.some(ar => ar.id === artistId || ar.name.toLowerCase().includes(data.name.toLowerCase())));

    const themeColors = {
        blue: {
            text: 'text-blue-500',
            bg: 'bg-blue-600',
            hover: 'hover:bg-blue-500',
            border: 'border-blue-500/20',
            glow: 'shadow-[0_0_50px_rgba(59,130,246,0.15)]'
        },
        amber: {
            text: 'text-amber-500',
            bg: 'bg-amber-600',
            hover: 'hover:bg-amber-500',
            border: 'border-amber-500/30',
            glow: 'shadow-[0_0_50px_rgba(245,158,11,0.2)]'
        }
    };

    const theme = themeColors[data.theme as 'blue' | 'amber'];

    return (
        <div className="animate-fade-in pb-20">
            <button
                onClick={onBack}
                className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white backdrop-blur-md bg-white/5`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                {t('roster.back')}
            </button>

            <header className={`relative rounded-[3rem] p-8 md:p-16 mb-16 overflow-hidden border ${theme.border} ${theme.glow}`}>
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl z-0"></div>
                <div className={`absolute top-0 right-0 w-96 h-96 ${theme.bg} rounded-full blur-[150px] opacity-10 z-0`}></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center md:text-left">
                    <img
                        src={data.image}
                        alt={data.name}
                        className={`w-40 h-40 md:w-56 md:h-56 object-cover rounded-full border-4 border-white/10 shadow-2xl transition-transform hover:scale-105`}
                    />
                    <div className="flex-1">
                        <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4`}>
                            {data.name}
                        </h1>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl mb-8 font-medium">
                            {t(data.bioKey)}
                        </p>
                        <div className="flex bg-black/40 w-fit rounded-2xl p-2 mx-auto md:mx-0 border border-white/5 shadow-inner">
                            {data.social.spotify && <a href={data.social.spotify} target="_blank" rel="noreferrer" className="p-3 hover:bg-[#1DB954]/20 rounded-xl transition-colors"><SpotifyIcon className="w-6 h-6 text-[#1DB954]" /></a>}
                            {data.social.youtube && <a href={data.social.youtube} target="_blank" rel="noreferrer" className="p-3 hover:bg-[#FF0000]/20 rounded-xl transition-colors"><YoutubeMusicIcon className="w-6 h-6 text-[#FF0000]" /></a>}
                            {data.social.apple && <a href={data.social.apple} target="_blank" rel="noreferrer" className="p-3 hover:bg-[#FA243C]/20 rounded-xl transition-colors"><AppleMusicIcon className="w-6 h-6 text-[#FA243C]" /></a>}
                            {data.social.tiktok && <a href={data.social.tiktok} target="_blank" rel="noreferrer" className="p-3 hover:bg-white/20 rounded-xl transition-colors"><TiktokIcon className="w-6 h-6 text-white" /></a>}
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                    <h2 className={`text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-4`}>
                        <div className={`w-1.5 h-8 ${theme.bg} rounded-full`}></div>
                        {t('topHits.title')}
                    </h2>
                    <div className="bg-[#050b18] rounded-[2rem] p-6 border border-white/5 shadow-2xl backdrop-blur-xl">
                        <TopTracks tracks={artistTracks.slice(0, 5)} />
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <h2 className={`text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-4`}>
                        <div className={`w-1.5 h-8 ${theme.bg} rounded-full`}></div>
                        {t('roster.latestReleases')}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {artistAlbums.slice(0, 4).map(album => (
                            <AlbumCard key={album.id} album={album} onSelect={onAlbumSelect} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
