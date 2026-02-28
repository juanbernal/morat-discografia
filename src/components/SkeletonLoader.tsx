import React from 'react';

const SkeletonCard = () => (
    <div className="aspect-square bg-slate-800 rounded-lg animate-shimmer"></div>
);

const SkeletonLoader: React.FC = () => {
    return (
        <div>
            {/* Skeleton Header */}
            <header className="p-6 mb-8">
                <div>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 animate-shimmer"></div>
                        <div className="flex-1 text-center sm:text-left w-full">
                            <div className="h-12 md:h-16 bg-slate-800 rounded-md animate-shimmer w-3/4 sm:w-1/2 mx-auto sm:mx-0"></div>
                            <div className="h-6 bg-slate-800 rounded-md animate-shimmer w-1/4 sm:w-1/5 mx-auto sm:mx-0 mt-3"></div>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                                <div className="h-6 w-20 bg-slate-800 rounded-full animate-shimmer"></div>
                                <div className="h-6 w-24 bg-slate-800 rounded-full animate-shimmer"></div>
                                <div className="h-6 w-16 bg-slate-800 rounded-full animate-shimmer"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 flex-wrap justify-center mt-6 pt-6 border-t border-slate-700">
                        <div className="w-36 h-24 bg-slate-800 rounded-lg animate-shimmer"></div>
                        <div className="w-36 h-24 bg-slate-800 rounded-lg animate-shimmer"></div>
                    </div>
                </div>
            </header>

            {/* Skeleton Top Tracks */}
            <section className="mb-12">
                <div className="h-9 w-64 bg-slate-800 rounded-md animate-shimmer mb-6 px-2"></div>
                <div className="flex flex-col gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div key={index} className="grid grid-cols-[auto,60px,1fr,auto] items-center gap-4 p-2 rounded-lg">
                            <div className="w-6 h-6 bg-slate-800 rounded animate-shimmer"></div>
                            <div className="w-12 h-12 bg-slate-800 rounded animate-shimmer"></div>
                            <div className="flex-1">
                                <div className="h-5 w-3/4 bg-slate-800 rounded animate-shimmer"></div>
                                <div className="h-4 w-1/2 bg-slate-800 rounded animate-shimmer mt-2"></div>
                            </div>
                            <div className="w-12 h-5 bg-slate-800 rounded animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Skeleton Discography */}
            <main className="mt-8">
                 <div className="px-2 mb-6 flex justify-between items-center">
                    <div className="h-9 w-56 bg-slate-800 rounded-md animate-shimmer"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
                    {Array.from({ length: 18 }).map((_, index) => (
                        <SkeletonCard key={index} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default SkeletonLoader;