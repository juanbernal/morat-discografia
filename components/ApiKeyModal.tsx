import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    onSave: (key: string) => void;
    onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSave, onClose }) => {
    const [key, setKey] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleSave = () => {
        if (key.trim()) {
            onSave(key.trim());
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in"
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-[#282828] rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-4">Se necesita una clave de API de YouTube</h2>
                <p className="text-gray-400 mb-4 text-sm">
                    Para mostrar el contenido de YouTube (álbumes y canciones populares), esta aplicación necesita una clave de API de YouTube Data v3. Tu clave se guardará de forma segura solo en tu navegador.
                </p>
                <p className="text-gray-400 mb-6 text-sm">
                    Puedes obtener una clave gratuita desde la{' '}
                    <a 
                        href="https://console.cloud.google.com/apis/credentials" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-amber-400 hover:underline"
                    >
                        Consola de Google Cloud
                    </a>.
                </p>

                <div className="mb-6">
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
                        Tu Clave de API de YouTube
                    </label>
                    <input
                        id="apiKey"
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="Pega tu clave de API aquí"
                        className="w-full bg-[#191414] border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 rounded-md text-sm font-semibold text-gray-300 bg-transparent hover:bg-white/10 transition-colors"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="px-6 py-2 rounded-md text-sm font-semibold bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50"
                        disabled={!key.trim()}
                    >
                        Guardar Clave
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;
