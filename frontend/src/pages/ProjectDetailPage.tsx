import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import ProjectTimeline from '../components/ProjectTimeline';
import { ProjectApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { user, isProjectBookmarked, toggleProjectBookmark } = useAuth();
    const navigate = useNavigate();

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const response: any = await ProjectApi.getProjectById(id);
                setProject(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load project details.");
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this project? Your linked blog posts will not be deleted, but they will be unlinked.")) return;
        setDeleting(true);
        try {
            await ProjectApi.deleteProject(project.id);
            toast.success("Project deleted successfully!");
            navigate('/projects');
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete project.");
        } finally {
            setDeleting(false);
        }
    };

    console.log(project)

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
                <TopNavBar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!project) return null;

    const isOwner = user?.id === project.ownerId;
    const tags = project.techStack
        ? project.techStack.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
        : [];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Top Navbar */}
            <TopNavBar />

            {/* Content Container */}
            <main className="flex-grow max-w-container-max w-full mx-auto px-gutter py-lg flex flex-col gap-6 md:gap-8">

                {/* Back Nav Link */}
                <Link
                    to="/projects"
                    className="flex items-center gap-1 text-[11px] font-extrabold text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono uppercase tracking-wider"
                >
                    <span className="material-symbols-outlined text-xs">arrow_back</span>
                    Back to Project Hub
                </Link>

                {/* Grid Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - README Project Profile (Span 7) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">

                        {/* Thumbnail Cover Banner */}
                        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-50 dark:border-slate-800 relative">
                            {project.thumbnail ? (
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950 flex items-center justify-center text-indigo-400 dark:text-slate-650">
                                    <span className="material-symbols-outlined text-[64px]">terminal</span>
                                </div>
                            )}
                        </div>

                        {/* Title and Tagline */}
                        <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-800/40 pb-4">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                {project.title}
                            </h1>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                                {project.tagline}
                            </p>
                        </div>

                        {/* Tech Stack badges */}
                        <div className="flex flex-col gap-2">
                            <h4 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest font-mono">Tech Stack</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {tags.map((tag: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-355 border border-slate-200/50 dark:border-slate-800 rounded-md px-2.5 py-1 text-[10px] font-bold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Description markup */}
                        <div className="flex flex-col gap-2 mt-2">
                            <h4 className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-widest font-mono">Project Profile</h4>
                            <div
                                className="text-slate-800 dark:text-slate-200 prose dark:prose-invert max-w-none text-sm leading-relaxed font-normal"
                                dangerouslySetInnerHTML={{ __html: marked.parse(project.description || '') }}
                            />
                        </div>

                        {/* Footer Links & Owner Control panel */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-50 dark:border-slate-800/40 pt-6 mt-4 gap-4">

                            {/* Showcase Links */}
                            <div className="flex items-center gap-3">
                                {user && (
                                    <button
                                        onClick={() => toggleProjectBookmark(project.id)}
                                        className={`text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5 border ${
                                            isProjectBookmarked(project.id)
                                                ? 'bg-primary text-white border-primary hover:brightness-105 shadow-md shadow-primary/20'
                                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 border-slate-200/20 dark:border-slate-700'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">
                                            {isProjectBookmarked(project.id) ? 'bookmark' : 'bookmark_border'}
                                        </span>
                                        {isProjectBookmarked(project.id) ? 'Saved' : 'Save for Later'}
                                    </button>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-1.5"
                                    >
                                        <span className="material-symbols-outlined text-sm">code</span>
                                        GitHub Repository
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5 border border-slate-200/20 dark:border-slate-700"
                                    >
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                        Live Website
                                    </a>
                                )}
                            </div>

                            {/* Owner editing actions */}
                            {isOwner && (
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <Link
                                        to={`/projects/edit/${project.id}`}
                                        className="bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all border border-slate-200/10 dark:border-slate-700"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="bg-rose-50 hover:bg-rose-100/80 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/10 dark:text-rose-400 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 transition-all border border-rose-200/25 dark:border-rose-900/25 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Devlog Timeline (Span 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="font-mono text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Devlog Timeline // Chronological Updates
                            </span>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                Development Logs
                                <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-mono">
                                    {project.devlogs?.length || 0}
                                </span>
                            </h2>
                        </div>

                        {/* Rendering Timeline component */}
                        <ProjectTimeline devlogs={project.devlogs || []} />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ProjectDetailPage;
