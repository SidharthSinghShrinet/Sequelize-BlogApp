import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { BlogApi, ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const CreateBlogPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    const [fetching, setFetching] = useState(!!id);

    const isEditMode = !!id;

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: { title: '', content: '' }
    });

    const { ref: contentRef, ...contentRegister } = register('content');

    const handleFormat = (type: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        let formatted = '';
        let cursorOffset = 0;

        switch (type) {
            case 'format_bold':
                formatted = `**${selectedText || 'bold text'}**`;
                cursorOffset = selectedText ? 0 : 2;
                break;
            case 'format_italic':
                formatted = `*${selectedText || 'italic text'}*`;
                cursorOffset = selectedText ? 0 : 1;
                break;
            case 'format_h1':
                formatted = `\n# ${selectedText || 'Heading 1'}\n`;
                break;
            case 'format_h2':
                formatted = `\n## ${selectedText || 'Heading 2'}\n`;
                break;
            case 'link':
                formatted = `[${selectedText || 'link text'}](https://example.com)`;
                break;
            case 'image':
                formatted = `![${selectedText || 'image alt'}](https://example.com/image.png)`;
                break;
            case 'code':
                formatted = selectedText.includes('\n') 
                    ? `\n\`\`\`\n${selectedText || 'code block'}\n\`\`\`\n`
                    : `\`${selectedText || 'code'}\``;
                break;
            default:
                return;
        }

        const newText = text.substring(0, start) + formatted + text.substring(end);
        setValue('content', newText, { shouldDirty: true, shouldValidate: true });

        setTimeout(() => {
            textarea.focus();
            const newCursorPos = start + formatted.length - cursorOffset;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const response: any = await BlogApi.getBlogById(id);
                reset({
                    title: response.data.title,
                    content: response.data.content
                });
            } catch (err) {
                toast.error("Failed to fetch blog for edit.");
                navigate('/blogs');
            } finally {
                setFetching(false);
            }
        };
        fetchBlog();
    }, [id, navigate, reset]);

    const onSubmit = async (data: BlogFormValues) => {
        try {
            if (isEditMode) {
                await BlogApi.updateBlog(id, data);
                toast.success('Blog updated successfully!');
                navigate(`/post/${id}`);
            } else {
                const response: any = await BlogApi.createBlog(data);
                toast.success('Blog published successfully!');
                navigate(`/post/${response.data.id}`);
            }
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to save blog post.');
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex flex-col">
                <TopNavBar />
                <main className="flex-grow flex justify-center items-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />
            <main className="flex-grow w-full max-w-[720px] mx-auto px-gutter py-xl flex flex-col gap-lg">
                <header>
                    <h1 className="font-headline-xl text-on-surface dark:text-white">{isEditMode ? 'Edit Post' : 'Draft a new post'}</h1>
                    <p className="font-body-lg text-on-surface-variant dark:text-slate-400">Share your insights with the community.</p>
                </header>
                <form className="flex flex-col gap-lg bg-surface-container dark:bg-slate-900 rounded-xl p-md border border-outline-variant/20 dark:border-slate-800 shadow-xl dark:shadow-none" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex items-center gap-sm pb-sm border-b border-outline-variant/20 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center text-lg font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div><p className="font-label-md text-slate-800 dark:text-slate-200">{user?.username || 'User'}</p><p className="text-label-sm text-on-surface-variant dark:text-slate-400">Author</p></div>
                    </div>
                    <div>
                        <input 
                            className={`w-full bg-transparent border-none text-headline-lg dark:text-white focus:ring-0 px-0 outline-none placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-500 ${errors.title ? 'text-error' : ''}`} 
                            placeholder="Blog Title..." 
                            {...register('title')}
                        />
                        {errors.title && <p className="text-error text-label-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div className="flex flex-col rounded-lg border border-outline-variant/30 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden">
                        <div className="flex items-center gap-xs p-2 bg-surface-container-high dark:bg-slate-900 border-b dark:border-slate-800">
                            {['format_bold', 'format_italic', 'format_h1', 'format_h2', 'link', 'image', 'code'].map(tool => (
                                <button 
                                    type="button" 
                                    key={tool} 
                                    onClick={() => handleFormat(tool)}
                                    className="editor-tool p-2 rounded flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-surface-variant dark:hover:bg-slate-800 hover:text-primary dark:hover:text-indigo-400 transition-all"
                                >
                                    <span className="material-symbols-outlined text-[20px]">{tool}</span>
                                </button>
                            ))}
                        </div>
                        <textarea 
                            className="w-full min-h-[400px] bg-transparent border-none outline-none focus:ring-0 p-md resize-none text-slate-800 dark:text-slate-100 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-500" 
                            placeholder="Write your content here..." 
                            {...contentRegister}
                            ref={(e) => {
                                contentRef(e);
                                textareaRef.current = e;
                            }}
                        />
                        {errors.content && <p className="text-error text-label-sm px-md pb-md">{errors.content.message}</p>}
                    </div>
                    <div className="flex justify-end mt-auto">
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-on-primary px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50 hover:brightness-110 transition-all">
                            <span className="material-symbols-outlined text-[20px]">{isEditMode ? 'save' : 'publish'}</span> 
                            {isSubmitting ? (isEditMode ? 'Saving...' : 'Publishing...') : (isEditMode ? 'Save Changes' : 'Publish Blog')}
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
};

export default CreateBlogPage;
