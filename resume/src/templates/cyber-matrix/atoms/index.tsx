import React from 'react';

export const SectionTitle = ({ label, color }: { label: string; color: string }) => {
    return (
        <div className="mb-4 flex items-center gap-3">
            <h3
                className="text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ color }}
            >
                {label}
            </h3>
            <div className="h-[1px] w-full bg-slate-100" />
        </div>
    );
};

export const ProfileName = ({ name, color }: { name: string; color: string }) => {
    return (
        <h1 className="text-5xl font-black tracking-tighter mb-2 leading-none uppercase" style={{ color }}>
            {name}
        </h1>
    );
};

export const SectionSubtitle = ({ label }: { label: string }) => {
    return <h2 className="text-xl font-medium text-gray-600 mb-2 uppercase tracking-wide">{label}</h2>;
};
