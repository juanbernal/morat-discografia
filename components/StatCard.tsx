import React from 'react';

interface StatCardProps {
    label: string;
    value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
    return (
        <div className="bg-[#282828] p-4 rounded-lg text-center shadow-md border border-gray-700 w-36 transition-transform duration-200 hover:scale-105">
            <p className="text-3xl font-bold text-amber-400">{value}</p>
            <p className="text-sm text-gray-400 uppercase tracking-wider">{label}</p>
        </div>
    );
};

export default StatCard;