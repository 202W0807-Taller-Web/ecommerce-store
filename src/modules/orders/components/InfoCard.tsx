import React from 'react';

export default function InfoCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
    return (
        
        <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-x-3 mb-3">
                <img src={icon} alt={title} className="w-6 h-6" />
                <h3 className="font-bold text-gray-700">{title}</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                {children}
            </div>
        </div>
    );
}