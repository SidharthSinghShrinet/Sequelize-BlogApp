import { useState, useEffect } from 'react';
import { BlogApi } from '../api/client';
import toast from 'react-hot-toast';

export const useAllBlogs = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response: any = await BlogApi.getAllBlogs({ all: true });
                setBlogs(response.data);
            } catch (err) {
                toast.error("Failed to fetch blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return { blogs, loading };
};

export const usePaginatedBlogs = (options: { page: number; limit: number; search?: string; category?: string }) => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [pagination, setPagination] = useState<any>({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        limit: 9
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page: options.page,
                    limit: options.limit
                };
                if (options.search) params.search = options.search;
                if (options.category) params.category = options.category;

                const response: any = await BlogApi.getAllBlogs(params);
                setBlogs(response.data.blogs || []);
                setPagination(response.data.pagination || {
                    totalItems: 0,
                    totalPages: 1,
                    currentPage: 1,
                    limit: 9
                });
            } catch (err) {
                toast.error("Failed to fetch blogs.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [options.page, options.limit, options.search, options.category]);

    return { blogs, pagination, loading };
};

export const useCategoryCounts = () => {
    const [counts, setCounts] = useState<Record<string, number>>({
        frontend: 0,
        backend: 0,
        databases: 0,
        devops: 0,
        ai: 0,
        general: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response: any = await BlogApi.getCategoryCounts();
                setCounts(response.data);
            } catch (err) {
                console.error("Failed to fetch category counts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCounts();
    }, []);

    return { counts, loading };
};

export const useBlog = (id: string | undefined) => {
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [likesCount, setLikesCount] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) return;
            try {
                const response: any = await BlogApi.getBlogById(id);
                setBlog(response.data);
                setLikesCount(response.data?.likesCount || 0);
                setIsLiked(!!response.data?.isLikedByMe);
            } catch (err: any) {
                setError(err);
                toast.error("Failed to fetch blog.");
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const toggleLike = async () => {
        if (!id) return;
        const prevCount = likesCount;
        const prevIsLiked = isLiked;

        // Optimistic update
        const newIsLiked = !isLiked;
        const newCount = newIsLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
        setIsLiked(newIsLiked);
        setLikesCount(newCount);

        try {
            const response: any = await BlogApi.toggleLike(id);
            if (response.success) {
                setIsLiked(response.data.liked);
                setLikesCount(response.data.likesCount);
            }
        } catch (err: any) {
            // Revert on error
            setIsLiked(prevIsLiked);
            setLikesCount(prevCount);
            toast.error(err?.message || "Failed to update like status.");
        }
    };

    return { blog, loading, error, likesCount, isLiked, toggleLike, setLikesCount, setIsLiked };
};

export const generateSvgThumbnail = (title: string, content: string) => {
    // Clean up text
    const cleanTitle = title.replace(/["<>]/g, '').substring(0, 60);
    const cleanSummary = content.replace(/<[^>]*>?/gm, '').replace(/["<>]/g, '').substring(0, 100) + '...';
    
    // Choose a beautiful gradient based on title characters
    const gradients = [
        { from: '#6366f1', to: '#a855f7' }, // Indigo to Purple
        { from: '#3b82f6', to: '#06b6d4' }, // Blue to Cyan
        { from: '#ec4899', to: '#f43f5e' }, // Pink to Rose
        { from: '#10b981', to: '#3b82f6' }  // Emerald to Blue
    ];
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradient = gradients[hash % gradients.length];

    // Wrap title to lines
    const words = cleanTitle.split(' ');
    let line1 = '';
    let line2 = '';
    for (let i = 0; i < words.length; i++) {
        if ((line1 + words[i]).length < 24) {
            line1 += (line1 ? ' ' : '') + words[i];
        } else if ((line2 + words[i]).length < 24) {
            line2 += (line2 ? ' ' : '') + words[i];
        } else {
            line2 += '...';
            break;
        }
    }

    // Wrap summary to lines
    const summaryWords = cleanSummary.split(' ');
    let sLine1 = '';
    let sLine2 = '';
    for (let i = 0; i < summaryWords.length; i++) {
        if ((sLine1 + summaryWords[i]).length < 45) {
            sLine1 += (sLine1 ? ' ' : '') + summaryWords[i];
        } else if ((sLine2 + summaryWords[i]).length < 45) {
            sLine2 += (sLine2 ? ' ' : '') + summaryWords[i];
        } else {
            sLine2 += '...';
            break;
        }
    }

    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${gradient.from};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${gradient.to};stop-opacity:1" />
            </linearGradient>
            <style>
                .title { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 44px; font-weight: 800; fill: #ffffff; }
                .summary { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 22px; fill: rgba(255, 255, 255, 0.85); font-weight: 500; }
                .tag { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 800; fill: rgba(255, 255, 255, 0.6); letter-spacing: 2px; }
                .decor { fill: rgba(255, 255, 255, 0.08); font-family: monospace; font-weight: 900; }
            </style>
        </defs>
        <!-- Background -->
        <rect width="800" height="450" fill="url(#grad)" />
        
        <!-- Decorative Background Symbols -->
        <text x="630" y="390" font-size="200" class="decor">&lt;/&gt;</text>
        <text x="50" y="160" font-size="120" class="decor">{ }</text>
        
        <!-- Header Tag -->
        <text x="80" y="90" class="tag">SHOWOFF PUBLICATION</text>
        
        <!-- Title Lines -->
        <text x="80" y="165" class="title">${line1}</text>
        ${line2 ? `<text x="80" y="225" class="title">${line2}</text>` : ''}
        
        <!-- Line Divider -->
        <line x1="80" y1="270" x2="220" y2="270" stroke="rgba(255,255,255,0.4)" stroke-width="5" stroke-linecap="round" />
        
        <!-- Summary Lines -->
        <text x="80" y="325" class="summary">${sLine1}</text>
        ${sLine2 ? `<text x="80" y="365" class="summary">${sLine2}</text>` : ''}
    </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};

export const getBlogImageUrl = (content: string, title: string, id: number, thumbnail?: string) => {
    // 1. If a dedicated cover thumbnail exists, use it
    if (thumbnail) {
        return thumbnail;
    }
    // 2. Search for first <img> tag src using regex
    const imgRegex = /<img[^>]+src="([^">]+)"/i;
    const match = content.match(imgRegex);
    if (match && match[1]) {
        return match[1];
    }
    // 3. Generate dynamic thumbnail based on title and content
    return generateSvgThumbnail(title, content);
};

export const calculateReadingTime = (htmlContent: string): number => {
    if (!htmlContent) return 1;
    // Strip HTML tags to get pure text content
    const text = htmlContent.replace(/<[^>]*>/g, ' ');
    // Split by spaces to count words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    // Estimate reading time assuming 200 WPM (minimum of 1 minute)
    const wordsPerMinute = 200;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export interface CategoryInfo {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    keywords: string[];
}

export const CATEGORIES: CategoryInfo[] = [
    {
        id: 'frontend',
        name: 'Frontend Development',
        description: 'User interfaces, React, CSS styling, components, and client-side experiences.',
        icon: 'devices',
        color: 'from-blue-500 to-cyan-500',
        keywords: ['react', 'vue', 'angular', 'svelte', 'css', 'html', 'tailwind', 'flexbox', 'grid', 'frontend', 'ui', 'ux', 'components', 'responsive', 'dom', 'browser', 'javascript', 'typescript', 'hooks', 'state', 'usestate', 'useeffect']
    },
    {
        id: 'backend',
        name: 'Backend Services',
        description: 'Server logic, APIs, Bun & Node.js, authentication, and router controllers.',
        icon: 'terminal',
        color: 'from-indigo-500 to-purple-500',
        keywords: ['node', 'bun', 'express', 'koa', 'nest', 'api', 'backend', 'rest', 'graphql', 'router', 'controller', 'middleware', 'auth', 'jwt', 'session', 'token', 'server', 'http', 'websocket']
    },
    {
        id: 'databases',
        name: 'Database Architecture',
        description: 'Relational MySQL database models, Sequelize query execution, and schemas.',
        icon: 'database',
        color: 'from-emerald-500 to-teal-500',
        keywords: ['sequelize', 'mysql', 'postgres', 'postgresql', 'sqlite', 'mongodb', 'redis', 'nosql', 'sql', 'query', 'orm', 'migration', 'database', 'db', 'schema', 'transaction', 'indexing']
    },
    {
        id: 'devops',
        name: 'DevOps & Cloud',
        description: 'Cloudinary storage, automated cleanup cron jobs, and environment config.',
        icon: 'cloud_sync',
        color: 'from-amber-500 to-orange-500',
        keywords: ['cloudinary', 'cron', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'deploy', 'deployment', 'ci/cd', 'github actions', 'upload', 'purged', 'cleanup', 'automation', 'pipeline']
    },
    {
        id: 'ai',
        name: 'AI & Automation',
        description: 'Automatic cover design synthesis, prompt generation pipelines, and Flux models.',
        icon: 'psychology',
        color: 'from-rose-500 to-pink-500',
        keywords: ['ai', 'llm', 'mistral', 'pollinations', 'flux', 'prompt', 'image generation', 'cover art', 'artwork', 'gpt', 'openai', 'diffusion', 'generative', 'brief', 'artist']
    },
    {
        id: 'general',
        name: 'General Programming',
        description: 'Software design patterns, developer lifestyle, career insights, and algorithms.',
        icon: 'code',
        color: 'from-slate-500 to-slate-700',
        keywords: []
    }
];

export const getCategoryForBlog = (title: string, content: string): string => {
    const combinedText = `${title} ${content}`.toLowerCase();
    
    let bestCategory = 'general';
    let maxMatches = 0;
    
    for (const category of CATEGORIES) {
        if (category.id === 'general') continue;
        
        let matches = 0;
        for (const keyword of category.keywords) {
            if (combinedText.includes(keyword)) {
                matches++;
            }
        }
        
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = category.id;
        }
    }
    
    return bestCategory;
};
