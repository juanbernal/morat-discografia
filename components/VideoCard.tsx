import React from 'react';
import type { Video } from '../types';
import YoutubeMusicIcon from './YoutubeMusicIcon';

interface VideoCardProps {
    video: Video;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
    return (
        <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/30 hover:scale-105 border-2 border-transparent hover:border-red-500"
            aria-label={`Ver video ${video.title}`}
        >
            <img 
                src={video.thumbnailUrl} 
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <YoutubeMusicIcon className="w-16 h-16 text-white/90 drop-shadow-lg" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                 <h3 className="font-bold text-sm md:text-base leading-tight drop-shadow-md transition-transform duration-300 group-hover:-translate-y-1">{video.title}</h3>
            </div>
        </a>
    );
};

export default VideoCard;
