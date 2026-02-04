
import type { BlogPost } from '../types';

const MOCK_POSTS: BlogPost[] = [
    {
        id: "1",
        title: "La Disciplina vence al Talento: Fe en el Gimnasio",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date().toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        summary: "Una reflexión sobre cómo la constancia en el entrenamiento refleja nuestra constancia espiritual..."
    }
];

export const getBlogReflections = async (): Promise<BlogPost[]> => {
    try {
        // Añadimos ?t=timestamp para forzar la descarga de la versión más reciente
        const response = await fetch(`/blog.json?t=${Date.now()}`);
        
        if (response.ok) {
            const data = await response.json();
            return data as BlogPost[];
        }
        
        return MOCK_POSTS;
        
    } catch (error) {
        console.warn("Usando reflexiones de ejemplo:", error);
        return MOCK_POSTS;
    }
};
