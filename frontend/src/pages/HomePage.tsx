import React from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';
import { useAllBlogs, getBlogImageUrl, calculateReadingTime } from '../hooks/useBlogs';
import { Carousel } from 'antd';

const HomePage = () => {
    const { blogs, loading } = useAllBlogs();

    // Mock blogs to match developer, creator, educator, and technical learning enthusiast theme
    const defaultFeaturedBlogs = [
        {
            id: 1,
            tag: 'TYPESCRIPT',
            title: '5 Advanced TypeScript Patterns for Technical Creators',
            content: 'Level up your type safety with conditional types, template literal types, mapped types, and custom utility signatures.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
            author: 'Alex Morgan',
            date: 'May 12, 2024',
            readTime: '5 min read'
        },
        {
            id: 2,
            tag: 'TEACHING',
            title: 'How to Structure Learning Paths for Software Engineering',
            content: 'Best practices for teachers and mentors designing interactive code challenges, sandbox labs, and visual learning aids.',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
            author: 'Sara Khan',
            date: 'May 8, 2024',
            readTime: '6 min read'
        },
        {
            id: 3,
            tag: 'DEV-OPS',
            title: 'High-Performance Docker Layouts for Web Applications',
            content: 'A practical guide to multi-stage builds, custom package caching, and shrinking production image sizes by over 90%.',
            image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&auto=format&fit=crop&q=80',
            author: 'James Lee',
            date: 'May 5, 2024',
            readTime: '4 min read'
        }
    ];

    // Use live database blogs if they exist, otherwise use the matching reference blogs
    const displayBlogs = blogs.length >= 3 
        ? blogs.slice(0, 3).map((b, i) => ({
            id: b.id,
            tag: i === 0 ? 'TYPESCRIPT' : i === 1 ? 'TEACHING' : 'DEV-OPS',
            title: b.title,
            content: b.content.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...',
            image: getBlogImageUrl(b.content, b.title, b.id, b.thumbnail),
            author: b.authorDetails?.username || 'Writer',
            date: new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: `${calculateReadingTime(b.content)} min read`
        }))
        : defaultFeaturedBlogs;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />
            
            <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-12 md:py-20">
                {/* Tech grid overlay decoration */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_10%,transparent_80%)] opacity-[0.03] dark:opacity-[0.15] pointer-events-none z-0" />

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 relative z-10">
                    {/* Left Column: Headline & Content */}
                    <div className="lg:col-span-5 flex flex-col gap-6 relative z-10">
                        <div className="flex flex-col">
                            <h1 className="text-6xl md:text-7xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                                Write.
                            </h1>
                            <h1 className="text-6xl md:text-7xl font-bold font-serif tracking-tight text-slate-900 dark:text-white leading-[1.05]">
                                Share.
                            </h1>
                            <h1 className="text-6xl md:text-7xl font-bold font-serif tracking-tight text-primary leading-[1.05]">
                                Showoff.
                            </h1>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-[420px]">
                            Showoff is a publishing hub designed for developers, creators, teachers, and technical learning enthusiasts. Share deep dives and track breakthroughs.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <Link 
                                to="/create" 
                                className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-[15px] shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all"
                            >
                                Start Writing
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                            </Link>
                            <Link 
                                to="/blogs" 
                                className="border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-6 py-3.5 rounded-xl font-bold text-[15px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                            >
                                Explore Blogs
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Hero Mockup Carousel + SVG squiggles */}
                    <div className="lg:col-span-7 relative w-full max-w-[620px] mx-auto z-10">
                        {/* Purple star/sparks details */}
                        <div className="absolute -top-10 -left-6 text-primary opacity-60 z-0">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />
                            </svg>
                        </div>

                        {/* Underlay curve details */}
                        <div className="absolute -bottom-8 -right-4 text-primary opacity-40 z-0">
                            <svg className="w-48 h-12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 100 20">
                                <path d="M0 10 Q25 20, 50 10 T100 10" strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* Carousel Wrapper */}
                        <div className="w-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 z-10 bg-slate-50 dark:bg-slate-900">
                            <Carousel autoplay effect="fade" speed={800} autoplaySpeed={2500} className="hero-carousel">
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_mockup.png" 
                                        alt="ShowOff Platform Dashboard" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Interactive Platform</span>
                                        <h3 className="text-lg font-bold text-white">ShowOff Blog Portal</h3>
                                        <p className="text-slate-300 text-xs font-medium">Read and share ideas with developers, creators, and teachers.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_code_mockup.png" 
                                        alt="VS Code Markdown Editor" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-purple-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Markdown Editor</span>
                                        <h3 className="text-lg font-bold text-white">Syntax Highlighted Writing</h3>
                                        <p className="text-slate-300 text-xs font-medium">Write clean Technical Markdown articles inside a built-in development editor.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_community_mockup.png" 
                                        alt="Community Discussions" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-amber-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Community Portal</span>
                                        <h3 className="text-lg font-bold text-white">Engage and Discuss</h3>
                                        <p className="text-slate-300 text-xs font-medium">Participate in comment threads with rich reactions and developer avatars.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_search_mockup.png" 
                                        alt="Search and Category Filters" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-sky-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Search & Filtering</span>
                                        <h3 className="text-lg font-bold text-white">Intelligent Exploration</h3>
                                        <p className="text-slate-300 text-xs font-medium">Discover relevant blogs using instant search and dynamic tag categories.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_dark_mockup.png" 
                                        alt="ShowOff Dark Mode Layout" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Premium Interface</span>
                                        <h3 className="text-lg font-bold text-white">Seamless Dark Mode</h3>
                                        <p className="text-slate-300 text-xs font-medium">Rest your eyes with a stunning, high-contrast dark theme optimized for coding.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_mobile_mockup.png" 
                                        alt="Mobile Responsive Design" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-rose-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Responsive Design</span>
                                        <h3 className="text-lg font-bold text-white">Publish Anywhere</h3>
                                        <p className="text-slate-300 text-xs font-medium">Enjoy a fully responsive reading and writing flow on mobile screen widths.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_profile_mockup.png" 
                                        alt="Blogger Stats Analytics Dashboard" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-emerald-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Performance Tracking</span>
                                        <h3 className="text-lg font-bold text-white">Blogger Analytics Dashboard</h3>
                                        <p className="text-slate-300 text-xs font-medium">Track reading time statistics, article views, and publication traffic.</p>
                                    </div>
                                </div>
                                <div className="relative group overflow-hidden">
                                    <img 
                                        src="/hero_collab_mockup.png" 
                                        alt="Collaborative Editing Workspace" 
                                        className="w-full h-auto object-cover aspect-[4/3] object-top"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-6 text-white flex flex-col gap-1">
                                        <span className="bg-teal-600 px-3 py-1 rounded-full text-xs font-semibold self-start tracking-wider uppercase text-white">Team Collaboration</span>
                                        <h3 className="text-lg font-bold text-white">Shared Editing Spaces</h3>
                                        <p className="text-slate-300 text-xs font-medium">Manage publications collaboratively with other creators and co-authors.</p>
                                    </div>
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </div>

                {/* Featured Posts Title Header */}
                <div className="flex justify-between items-end mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Posts</h2>
                    <Link to="/blogs" className="text-primary hover:text-primary/90 font-semibold text-[15px] flex items-center gap-1">
                        View all posts
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </Link>
                </div>

                {/* 3-Column Posts Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayBlogs.map((post) => (
                            <Link 
                                to={`/post/${post.id}`} 
                                key={post.id} 
                                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
                            >
                                {/* Card Image */}
                                <div className="h-56 overflow-hidden relative">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex flex-col flex-grow">
                                    {/* Tag */}
                                    <span className="text-xs font-bold tracking-wider text-primary mb-3.5 block uppercase">
                                        {post.tag}
                                    </span>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors duration-300 mb-2.5 line-clamp-2 leading-snug">
                                        {post.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {post.content}
                                    </p>

                                    {/* Author Info Footer */}
                                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/60">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                                            {post.author.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">{post.author}</span>
                                            <span className="text-[10px] text-slate-400 mt-1 font-medium">
                                                {post.date} &bull; {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;
