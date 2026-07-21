import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const TopNavBar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
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
        setIsMobileMenuOpen(false);
        await logout();
        navigate('/login');
    };

    return (
        <header className="bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
            <div className="flex justify-between items-center h-20 px-4 md:px-gutter max-w-container-max mx-auto">
                {/* Brand Logo */}
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center shrink-0">
                    <Logo fontSize="text-xl sm:text-2xl" />
                </Link>

                {/* Desktop Navigation Links */}
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
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full" />
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
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                    <NavLink 
                        to="/projects" 
                        className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-all font-semibold ${
                            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span>Project Hub</span>
                                {isActive && (
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-all font-semibold ${
                            isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                        }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span>About</span>
                                {isActive && (
                                    <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>
                    {user && (
                        <NavLink 
                            to="/library" 
                            className={({ isActive }) => `relative flex items-center h-full text-[15px] transition-all font-semibold ${
                                isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                            }`}
                        >
                            {({ isActive }) => (
                                <>
                                    <span>Library</span>
                                    {isActive && (
                                        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-primary rounded-full" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    )}
                </nav>

                {/* Right side Actions */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle theme"
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {darkMode ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    {/* Desktop User Actions */}
                    <div className="hidden sm:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4 border-l border-slate-100 dark:border-slate-800 pl-4 md:pl-6">
                                <Link 
                                    to="/create" 
                                    className="flex items-center gap-1.5 bg-primary text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md hover:brightness-105 transition-all shrink-0"
                                >
                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                    <span>Create Blog</span>
                                </Link>
                                
                                <Link to="/profile" className="flex items-center gap-2 group hover:opacity-85 transition-opacity shrink-0">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 dark:bg-slate-800 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-primary uppercase select-none">
                                        {user.profileImage ? (
                                            <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            user.username.charAt(0)
                                        )}
                                    </div>
                                    <div className="hidden lg:flex flex-col">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none group-hover:text-primary transition-colors">{user.username}</span>
                                        <span className="text-[10px] text-slate-400 mt-1 leading-none font-medium">View Profile</span>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className="text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors text-sm font-semibold px-2 py-1"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        <span className="material-symbols-outlined text-[26px]">
                            {isMobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-200">
                    <nav className="flex flex-col gap-2">
                        <NavLink 
                            to="/" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                isActive ? 'bg-primary/10 text-primary dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }`}
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            to="/blogs" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                isActive ? 'bg-primary/10 text-primary dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }`}
                        >
                            Explore Articles
                        </NavLink>
                        <NavLink 
                            to="/projects" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                isActive ? 'bg-primary/10 text-primary dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }`}
                        >
                            Project Hub
                        </NavLink>
                        <NavLink 
                            to="/about" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                isActive ? 'bg-primary/10 text-primary dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                            }`}
                        >
                            About
                        </NavLink>
                        {user && (
                            <NavLink 
                                to="/library" 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => `px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                    isActive ? 'bg-primary/10 text-primary dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                                }`}
                            >
                                Library & Bookmarks
                            </NavLink>
                        )}
                    </nav>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link 
                                    to="/create" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-sm font-bold shadow-md"
                                >
                                    <span className="material-symbols-outlined text-sm">edit_square</span>
                                    Create New Blog
                                </Link>
                                <div className="flex items-center justify-between px-2 pt-2">
                                    <Link 
                                        to="/profile" 
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-9 h-9 rounded-full overflow-hidden bg-primary text-white flex items-center justify-center font-bold text-sm">
                                            {user.profileImage ? (
                                                <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                                            ) : (
                                                user.username.charAt(0)
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.username}</span>
                                    </Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-xs font-bold text-rose-500 hover:text-rose-600 px-3 py-1.5 rounded-lg border border-rose-100 dark:border-rose-950"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <Link 
                                    to="/login" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2.5 text-center rounded-xl text-sm font-bold border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="py-2.5 text-center rounded-xl text-sm font-bold bg-primary text-white shadow-sm"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default TopNavBar;
