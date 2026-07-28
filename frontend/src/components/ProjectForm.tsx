import React, { useState, useEffect } from 'react';
import { ProjectApi } from '../api/client';
import toast from 'react-hot-toast';

interface ProjectFormValues {
    title: string;
    tagline: string;
    description: string;
    techStack: string;
    githubUrl: string;
    liveUrl: string;
}

interface ProjectFormProps {
    initialValues?: ProjectFormValues & { thumbnail?: string };
    onSubmit: (data: FormData) => Promise<void>;
    isSubmitting: boolean;
    buttonText: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues, onSubmit, isSubmitting, buttonText }) => {
    const [title, setTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [techStack, setTechStack] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSyncReadme = async () => {
        if (!githubUrl.trim()) {
            toast.error("Please enter a GitHub URL first.");
            return;
        }

        setIsSyncing(true);
        try {
            const response: any = await ProjectApi.fetchGithubReadme(githubUrl);
            if (response.success && response.data?.readme) {
                setDescription(response.data.readme);
                toast.success("README.md imported successfully!");
            } else {
                toast.error("Failed to extract README content.");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to sync README from GitHub.");
        } finally {
            setIsSyncing(false);
        }
    };

    // Populate initial values on edit mode
    useEffect(() => {
        if (initialValues) {
            setTitle(initialValues.title || '');
            setTagline(initialValues.tagline || '');
            setDescription(initialValues.description || '');
            setTechStack(initialValues.techStack || '');
            setGithubUrl(initialValues.githubUrl || '');
            setLiveUrl(initialValues.liveUrl || '');
            if (initialValues.thumbnail) {
                setThumbnailPreview(initialValues.thumbnail);
            }
        }
    }, [initialValues]);

    // Handle file selection preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!title.trim()) newErrors.title = 'Project title is required';
        if (title.length < 3) newErrors.title = 'Title must be at least 3 characters';
        if (!tagline.trim()) newErrors.tagline = 'A short tagline is required';
        if (tagline.length > 120) newErrors.tagline = 'Tagline cannot exceed 120 characters';
        if (!description.trim()) newErrors.description = 'Project description is required';
        if (!techStack.trim()) newErrors.techStack = 'Tech stack tags are required';

        // URL format validation helpers
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/i;
        if (githubUrl && !urlPattern.test(githubUrl)) {
            newErrors.githubUrl = 'Invalid GitHub Repository URL';
        }
        if (liveUrl && !urlPattern.test(liveUrl)) {
            newErrors.liveUrl = 'Invalid Live Website URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        // Build Multi-Part FormData payload
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('tagline', tagline.trim());
        formData.append('description', description.trim());
        formData.append('techStack', techStack.trim());
        formData.append('githubUrl', githubUrl.trim());
        formData.append('liveUrl', liveUrl.trim());
        if (thumbnailFile) {
            formData.append('thumbnail', thumbnailFile);
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Title Column */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="p-title" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Project Title <span className="text-rose-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="p-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. showoff-portfolio" 
                    className="input-field w-full rounded-xl px-4 py-3 text-sm outline-none"
                />
                {errors.title && <span className="text-[10px] font-bold text-rose-500">{errors.title}</span>}
            </div>

            {/* Tagline Column */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="p-tagline" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tagline / One-liner <span className="text-rose-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="p-tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. A gorgeous micro-blog devlog platform built for developers." 
                    className="input-field w-full rounded-xl px-4 py-3 text-sm outline-none"
                />
                <span className="text-[9px] text-slate-400 font-medium">Explain your project in a single catchy sentence. Max 120 characters.</span>
                {errors.tagline && <span className="text-[10px] font-bold text-rose-500">{errors.tagline}</span>}
            </div>

            {/* Tech Stack tags Column */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="p-tech" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Tech Stack <span className="text-rose-500">*</span>
                </label>
                <input 
                    type="text" 
                    id="p-tech"
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    placeholder="e.g. React, Sequelize, MySQL, Bun, Cloudinary" 
                    className="input-field w-full rounded-xl px-4 py-3 text-sm outline-none"
                />
                <span className="text-[9px] text-slate-400 font-medium">Comma-separated tags representing your technology stacks.</span>
                {errors.techStack && <span className="text-[10px] font-bold text-rose-500">{errors.techStack}</span>}
            </div>

            {/* Links Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                        <label htmlFor="p-git" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            GitHub Repository URL
                        </label>
                        {githubUrl && (
                            <button
                                type="button"
                                onClick={handleSyncReadme}
                                disabled={isSyncing}
                                className="text-[10px] font-extrabold text-primary dark:text-indigo-400 hover:underline flex items-center gap-1 disabled:opacity-50 transition-all"
                            >
                                <span className="material-symbols-outlined text-xs">sync</span>
                                {isSyncing ? 'Syncing...' : 'Sync README'}
                            </button>
                        )}
                    </div>
                    <input 
                        type="url" 
                        id="p-git"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="e.g. https://github.com/user/project" 
                        className="input-field w-full rounded-xl px-4 py-3 text-sm outline-none"
                    />
                    {errors.githubUrl && <span className="text-[10px] font-bold text-rose-500">{errors.githubUrl}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="p-live" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Live Demo URL
                    </label>
                    <input 
                        type="url" 
                        id="p-live"
                        value={liveUrl}
                        onChange={(e) => setLiveUrl(e.target.value)}
                        placeholder="e.g. https://myproject.com" 
                        className="input-field w-full rounded-xl px-4 py-3 text-sm outline-none"
                    />
                    {errors.liveUrl && <span className="text-[10px] font-bold text-rose-500">{errors.liveUrl}</span>}
                </div>
            </div>

            {/* Description Textarea */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="p-desc" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Project Showcase Details <span className="text-rose-500">*</span>
                </label>
                <textarea 
                    id="p-desc"
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of what you built, what challenges you faced, and how this works..." 
                    className="input-field w-full rounded-xl px-4 py-3 text-sm leading-relaxed resize-none outline-none"
                />
                {errors.description && <span className="text-[10px] font-bold text-rose-500">{errors.description}</span>}
            </div>

            {/* Thumbnail Upload File Field */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Project Cover Art / Image
                </label>
                
                <div className="flex items-center gap-4 flex-col sm:flex-row">
                    {/* Preview box */}
                    <div className="w-full sm:w-40 h-24 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 shrink-0 flex items-center justify-center text-slate-400 relative">
                        {thumbnailPreview ? (
                            <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[32px]">image</span>
                        )}
                    </div>

                    {/* File selection triggers */}
                    <div className="flex flex-col gap-1.5 flex-grow">
                        <label className="bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-250 border border-slate-200/30 dark:border-slate-700 px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all inline-flex items-center gap-1.5 justify-center w-full sm:w-auto">
                            <span className="material-symbols-outlined text-sm">cloud_upload</span>
                            Upload Image File
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <span className="text-[9px] text-slate-400 font-medium">Leave empty to automatically synthesize an AI Cover using Pollinations Flux!</span>
                    </div>
                </div>
            </div>

            {/* Submission Actions */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:brightness-105 text-white font-extrabold text-sm py-3 px-6 rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-4"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving Project Profile...
                    </>
                ) : (
                    buttonText
                )}
            </button>
        </form>
    );
};

export default ProjectForm;
