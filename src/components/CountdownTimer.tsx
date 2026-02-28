
import React from 'react';

interface CountdownTimerProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center flex-1">
        <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-blue-500 tracking-tighter" style={{fontVariantNumeric: 'tabular-nums'}}>
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest mt-1">{label}</span>
    </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="flex justify-between items-center w-full max-w-sm mx-auto lg:mx-0">
            <TimeBlock value={days} label="Días" />
            <span className="text-xl md:text-3xl font-bold text-slate-700 pb-4">:</span>
            <TimeBlock value={hours} label="Hrs" />
            <span className="text-xl md:text-3xl font-bold text-slate-700 pb-4">:</span>
            <TimeBlock value={minutes} label="Min" />
            <span className="text-xl md:text-3xl font-bold text-slate-700 pb-4">:</span>
            <TimeBlock value={seconds} label="Seg" />
        </div>
    );
};

export default CountdownTimer;
