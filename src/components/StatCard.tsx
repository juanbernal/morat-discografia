import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
    return (
        <div className="relative group overflow-hidden bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:border-blue-500/30 w-full sm:w-44 text-center shadow-lg">
            <div className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
            <p className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-1">{value}</p>
            <p className="text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-[0.2em]">{label}</p>
        </div>
    );
};

export default StatCard;