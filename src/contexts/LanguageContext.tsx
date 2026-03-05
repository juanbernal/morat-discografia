import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'es' | 'en';

type Translations = {
    [key in Language]: {
        [key: string]: string;
    };
};

export const translations: Translations = {
    es: {
        'nav.search': 'Buscar...',
        'nav.notifications.on': '¡Notificaciones Activadas!',
        'nav.notifications.off': 'Notificaciones Desactivadas',
        'nav.createQuote': 'Crear Frase',
        'header.discography': 'Official Artist Discography',
        'search.found': 'Canciones Encontradas',
        'releases.upcoming': 'Próximos Estrenos',
        'releases.new': 'Nuevos Lanzamientos',
        'catalog.title': 'Catálogo Oficial',
        'catalog.filter.all': 'Todo',
        'catalog.filter.albums': 'Álbumes',
        'catalog.filter.singles': 'Singles',
        'catalog.loadMore': 'Cargar más lanzamientos',
        'topHits.title': 'Top Hits',
        'timeline.title': 'Diosmasgym Records History',
        'footer.epk': 'Press Kit / EPK',
        'roster.back': 'Volver al inicio',
        'roster.latestReleases': 'Últimos Lanzamientos',
        'roster.viewProfile': 'Ver Perfil',
        'roster.diosma.bio': 'Diosmasgym Records es un sello discográfico independiente enfocado en sonidos dinámicos urbanos y electrónicos. Fundado con la visión de romper fronteras, Diosmasgym actúa tanto como un alias artístico y como la marca principal del sello.',
        'roster.juan.bio': 'Juan 614 es una pieza fundamental del roster de Diosmasgym Records, conocido por su estilo lírico único y flows enérgicos que hacen de puente entre el urbano latino y estilos electrónicos globales.',
        'album.tracks': 'Canciones',
        'album.lyrics': 'Letras / Info',
    },
    en: {
        'nav.search': 'Search...',
        'nav.notifications.on': 'Notifications Enabled!',
        'nav.notifications.off': 'Notifications Disabled',
        'nav.createQuote': 'Create Quote',
        'header.discography': 'Official Artist Discography',
        'search.found': 'Tracks Found',
        'releases.upcoming': 'Upcoming Releases',
        'releases.new': 'New Releases',
        'catalog.title': 'Official Catalog',
        'catalog.filter.all': 'All',
        'catalog.filter.albums': 'Albums',
        'catalog.filter.singles': 'Singles',
        'catalog.loadMore': 'Load more releases',
        'topHits.title': 'Top Hits',
        'timeline.title': 'Diosmasgym Records History',
        'footer.epk': 'Press Kit / EPK',
        'roster.back': 'Back to Home',
        'roster.latestReleases': 'Latest Releases',
        'roster.viewProfile': 'View Profile',
        'roster.diosma.bio': 'Diosmasgym Records is an independent record label focusing on dynamic electronic and urban sounds. Founded with a vision to break boundaries, Diosmasgym acts as both an artist alias and the main label imprint.',
        'roster.juan.bio': 'Juan 614 is a core part of the Diosmasgym Records roster, known for his unique lyrical style and energetic flows bridging latin urban and global electronic styles.',
        'album.tracks': 'Tracks',
        'album.lyrics': 'Lyrics / Info',
    }
};

interface LanguageContextType {
    language: Language;
    toggleLanguage: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('es');

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'es' ? 'en' : 'es');
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
