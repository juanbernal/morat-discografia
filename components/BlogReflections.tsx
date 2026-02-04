
import React, { useMemo, useState } from 'react';
import type { BlogPost } from '../types';

interface BlogReflectionsProps {
    posts: BlogPost[];
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';

const ReflectionCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    // Validar la URL de la miniatura antes de usarla
    const initialSrc = (post.thumbnail && 
                        post.thumbnail !== "undefined" && 
                        post.thumbnail.trim() !== "" && 
                        post.thumbnail.startsWith('http')) 
                        ? post.thumbnail 
                        : DEFAULT_THUMBNAIL;

    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleImageError = () => {
        if (imgSrc !== DEFAULT_THUMBNAIL) {
            setImgSrc(DEFAULT_THUMBNAIL);
        }
    };

    return (
        <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex-shrink-0 w-64 md:w-85 aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl snap-center transition-all duration-500 hover:scale-[1.03] hover:border-blue-500/50 bg-slate-900"
        >
            {/* Skeleton/Loader background */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            <img
                src={imgSrc}
                alt={post.title}
                onError={handleImageError}
                onLoad={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <span className="text-[8px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2 bg-blue-500/10 w-fit px-2 py-1 rounded-full border border-blue-500/20">
                    {new Date(post.published).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </span>
                <h3 className="text-lg md:text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-2xl mb-1">
                    {post.title}
                </h3>
                <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-white/40 group-hover:text-blue-400 transition-colors uppercase tracking-widest">
                    LEER REFLEXIÓN 
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                </div>
            </div>

            <div className="absolute -inset-20 bg-blue-500/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        </a>
    );
};

const BlogReflections: React.FC<BlogReflectionsProps> = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    const randomPosts = useMemo(() => {
        return [...posts]
            .sort(() => Math.random() - 0.5)
            .slice(0, 8);
    }, [posts]);

    return (
        <section className="mb-24 animate-fade-in px-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Reflexiones
                        </h2>
                        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-1">
                            Fe + Disciplina en palabras
                        </p>
                    </div>
                </div>
                <a 
                    href="https://www.diosmasgym.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-blue-500 transition-colors border-b border-white/10 pb-1"
                >
                    Ir al Blog Oficial
                </a>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory px-2">
                {randomPosts.map((post) => (
                    <ReflectionCard key={post.id} post={post} />
                ))}
            </div>
        </section>
    );
};

export default BlogReflections;
