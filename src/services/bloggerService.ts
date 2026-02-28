import type { BlogPost } from '../types';

const MOCK_POSTS: BlogPost[] = [
    {
        id: "mock-1",
        title: "La Disciplina vence al Talento: Fe en el Gimnasio",
        url: "https://diosmasgym.blogspot.com/",
        published: "2024-01-01T00:00:00.000Z",
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
        summary: "Una reflexión sobre cómo la constancia en el entrenamiento refleja nuestra constancia espiritual..."
    },
    {
        id: "mock-2",
        title: "Levantarse después de la caída",
        url: "https://diosmasgym.blogspot.com/",
        published: "2024-01-02T00:00:00.000Z",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
        summary: "No importa cuántas veces falles en la serie, lo que importa es volver a intentar la repetición..."
    }
];

export const getBlogReflections = async (): Promise<BlogPost[]> => {
    return MOCK_POSTS;
};
