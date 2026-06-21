import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import ProjectCard from '../components/ProjectCard';
import { ProjectApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProjectsPage = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response: any = await ProjectApi.getAllProjects();
                setProjects(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to retrieve showcased projects.");
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Filter projects based on query and tags
    const filtered = projects.filter((project: any) => {
        const matchesQuery = 
            project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesTag = selectedTag
            ? project.techStack.toLowerCase().includes(selectedTag.toLowerCase())
            : true;

        return matchesQuery && matchesTag;
    });

    // Derive all unique technology tags across all projects
    const allTags = Array.from(
        new Set(
            projects
                .map((p) => p.techStack.split(','))
                .flat()
                .map((t) => t.trim())
                .filter((t) => t.length > 0)
        )
    ).slice(0, 10); // cap tags filter list to top 10

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Top Navbar */}
            <TopNavBar />

            {/* Main Area */}
            <main className="flex-grow max-w-container-max w-full mx-auto px-gutter py-lg flex flex-col gap-8">
                
                {/* Header Profile Title */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <span className="font-mono text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest animate-pulse">
                            Creative Portfolio // Showoff Directory
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            The Project Hub
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
                            Discover production-grade tools, interactive playgrounds, and software codebases built by our engineering community.
                        </p>
                    </div>

                    {user && (
                        <Link 
                            to="/projects/create"
                            className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                        >
                            <span className="material-symbols-outlined text-sm">rocket_launch</span>
                            Showcase Project
                        </Link>
                    )}
                </header>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <div className="flex flex-wrap gap-2 flex-grow max-w-md w-full">
                        <div className="w-full relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">search</span>
                            <input 
                                type="text" 
                                placeholder="Search by name, tagline, or stack..." 
                                className="input-field w-full rounded-xl pl-10 pr-4 py-2.5 outline-none text-xs"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tag Filter selection lists */}
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 max-w-full">
                            <button
                                onClick={() => setSelectedTag(null)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                    !selectedTag 
                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' 
                                        : 'bg-white dark:bg-slate-950 text-slate-550 dark:text-slate-450 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-50'
                                }`}
                            >
                                All Tags
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                        selectedTag === tag
                                            ? 'bg-primary text-white border-primary dark:bg-indigo-500 dark:border-indigo-500'
                                            : 'bg-white dark:bg-slate-950 text-slate-550 dark:text-slate-450 border-slate-200/60 dark:border-slate-800/80 hover:bg-slate-50'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Projects Display */}
                {loading ? (
                    <div className="flex-grow flex items-center justify-center min-h-[300px]">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
                            <span className="material-symbols-outlined text-[36px]">rocket</span>
                        </div>
                        <div className="flex flex-col gap-1 max-w-sm">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">No Projects Found</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                We couldn't find any projects matching your search criteria. Try checking other tag filters or register your own!
                            </p>
                        </div>
                        {user && (
                            <Link 
                                to="/projects/create"
                                className="bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md hover:brightness-105 transition-all mt-2"
                            >
                                Showcase Your Project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.4s_ease-out]">
                        {filtered.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProjectsPage;
