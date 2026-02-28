import React, { useState, useEffect } from 'react';

const ChevronUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={3} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const ScrollToTopButton: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <button
            type="button"
            onClick={scrollToTop}
            className={`
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                fixed bottom-8 right-8
                bg-slate-800 text-blue-500
                w-12 h-12 rounded-full
                flex items-center justify-center
                shadow-lg shadow-black/40
                transition-all duration-300 ease-in-out
                hover:bg-slate-700 hover:text-blue-400 hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500
            `}
            aria-label="Volver arriba"
        >
            <ChevronUpIcon className="w-6 h-6" />
        </button>
    );
};

export default ScrollToTopButton;