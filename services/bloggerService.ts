
import type { BlogPost } from '../types';

const MOCK_POSTS: BlogPost[] = [
    {
        id: "mock-1",
        title: "La Disciplina vence al Talento: Fe en el Gimnasio",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date().toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        summary: "Una reflexión sobre cómo la constancia en el entrenamiento refleja nuestra constancia espiritual..."
    },
    {
        id: "mock-2",
        title: "Levantarse después de la caída",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date(Date.now() - 86400000).toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        summary: "No importa cuántas veces falles en la serie, lo que importa es volver a intentar la repetición..."
    }
];

export const getBlogReflections = async (): Promise<BlogPost[]> => {
    try {
        // Añadir timestamp para evitar caché agresiva del navegador
        const response = await fetch(`blog.json?t=${Date.now()}`);
        
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
        
        console.warn("blog.json no encontrado o inválido. Usando contenido de respaldo.");
        return MOCK_POSTS;
        
    } catch (error) {
        console.error("Error cargando reflexiones:", error);
        return MOCK_POSTS;
    }
};
