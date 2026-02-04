
import type { BlogPost } from '../types';

/**
 * Datos de ejemplo mejorados para asegurar visibilidad inmediata.
 */
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
    },
    {
        id: "mock-3",
        title: "El Templo del Espíritu Santo",
        url: "https://diosmasgym.blogspot.com/",
        published: new Date(Date.now() - 172800000).toISOString(),
        thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
        summary: "Cuidar nuestro cuerpo es una forma de honrar la creación de Dios..."
    }
];

export const getBlogReflections = async (): Promise<BlogPost[]> => {
    try {
        // Usamos ruta relativa para que funcione en cualquier entorno (Vite, GitHub Pages, etc.)
        const response = await fetch('blog.json');
        
        if (response.ok) {
            const data = await response.json();
            // Verificamos que sea un array válido
            if (Array.isArray(data) && data.length > 0) {
                console.log("Reflexiones reales cargadas con éxito.");
                return data;
            }
        }
        
        console.info("blog.json no encontrado o vacío. Cargando reflexiones de ejemplo.");
        return MOCK_POSTS;
        
    } catch (error) {
        // Si hay un error de red o de parseo, devolvemos los mocks en lugar de fallar
        console.warn("Error al intentar leer blog.json, usando mocks:", error);
        return MOCK_POSTS;
    }
};
