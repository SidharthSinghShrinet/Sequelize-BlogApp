import React, { useState } from 'react';
import { CATEGORIES } from '../hooks/useBlogs';
import type { CategoryInfo } from '../hooks/useBlogs';

interface CategoryMeshProps {
    counts: Record<string, number>;
    onSelectCategory: (category: CategoryInfo) => void;
}

const CategoryMesh: React.FC<CategoryMeshProps> = ({ counts, onSelectCategory }) => {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    // Radial coordinates centered on (400, 220)
    // Symmetrical layout with R = 180px, 6 radial directions
    const center = { x: 400, y: 220 };
    const nodes = CATEGORIES.map((cat, idx) => {
        const angle = (idx * 60 * Math.PI) / 180; // 60 degrees apart
        const R = 175;
        return {
            ...cat,
            x: center.x + R * Math.cos(angle),
            y: center.y + R * Math.sin(angle),
            count: counts[cat.id] || 0
        };
    });

    // Theme colors mapping for glow/borders
    const colorStyles: Record<string, { glow: string; border: string; text: string; bg: string }> = {
        frontend: { glow: 'shadow-blue-500/30', border: 'border-blue-500/40', text: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/20' },
        backend: { glow: 'shadow-indigo-500/30', border: 'border-indigo-500/40', text: 'text-indigo-500 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/20' },
        databases: { glow: 'shadow-emerald-500/30', border: 'border-emerald-500/40', text: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20' },
        devops: { glow: 'shadow-amber-500/30', border: 'border-amber-500/40', text: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/20' },
        ai: { glow: 'shadow-rose-500/30', border: 'border-rose-500/40', text: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/20' },
        general: { glow: 'shadow-slate-500/30', border: 'border-slate-500/40', text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-50/50 dark:bg-slate-950/20' }
    };

    return (
        <div className="relative w-full aspect-[16/10] bg-slate-50/20 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-900 rounded-3xl overflow-hidden shadow-inner p-4">
            {/* Ambient Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

            <svg viewBox="0 0 800 440" className="w-full h-full relative z-10 select-none">
                {/* SVG Filters for Glow Effects */}
                <defs>
                    <filter id="glow-frontend" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <style>{`
                        @keyframes pulseDash {
                            to {
                                stroke-dashoffset: -32;
                            }
                        }
                        .signal-line {
                            stroke-dasharray: 6, 10;
                            animation: pulseDash 1.2s linear infinite;
                        }
                        .signal-line-fast {
                            stroke-dasharray: 6, 10;
                            animation: pulseDash 0.5s linear infinite;
                        }
                    `}</style>
                </defs>

                {/* Connecting Web Lines */}
                {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    const strokeColor = isHovered 
                        ? 'stroke-primary dark:stroke-indigo-500' 
                        : 'stroke-slate-200 dark:stroke-slate-800';
                    const strokeWidth = isHovered ? 2.5 : 1.5;

                    return (
                        <g key={`link-${node.id}`}>
                            {/* Static connector line */}
                            <line
                                x1={center.x}
                                y1={center.y}
                                x2={node.x}
                                y2={node.y}
                                className={`transition-all duration-300 ${strokeColor}`}
                                strokeWidth={strokeWidth}
                            />
                            {/* Glowing animated signal pulse line */}
                            <line
                                x1={center.x}
                                y1={center.y}
                                x2={node.x}
                                y2={node.y}
                                stroke="url(#hub-pulse-gradient)"
                                className={`signal-line ${
                                    isHovered ? 'signal-line-fast stroke-primary dark:stroke-indigo-400 opacity-100' : 'opacity-30 dark:opacity-40'
                                }`}
                                strokeWidth={isHovered ? 3 : 1.5}
                                strokeLinecap="round"
                            />
                        </g>
                    );
                })}

                {/* Central SHOWOFF Reactor Core Hub */}
                <g>
                    {/* Glowing outer core rings */}
                    <circle
                        cx={center.x}
                        cy={center.y}
                        r={45}
                        className="fill-primary/5 stroke-primary/20 dark:fill-indigo-500/5 dark:stroke-indigo-500/20 animate-pulse"
                    />
                    <circle
                        cx={center.x}
                        cy={center.y}
                        r={32}
                        className="fill-white dark:fill-slate-900 stroke-primary/30 dark:stroke-indigo-500/30 shadow-lg"
                        style={{ filter: hoveredNode ? 'url(#glow-frontend)' : 'none' }}
                    />
                    {/* Core ForeignObject for Hub styling */}
                    <foreignObject
                        x={center.x - 30}
                        y={center.y - 30}
                        width={60}
                        height={60}
                        className="rounded-full overflow-visible"
                    >
                        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-tr from-primary to-indigo-500 dark:from-indigo-600 dark:to-violet-500 flex flex-col items-center justify-center shadow-lg border border-white/20 text-white animate-[spin_12s_linear_infinite]">
                            <span className="material-symbols-outlined text-[26px]">hub</span>
                        </div>
                    </foreignObject>
                    {/* Hub label text */}
                    <text
                        x={center.x}
                        y={center.y + 48}
                        textAnchor="middle"
                        className="font-mono text-[9px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase fill-current"
                    >
                        Showoff Core
                    </text>
                </g>

                {/* Radial Category Nodes */}
                {nodes.map((node) => {
                    const isHovered = hoveredNode === node.id;
                    const cStyle = colorStyles[node.id];
                    
                    return (
                        <g key={node.id}>
                            <foreignObject
                                x={node.x - 65}
                                y={node.y - 65}
                                width={130}
                                height={130}
                                className="overflow-visible"
                            >
                                <div
                                    onMouseEnter={() => setHoveredNode(node.id)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    onClick={() => onSelectCategory(node)}
                                    className={`w-[130px] h-[130px] rounded-3xl bg-white/70 dark:bg-slate-900/70 border backdrop-blur-md flex flex-col items-center justify-center p-3 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl ${
                                        isHovered 
                                            ? `${cStyle.border} ${cStyle.glow} scale-[1.05] border-opacity-100 bg-white dark:bg-slate-900`
                                            : 'border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
                                    }`}
                                >
                                    {/* Icon Container */}
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-2 shadow-inner border border-transparent ${cStyle.bg} ${cStyle.text}`}>
                                        <span className="material-symbols-outlined text-[20px]">
                                            {node.icon}
                                        </span>
                                    </div>

                                    {/* Category Title */}
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2 px-1">
                                        {node.name}
                                    </span>

                                    {/* Count Badge */}
                                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 dark:bg-indigo-400/70 animate-pulse" />
                                        <span className="text-[8px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                                            {node.count}
                                        </span>
                                    </div>
                                </div>
                            </foreignObject>
                        </g>
                    );
                })}
            </svg>
            
            {/* Visual Instruction Banner */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 px-4 py-2 rounded-full shadow-sm text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pointer-events-none select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Select any node to view articles
            </div>
        </div>
    );
};

export default CategoryMesh;
