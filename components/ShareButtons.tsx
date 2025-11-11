import React, { useState } from 'react';

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Twitter</title>
        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>Facebook</title>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
);

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
     <svg role="img" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <title>WhatsApp</title>
        <path d="M12.04 2.02c-5.523 0-10 4.477-10 10.003 0 1.75.44 3.49 1.28 5.03l-1.36 4.95 5.07-1.34c1.5-.83 3.19-1.26 4.95-1.26 5.523 0 10-4.477 10-10.003s-4.477-10-10-10.003zm0 18.21c-1.48 0-2.94-.4-4.24-1.15l-.3-.18-3.15.82.84-3.07-.2-.32c-.83-1.35-1.27-2.88-1.27-4.45 0-4.54 3.68-8.22 8.22-8.22 4.54 0 8.22 3.68 8.22 8.22s-3.68 8.22-8.22 8.22zm4.52-6.2c-.25-.12-1.47-.72-1.7-.8-.22-.08-.38-.12-.54.12-.16.25-.64.8-.78.96-.14.17-.28.18-.53.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72s-.02-.38.1-.5c.12-.12.26-.3.38-.45.13-.15.17-.25.25-.4.08-.17.04-.3-.02-.42-.06-.12-.54-1.3-.73-1.78-.2-.48-.4-.4-.54-.4h-.5c-.17 0-.42.06-.63.3-.22.24-.84.82-.84 2 0 1.18.86 2.32 1 2.48.12.17 1.67 2.55 4.05 3.58.57.25 1.02.4 1.36.5.4.14.78.12 1.07.08.33-.05 1.05-.43 1.2-0.83.15-.4.15-.75.1-.83-.04-.08-.16-.12-.4-.24z"/>
    </svg>
);

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
        <title>Telegram</title>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.17.91-.494 1.202-.82 1.23-.696.06-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.04-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.24-1.86-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.662 3.488-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
);

const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
        <title>TikTok icon</title>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.05-4.84-.95-6.43-2.98-1.59-2.04-2.16-4.72-1.74-7.24.42-2.52 2.16-4.63 4.25-5.97.02-.01.03-.02.05-.04 1.48-1.04 3.39-1.34 5.22-1.08.16.02.33.04.5.05v4.52c-.88-.23-1.79-.32-2.69-.28-1.39.07-2.77.49-3.92 1.25-1.14.76-2.04 1.89-2.48 3.21-1.13 3.44 2.13 6.75 5.46 5.61 1.68-.57 2.84-2.09 3.11-3.8.03-.2.05-.4.05-.61v-8.41c-.01-.01.01-.01.01-.02z"/>
    </svg>
);

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);


interface ShareButtonsProps {
    url: string;
    title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
    const [isCopied, setIsCopied] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const handleCopyToClipboard = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const shareLinks = [
        { name: 'Twitter', icon: TwitterIcon, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:text-[#1DA1F2]' },
        { name: 'Facebook', icon: FacebookIcon, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:text-[#1877F2]' },
        { name: 'WhatsApp', icon: WhatsappIcon, href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:text-[#25D366]' },
        { name: 'Telegram', icon: TelegramIcon, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:text-[#0088cc]'},
    ];

    return (
        <div className="flex items-center gap-1">
            <span className="text-sm font-semibold text-gray-400 hidden sm:inline">Compartir:</span>
            {shareLinks.map(link => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 text-gray-500 transition-colors ${link.color}`}
                    aria-label={`Compartir en ${link.name}`}
                >
                    <link.icon className="w-5 h-5" />
                </a>
            ))}
             <button
                type="button"
                onClick={handleCopyToClipboard}
                className={`p-2 text-gray-500 transition-all duration-200 ${isCopied ? 'text-green-400' : 'hover:text-white'}`}
                aria-label="Copiar enlace para TikTok"
                title="Copiar enlace para TikTok"
            >
                {isCopied ? <CheckIcon className="w-5 h-5" /> : <TiktokIcon className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default ShareButtons;