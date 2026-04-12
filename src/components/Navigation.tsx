import React from 'react';
import { motion } from 'framer-motion';
import { Search, Globe, Bell } from 'lucide-react';
import BiblicalEasterEgg from './BiblicalEasterEgg';

interface NavigationProps {
    scrolled: boolean;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    language: string;
    onLanguageToggle: () => void;
    notificationsActive: boolean;
    onNotificationsToggle: () => void;
    onBioClick: () => void;
    t: (key: string) => string;
}

const Navigation: React.FC<NavigationProps> = ({
    scrolled,
    searchQuery,
    onSearchChange,
    language,
    onLanguageToggle,
    notificationsActive,
    onNotificationsToggle,
    onBioClick,
    t
}) => {
    return (
        <nav className={`fixed top-6 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-8 ${scrolled ? 'scale-95' : 'scale-100'}`}>
            <div className={`max-w-7xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between gap-4 shadow-2xl transition-all ${scrolled ? 'border-blue-500/30 shadow-blue-500/10' : ''}`}>
                <div className="flex items-center gap-4">
                    <BiblicalEasterEgg>
                        <motion.img
                            src="/diosmasgym_profile.jpg"
                            alt="Logo"
                            onClick={onBioClick}
                            whileHover={{ rotate: 12, scale: 1.1 }}
                            className="w-10 h-10 rounded-full border border-white/20 cursor-pointer shadow-lg shadow-blue-500/20"
                        />
                    </BiblicalEasterEgg>
                    <div className="hidden sm:block">
                        <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500">
                            Diosmasgym
                        </h1>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Records</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder={t('nav.search')}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2.5 px-4 pl-10 text-[10px] sm:text-xs font-bold text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500 w-32 sm:w-48 md:w-64 transition-all"
                        />
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/10 pl-4 md:pl-6">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onLanguageToggle}
                            className="p-2.5 rounded-full border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <Globe size={14} className="text-blue-500" />
                            {language === 'es' ? 'ES' : 'EN'}
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onNotificationsToggle}
                            className={`p-2.5 rounded-full border transition-all ${notificationsActive ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                        >
                            <Bell size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
