
import React, { useState, useRef } from 'react';

const VERSES = [
    "Todo lo puedo en Cristo que me fortalece. - Filipenses 4:13",
    "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes. - Josué 1:9",
    "Jehová es mi fortaleza y mi escudo; en él confió mi corazón. - Salmos 28:7",
    "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas. - Isaías 40:31",
    "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio. - 2 Timoteo 1:7",
    "El da esfuerzo al cansado, y multiplica las fuerzas al que no tiene ningunas. - Isaías 40:29"
];

interface BiblicalEasterEggProps {
    children: React.ReactNode;
}

const BiblicalEasterEgg: React.FC<BiblicalEasterEggProps> = ({ children }) => {
    const [showVerse, setShowVerse] = useState(false);
    const [verse, setVerse] = useState('');
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        // Pick a random verse
        const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
        setVerse(randomVerse);
        
        // Slight delay to prevent flickering on accidental hovers
        timeoutRef.current = window.setTimeout(() => {
            setShowVerse(true);
        }, 300);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowVerse(false);
    };

    const handleClick = () => {
        // Allow toggle on click for mobile devices
        if (window.matchMedia('(hover: none)').matches) {
             if (showVerse) {
                 setShowVerse(false);
             } else {
                 const randomVerse = VERSES[Math.floor(Math.random() * VERSES.length)];
                 setVerse(randomVerse);
                 setShowVerse(true);
             }
        }
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children}
            
            <div 
                className={`
                    absolute z-50 w-64 p-4 bg-slate-900/95 border border-blue-500/50 rounded-xl shadow-2xl text-center backdrop-blur-md
                    left-1/2 transform -translate-x-1/2 top-full mt-4
                    transition-all duration-500 ease-in-out
                    ${showVerse ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'}
                `}
            >
                <div className="text-blue-400 text-lg mb-1">✝️</div>
                <p className="text-white text-sm font-medium italic leading-snug">"{verse}"</p>
                {/* Arrow pointing up */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-900 border-t border-l border-blue-500/50 rotate-45"></div>
            </div>
        </div>
    );
};

export default BiblicalEasterEgg;
