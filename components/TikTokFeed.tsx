import React from 'react';
import TiktokIcon from './TiktokIcon';

const TikTokFeed: React.FC = () => {
    return (
        <section className="animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6 px-2 flex items-center gap-3">
                <TiktokIcon className="w-8 h-8"/>
                <span>Último en TikTok</span>
            </h2>
            {/* Elfsight TikTok Feed Widget */}
            <div className="elfsight-app-bdd5ce9a-cbc7-4507-b85b-a4fff0c98b5d" data-elfsight-app-lazy></div>
        </section>
    );
};

export default TikTokFeed;