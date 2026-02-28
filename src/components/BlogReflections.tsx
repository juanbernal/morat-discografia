
import React, { useMemo, useState, useEffect } from 'react';
import type { BlogPost } from '../types';

interface BlogReflectionsProps {
    posts: BlogPost[];
}

const DEFAULT_THUMBNAIL = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800';

const ReflectionModal: React.FC<{ post: BlogPost; onClose: () => void }> = ({ post, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const modalImage = post.thumbnail && post.thumbnail !== "undefined" && post.thumbnail !== "" ? post.thumbnail : DEFAULT_THUMBNAIL;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
            <div className="relative bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col shadow-2xl">
                <div className="h-48 md:h-64 shrink-0 relative">
                    <img 
                        src={modalImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                            if (e.currentTarget.src !== DEFAULT_THUMBNAIL) {
                                e.currentTarget.src = DEFAULT_THUMBNAIL;
                            }
                        }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-black/40 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar flex-1">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4 block">Reflexión de Hoy</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-8 leading-tight">{post.title}</h2>
                    <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                            {post.summary}
                        </div>
                    </div>
                </div>
                <div className="p-8 border-t border-white/5 bg-black/20 flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {new Date(post.published).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={onClose} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
                        Cerrar Lectura
                    </button>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }`}</style>
        </div>
    );
};

const BlogReflections: React.FC<BlogReflectionsProps> = ({ posts }) => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const dailyPost = useMemo(() => {
        if (!posts || posts.length === 0) return null;
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return posts[dayOfYear % posts.length];
    }, [posts]);

    if (!dailyPost) return null;

    const mainImage = dailyPost.thumbnail && dailyPost.thumbnail !== "undefined" && dailyPost.thumbnail !== "" ? dailyPost.thumbnail : DEFAULT_THUMBNAIL;

    return (
        <section className="mb-24 animate-fade-in">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-1.5 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        La Reflexión <span className="text-blue-500">del Día</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mt-1">
                        Un mensaje de fe y disciplina para hoy
                    </p>
                </div>
            </div>

            <div className="relative group overflow-hidden bg-slate-900/40 rounded-[2.5rem] md:rounded-[3rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
                <div className="flex flex-col lg:flex-row items-stretch">
                    <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[400px]">
                        <img 
                            src={mainImage} 
                            alt={dailyPost.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => {
                                if (e.currentTarget.src !== DEFAULT_THUMBNAIL) {
                                    e.currentTarget.src = DEFAULT_THUMBNAIL;
                                }
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent lg:hidden"></div>
                    </div>

                    <div className="lg:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-6 block">
                            {new Date(dailyPost.published).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
                        </span>
                        
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter leading-tight drop-shadow-2xl">
                            {dailyPost.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm md:text-lg mb-10 leading-relaxed line-clamp-3">
                            {dailyPost.summary}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => setSelectedPost(dailyPost)}
                                className="bg-white text-black font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95 text-center"
                            >
                                Leer ahora mismo
                            </button>
                            <a 
                                href={dailyPost.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white/5 hover:bg-white/10 text-white font-black px-10 py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all border border-white/10 active:scale-95 text-center"
                            >
                                Ver en el Blog
                            </a>
                        </div>
                    </div>
                </div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            </div>

            {selectedPost && (
                <ReflectionModal post={selectedPost} onClose={() => setSelectedPost(null)} />
            )}
        </section>
    );
};

export default BlogReflections;
