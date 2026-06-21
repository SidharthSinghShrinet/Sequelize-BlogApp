import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import ProjectForm from '../components/ProjectForm';
import { ProjectApi } from '../api/client';
import toast from 'react-hot-toast';

const CreateProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [project, setProject] = useState<any>(null);
    const [fetching, setFetching] = useState(isEditMode);
    const [submitting, setSubmitting] = useState(false);

    // Fetch initial project details if in edit mode
    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const response: any = await ProjectApi.getProjectById(id);
                setProject(response.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load project details for editing.");
                navigate('/projects');
            } finally {
                setFetching(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleSubmit = async (formData: FormData) => {
        setSubmitting(true);
        const loadingToast = toast.loading(isEditMode ? "Saving changes..." : "Creating project profile...");
        try {
            if (isEditMode) {
                await ProjectApi.updateProject(id, formData);
                toast.success("Project profile updated successfully!", { id: loadingToast });
                navigate(`/projects/${id}`);
            } else {
                const response: any = await ProjectApi.createProject(formData);
                toast.success("Project profile created successfully!", { id: loadingToast });
                navigate(`/projects/${response.data.id}`);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Failed to save project profile.", { id: loadingToast });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            {/* Top Navbar */}
            <TopNavBar />

            {/* Main Area */}
            <main className="flex-grow max-w-container-max w-full mx-auto px-gutter py-lg flex flex-col gap-6 md:gap-8 justify-center">
                
                {/* Back Nav Link */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-[11px] font-extrabold text-slate-400 hover:text-slate-900 dark:hover:text-white font-mono uppercase tracking-wider self-start"
                >
                    <span className="material-symbols-outlined text-xs">arrow_back</span>
                    Back
                </button>

                {/* Header Title */}
                <header className="flex flex-col gap-2 w-full max-w-2xl mx-auto">
                    <span className="font-mono text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest animate-pulse">
                        Showcase Hub // Project Registration
                    </span>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        {isEditMode ? "Edit Project Profile" : "Register Project Showcase"}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                        Fill in your project's technology stack, demo links, and description. Let the community track your development progress!
                    </p>
                </header>

                {/* Loading state or Form */}
                {fetching ? (
                    <div className="flex-grow flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <ProjectForm 
                        initialValues={project ? {
                            title: project.title,
                            tagline: project.tagline,
                            description: project.description,
                            techStack: project.techStack,
                            githubUrl: project.githubUrl || '',
                            liveUrl: project.liveUrl || '',
                            thumbnail: project.thumbnail
                        } : undefined}
                        onSubmit={handleSubmit}
                        isSubmitting={submitting}
                        buttonText={isEditMode ? "Save Changes" : "Create Showcase Profile"}
                    />
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CreateProjectPage;
