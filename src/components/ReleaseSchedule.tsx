
import React from 'react';

interface ScheduleItem {
    flagUrl: string;
    city: string;
    time: string;
}

interface ReleaseScheduleProps {
    variant?: 'blue' | 'amber';
    compact?: boolean;
}

const SCHEDULE: ScheduleItem[] = [
    { flagUrl: 'https://flagcdn.com/mx.svg', city: 'MEX', time: '23:00' },
    { flagUrl: 'https://flagcdn.com/co.svg', city: 'COL', time: '00:00' },
    { flagUrl: 'https://flagcdn.com/us.svg', city: 'EST', time: '01:00' },
    { flagUrl: 'https://flagcdn.com/ar.svg', city: 'ARG', time: '02:00' },
    { flagUrl: 'https://flagcdn.com/es.svg', city: 'ESP', time: '07:00' },
    { flagUrl: 'https://flagcdn.com/cl.svg', city: 'CHI', time: '02:00' }
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
                        <img src={item.flagUrl} alt={item.city} className="w-4 h-3 object-cover rounded-sm" />
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
                        <div className="mb-2 transform group-hover:scale-125 transition-transform duration-500 overflow-hidden rounded-sm shadow-md">
                            <img src={item.flagUrl} alt={item.city} className="w-6 h-4 object-cover block" />
                        </div>
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
