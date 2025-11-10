import React from 'react';

const AmazonMusicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        {...props}
    >
        <title>Amazon Music icon</title>
        <path d="M12.981 3.065A1.21 1.21 0 0 0 12 2.5a1.21 1.21 0 0 0-.981.565C5.61 12.585 3.33 16.335 3 17.595c-.06.21.39.375.495.195 1.185-2.07 4.155-6.39 8.505-6.39s7.32 4.32 8.505 6.39c.105.18.555.015.495-.195-.33-1.26-2.61-4.995-8.019-11.53zM12 13.065c-2.325 0-4.395 1.5-5.595 3.39-.18.285.33.645.54.345 1.485-2.115 4.14-3.24 5.055-3.24.915 0 3.57 1.125 5.055 3.24.21.3.72-.06.54-.345-1.2-1.89-3.27-3.39-5.595-3.39z"/>
    </svg>
);

export default AmazonMusicIcon;