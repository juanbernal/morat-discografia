
import React from 'react';
import type { BlogPost } from '../types';

interface BlogReflectionsProps {
    posts: BlogPost[];
}

const BlogReflections: React.FC<BlogReflectionsProps> = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="mb-24 animate-fade-in px-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            Reflexiones <span className="text-amber-500">Blogger</span>
                        </h2>
                        <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-1">Fe + Disciplina en palabras</p>
                    </div>
                </div>
                <a 
                    href="https://diosmasgym.blogspot.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-amber-500 transition-colors border-b border-white/10 pb-1"
                >
                    Ir al Blog Oficial
                </a>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory px-2">
                {posts.map((post) => (
                    <a
                        key={post.id}
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex-shrink-0 w-64 md:w-80 aspect-[4/3] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl snap-center transition-all duration-500 hover:scale-[1.03] hover:border-amber-500/50"
                    >
                        {/* Thumbnail */}
                        <img
                            src={post.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800'}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.3em] mb-2">
                                {new Date(post.published).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                            </span>
                            <h3 className="text-lg md:text-xl font-black text-white leading-tight line-clamp-2 drop-shadow-lg">
                                {post.title}
                            </h3>
                            <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-white/40 group-hover:text-amber-400 transition-colors">
                                LEER REFLEXIÓN 
                                <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </div>
                        </div>

                        {/* Hover Light Effect */}
                        <div className="absolute -inset-20 bg-amber-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default BlogReflections;
