import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const TopNavBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-center h-20 px-gutter max-w-container-max mx-auto">
                {/* Brand Logo */}
                <Link to="/" className="flex items-center shrink-0">
                    <Logo fontSize="text-2xl" />
                </Link>

                {/* Navigation Links with centered active line indicators */}
                <nav className="hidden md:flex items-center gap-8 h-full">
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-all font-semibold ${
                            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span>Home</span>
                                {isActive && (
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full animate-[scaleX_0.2s_ease-out]" />
                                )}
                            </>
                        )}
                    </NavLink>
                    <NavLink 
                        to="/blogs" 
                        className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-all font-semibold ${
                            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span>Explore</span>
                                {isActive && (
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full animate-[scaleX_0.2s_ease-out]" />
                                )}
                            </>
                        )}
                    </NavLink>
                    <a href="#" className="text-[15px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Categories</a>
                    <a href="#" className="text-[15px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">About</a>
                </nav>

                {/* Right side Actions */}
                <div className="flex items-center gap-6">
                    {/* Search & Theme Toggle Icons */}
                    <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                        <button className="hover:text-primary transition-colors focus:outline-none flex items-center">
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>
                        <button 
                            onClick={() => setDarkMode(!darkMode)}
                            className="hover:text-primary transition-colors focus:outline-none flex items-center"
                            aria-label="Toggle theme"
                        >
                            <span className="material-symbols-outlined text-[22px]">
                                {darkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>
                    </div>

                    {user ? (
                        <div className="flex items-center gap-4 border-l border-slate-100 dark:border-slate-800 pl-6">
                            <Link 
                                to="/create" 
                                className="flex items-center gap-1.5 bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:brightness-105 active:scale-[0.98] transition-all"
                            >
                                <span className="material-symbols-outlined text-sm">edit_square</span>
                                Create Blog
                            </Link>
                            
                            <Link to="/profile" className="flex items-center gap-2.5 group hover:opacity-85 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-primary uppercase select-none group-hover:border-primary">
                                    {user.username.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none group-hover:text-primary transition-colors">{user.username}</span>
                                    <span className="text-[10px] text-slate-400 mt-1 leading-none font-medium">View Profile</span>
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/login" 
                                className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors text-[15px] font-semibold"
                            >
                                Log in
                            </Link>
                            <Link 
                                to="/register" 
                                className="bg-primary text-white px-5 py-2.5 rounded-lg text-[15px] font-semibold hover:bg-primary/95 transition-all shadow-sm"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopNavBar;
