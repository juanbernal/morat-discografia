
import React from 'react';

interface ScheduleItem {
    flag: string;
    city: string;
    time: string;
}

interface ReleaseScheduleProps {
    variant?: 'blue' | 'amber';
    compact?: boolean;
}

const SCHEDULE: ScheduleItem[] = [
    { flag: '🇲🇽', city: 'MEX', time: '22:00' },
    { flag: '🇨🇴', city: 'COL', time: '23:00' },
    { flag: '🇺🇸', city: 'EST', time: '00:00' },
    { flag: '🇦🇷', city: 'ARG', time: '01:00' },
    { flag: '🇪🇸', city: 'ESP', time: '06:00' },
    { flag: '🇨🇱', city: 'CHI', time: '01:00' }
];

const ReleaseSchedule: React.FC<ReleaseScheduleProps> = ({ variant = 'blue', compact = false }) => {
    const accentColor = variant === 'blue' ? 'text-blue-500' : 'text-amber-500';
    const borderColor = variant === 'blue' ? 'border-blue-500/20' : 'border-amber-500/20';
    const bgColor = variant === 'blue' ? 'bg-blue-500/5' : 'bg-amber-500/5';

    if (compact) {
        return (
            <div className={`flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1`}>
                {SCHEDULE.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 shrink-0">
                        <span className="text-sm">{item.flag}</span>
                        <span className="text-[10px] font-black text-white/60">{item.city}</span>
                        <span className={`text-[10px] font-black ${accentColor}`}>{item.time}</span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`w-full ${bgColor} rounded-[2rem] border ${borderColor} p-6 backdrop-blur-xl`}>
            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 text-center">Horarios de Estreno Global</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {SCHEDULE.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 group">
                        <span className="text-2xl mb-1 transform group-hover:scale-125 transition-transform duration-500 cursor-default">
                            {item.flag}
                        </span>
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                            {item.city}
                        </span>
                        <span className={`text-sm font-black ${accentColor} tracking-tighter`}>
                            {item.time}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReleaseSchedule;
