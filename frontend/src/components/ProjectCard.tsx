import React from 'react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
    project: {
        id: number;
        title: string;
        tagline: string;
        techStack: string;
        githubUrl?: string;
        liveUrl?: string;
        thumbnail?: string;
        devlogsCount: number;
        ownerDetails?: {
            username: string;
        };
    };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    // Split tech stack string into array of tags
    const tags = project.techStack
        ? project.techStack.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
        : [];

    const ownerName = project.ownerDetails?.username || 'Developer';
    const ownerInitial = ownerName.charAt(0).toUpperCase();

    // Thematic color helper for tech badges
    const getBadgeStyle = (tag: string) => {
        const lower = tag.toLowerCase();
        if (lower.includes('react')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25';
        if (lower.includes('node') || lower.includes('bun')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25';
        if (lower.includes('sequelize') || lower.includes('sql') || lower.includes('database')) return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25';
        if (lower.includes('aws') || lower.includes('cloud') || lower.includes('devops')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25';
        if (lower.includes('ai') || lower.includes('llm') || lower.includes('flux')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25';
        return 'bg-slate-500/10 text-slate-655 dark:text-slate-400 border-slate-500/20';
    };

    return (
        <div className="group bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/20 dark:hover:border-indigo-500/30 transition-all duration-300 flex flex-col h-full relative">
            
            {/* Thumbnail Cover Banner */}
            <div className="h-44 w-full overflow-hidden relative bg-slate-100 dark:bg-slate-950 shrink-0 border-b border-slate-100 dark:border-slate-800/50">
                {project.thumbnail ? (
                    <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 flex flex-col items-center justify-center text-indigo-400 dark:text-slate-600">
                        <span className="material-symbols-outlined text-[48px]">terminal</span>
                    </div>
                )}

                {/* Devlog Count Badge overlay */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 font-mono">
                        {project.devlogsCount} {project.devlogsCount === 1 ? 'Devlog' : 'Devlogs'}
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 flex flex-col flex-grow gap-3 justify-between">
                <div className="flex flex-col gap-2">
                    {/* Creator Avatar & Name */}
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center font-bold text-[9px] text-primary uppercase select-none">
                            {ownerInitial}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                            By {ownerName}
                        </span>
                    </div>

                    {/* Title */}
                    <Link to={`/projects/${project.id}`}>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-1">
                            {project.title}
                        </h3>
                    </Link>

                    {/* Tagline */}
                    <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {project.tagline}
                    </p>
                </div>

                <div className="flex flex-col gap-4 mt-1">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 max-h-[56px] overflow-hidden">
                        {tags.map((tag, idx) => (
                            <span 
                                key={idx} 
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${getBadgeStyle(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-3">
                        {/* Links Shortcut */}
                        <div className="flex items-center gap-3">
                            {project.githubUrl && (
                                <a 
                                    href={project.githubUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center"
                                    title="View GitHub Repository"
                                >
                                    <span className="material-symbols-outlined text-[18px]">code</span>
                                </a>
                            )}
                            {project.liveUrl && (
                                <a 
                                    href={project.liveUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-slate-400 hover:text-primary dark:hover:text-indigo-400 transition-colors flex items-center"
                                    title="View Live Website"
                                >
                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                </a>
                            )}
                        </div>

                        {/* Read Devlogs Link */}
                        <Link 
                            to={`/projects/${project.id}`}
                            className="flex items-center gap-1 text-[10px] font-extrabold text-primary dark:text-indigo-400 hover:opacity-85 transition-opacity"
                        >
                            Explore Devlogs
                            <span className="material-symbols-outlined text-xs">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
