import React from 'react';

export const SectionTitle = ({ label, color }: { label: string; color: string }) => {
    return (
        <div className="flex items-center gap-4 mb-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap" style={{ color }}>
                {label}
            </h3>
            <div className="h-px w-full bg-slate-100" />
        </div>
    );
};

export const ProfileName = ({ name, color }: { name: string; color: string }) => {
    return (
        <h1 className="text-6xl font-black tracking-tighter mb-1 leading-none" style={{ color }}>
            {name}
        </h1>
    );
};
