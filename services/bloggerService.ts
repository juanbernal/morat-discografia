
import type { BlogPost } from '../types';

/**
 * Datos de ejemplo para que el usuario pueda ver el diseño 
 * antes de configurar el archivo blog.json real.
 */
const MOCK_POSTS: BlogPost[] = [
    {
        id: "1",
        title: "La Disciplina vence al Talento: Fe en el Gimnasio",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date().toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        summary: "Una reflexión sobre cómo la constancia en el entrenamiento refleja nuestra constancia espiritual..."
    },
    {
        id: "2",
        title: "Levantarse después de la caída",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date(Date.now() - 86400000).toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        summary: "No importa cuántas veces falles en la serie, lo que importa es volver a intentar la repetición..."
    },
    {
        id: "3",
        title: "El Templo del Espíritu Santo",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date(Date.now() - 172800000).toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
        summary: "Cuidar nuestro cuerpo es una forma de honrar la creación de Dios..."
    }
];

export const getBlogReflections = async (): Promise<BlogPost[]> => {
    try {
        const response = await fetch('/blog.json');
        
        // Si el archivo real existe, lo usamos
        if (response.ok) {
            const data = await response.json();
            return data as BlogPost[];
        }
        
        // Si no existe (estamos en desarrollo o falta configurar GitHub), 
        // devolvemos los ejemplos para que el usuario vea el diseño.
        console.info("Mostrando reflexiones de ejemplo (blog.json no encontrado)");
        return MOCK_POSTS;
        
    } catch (error) {
        console.error("Error cargando reflexiones de Blogger, usando ejemplos:", error);
        return MOCK_POSTS;
    }
};
