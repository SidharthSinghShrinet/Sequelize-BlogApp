import React from 'react';
import { Link } from 'react-router-dom';
import { calculateReadingTime, getBlogImageUrl } from '../hooks/useBlogs';

interface Devlog {
    id: number;
    title: string;
    content: string;
    thumbnail?: string;
    createdAt: string;
    authorDetails?: {
        username: string;
    };
}

interface ProjectTimelineProps {
    devlogs: Devlog[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ devlogs }) => {
    if (devlogs.length === 0) {
        return (
            <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                    <span className="material-symbols-outlined text-[24px]">timeline</span>
                </div>
                <div className="flex flex-col gap-1 max-w-xs">
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">No Devlogs Yet</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        The developer hasn't published any development updates for this project.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
            {devlogs.map((log, idx) => {
                const readTime = calculateReadingTime(log.content);
                const postDate = new Date(log.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });
                const summary = log.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 120) + '...';

                return (
                    <div key={log.id} className="relative group flex flex-col gap-2">
                        {/* Timeline Bullet Dot */}
                        <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-750 group-hover:border-primary dark:group-hover:border-indigo-400 group-hover:scale-110 transition-all z-10 flex items-center justify-center">
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-750 group-hover:bg-primary dark:group-hover:bg-indigo-400 transition-colors" />
                        </div>

                        {/* Devlog Item Card */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 dark:hover:border-indigo-500/20 transition-all duration-300 flex flex-col sm:flex-row gap-4">
                            {/* Small thumbnail */}
                            <div className="w-full sm:w-24 h-24 sm:h-auto rounded-xl overflow-hidden shrink-0 border border-slate-50 dark:border-slate-800 bg-slate-50 relative">
                                <img 
                                    src={getBlogImageUrl(log.content, log.title, log.id, log.thumbnail)} 
                                    alt={log.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Card Content details */}
                            <div className="flex flex-col justify-between flex-grow min-w-0">
                                <div className="flex flex-col gap-1">
                                    {/* Date & Index badge */}
                                    <div className="flex items-center gap-2 text-[9px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                        <span>Update #{idx + 1}</span>
                                        <span>•</span>
                                        <span>{postDate}</span>
                                    </div>
                                    {/* Title */}
                                    <Link to={`/post/${log.id}`}>
                                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors leading-snug line-clamp-1">
                                            {log.title}
                                        </h4>
                                    </Link>
                                    {/* Text Snippet */}
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mt-1">
                                        {summary}
                                    </p>
                                </div>

                                {/* Reading info footer */}
                                <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-2 mt-3">
                                    <span className="text-[9px] font-mono font-medium text-slate-400 dark:text-slate-500">
                                        {readTime} minute read
                                    </span>
                                    <Link 
                                        to={`/post/${log.id}`} 
                                        className="text-[10px] font-extrabold text-primary dark:text-indigo-400 hover:opacity-85 transition-opacity"
                                    >
                                        Read Update
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectTimeline;
