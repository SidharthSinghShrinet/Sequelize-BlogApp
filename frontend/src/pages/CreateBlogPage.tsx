import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { BlogApi, ApiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

const toolTitles: Record<string, string> = {
    'format_bold': 'Bold',
    'format_italic': 'Italic',
    'format_h1': 'Heading 1 (H1)',
    'format_h2': 'Heading 2 (H2)',
    'link': 'Insert Link',
    'image': 'Insert Web Image URL',
    'upload': 'Upload Local Image',
    'code': 'Code Block'
};

const blogSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const CreateBlogPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    
    const [fetching, setFetching] = useState(!!id);
    const isEditMode = !!id;

    const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: { title: '', content: '' }
    });

    // Register content field programmatically for React Hook Form
    useEffect(() => {
        register('content');
    }, [register]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TiptapLink.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary dark:text-indigo-400 underline cursor-pointer',
                },
            }),
            TiptapImage.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full my-4 shadow-md border dark:border-slate-800',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write your content here...',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[400px]',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setValue('content', html === '<p></p>' ? '' : html, { shouldDirty: true, shouldValidate: true });
        },
    });

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const response: any = await BlogApi.getBlogById(id);
                reset({
                    title: response.data.title,
                    content: response.data.content
                });
                if (editor) {
                    editor.commands.setContent(response.data.content);
                }
            } catch (err) {
                toast.error("Failed to fetch blog for edit.");
                navigate('/blogs');
            } finally {
                setFetching(false);
            }
        };
        fetchBlog();
    }, [id, navigate, reset, editor]);

    const handleFormat = (type: string) => {
        if (!editor) return;

        switch (type) {
            case 'format_bold':
                editor.chain().focus().toggleBold().run();
                break;
            case 'format_italic':
                editor.chain().focus().toggleItalic().run();
                break;
            case 'format_h1':
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                break;
            case 'format_h2':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
            case 'link': {
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run();
                } else {
                    const { from, to } = editor.state.selection;
                    const isRangeEmpty = from === to;

                    if (isRangeEmpty) {
                        const url = window.prompt('Enter URL:');
                        if (url && url.trim()) {
                            const text = window.prompt('Enter link text:', url);
                            if (text && text.trim()) {
                                editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
                            }
                        }
                    } else {
                        const url = window.prompt('Enter URL:');
                        if (url && url.trim()) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }
                }
                break;
            }
            case 'image': {
                const imageUrl = window.prompt('Enter image URL:');
                if (imageUrl && imageUrl.trim()) {
                    const altText = window.prompt('Enter image Alt Text (optional):') || '';
                    editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
                }
                break;
            }
            case 'upload': {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === 'string') {
                                const altText = window.prompt('Enter image Alt Text (optional):') || '';
                                editor.chain().focus().setImage({ src: reader.result, alt: altText }).run();
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
                break;
            }
            case 'code':
                editor.chain().focus().toggleCodeBlock().run();
                break;
            default:
                break;
        }
    };

    const isFormatActive = (type: string) => {
        if (!editor) return false;
        switch (type) {
            case 'format_bold':
                return editor.isActive('bold');
            case 'format_italic':
                return editor.isActive('italic');
            case 'format_h1':
                return editor.isActive('heading', { level: 1 });
            case 'format_h2':
                return editor.isActive('heading', { level: 2 });
            case 'link':
                return editor.isActive('link');
            case 'image':
                return editor.isActive('image');
            case 'upload':
                return false;
            case 'code':
                return editor.isActive('codeBlock');
            default:
                return false;
        }
    };

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
                            {['format_bold', 'format_italic', 'format_h1', 'format_h2', 'link', 'image', 'upload', 'code'].map(tool => {
                                const active = isFormatActive(tool);
                                return (
                                    <button 
                                        type="button" 
                                        key={tool} 
                                        onClick={() => handleFormat(tool)}
                                        title={toolTitles[tool] || ''}
                                        className={`p-2 rounded flex items-center justify-center transition-all ${
                                            active 
                                                ? 'bg-primary/20 text-primary dark:text-indigo-400' 
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-surface-variant dark:hover:bg-slate-800 hover:text-primary dark:hover:text-indigo-400'
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-[20px]">{tool}</span>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-on-surface-variant/50 dark:placeholder:text-slate-500 relative">
                            {editor && (
                                <BubbleMenu 
                                    editor={editor} 
                                    shouldShow={({ editor }) => editor.isActive('image')}
                                    tippyOptions={{ duration: 150 }}
                                    className="flex bg-slate-900 dark:bg-slate-800 border border-slate-700 dark:border-slate-700 rounded-lg overflow-hidden shadow-lg p-1"
                                >
                                    <button 
                                        type="button"
                                        onClick={() => editor.chain().focus().deleteSelection().run()}
                                        className="px-2.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                        Delete Image
                                    </button>
                                </BubbleMenu>
                            )}
                            <EditorContent editor={editor} />
                        </div>
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
