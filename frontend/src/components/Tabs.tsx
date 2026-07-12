import React from 'react';

export interface TabOption {
    id: string;
    label: string;
    icon?: string;
    count?: number;
}

interface TabsProps {
    tabs: TabOption[];
    activeTab: string;
    onChange: (id: any) => void;
    variant?: 'line' | 'pill';
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, variant = 'line', className = '' }) => {
    if (variant === 'pill') {
        return (
            <div className={`flex gap-2 border-b border-slate-100 dark:border-slate-800/50 pb-3 ${className}`}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            activeTab === tab.id
                                ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900'
                                : 'border-slate-200/80 text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-450 dark:hover:bg-slate-850'
                        }`}
                    >
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span className="ml-1 text-[10px] font-bold">
                                ({tab.count})
                            </span>
                        )}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className={`flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-px shrink-0 ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                        activeTab === tab.id
                            ? 'border-primary text-primary dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-400 hover:text-slate-655 dark:hover:text-slate-200'
                    }`}
                >
                    {tab.icon && (
                        <span className="material-symbols-outlined text-base">
                            {tab.icon}
                        </span>
                    )}
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                        <span className="text-xs font-semibold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-mono">
                            {tab.count}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
