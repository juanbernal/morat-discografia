import React from 'react';

interface CountdownTimerProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold text-amber-400 tracking-tighter" style={{fontVariantNumeric: 'tabular-nums'}}>
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
);

const CountdownTimer: React.FC<CountdownTimerProps> = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="flex justify-center md:justify-start items-center gap-4 md:gap-6 my-4">
            <TimeBlock value={days} label="Días" />
            <span className="text-4xl font-bold text-gray-600">:</span>
            <TimeBlock value={hours} label="Horas" />
            <span className="text-4xl font-bold text-gray-600">:</span>
            <TimeBlock value={minutes} label="Minutos" />
            <span className="text-4xl font-bold text-gray-600">:</span>
            <TimeBlock value={seconds} label="Segundos" />
        </div>
    );
};

export default CountdownTimer;