import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            await login(data);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-background dark:bg-slate-950 transition-colors duration-300">
            {/* Left Decorative/Branding Sidebar - Visible on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-slate-900 justify-center items-center">
                {/* Decorative background gradients */}
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 z-0" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] z-0 animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] z-0" />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 z-0" />

                {/* Content */}
                <div className="relative z-10 max-w-md px-12 text-white flex flex-col gap-8">
                    <div>
                        <Logo fontSize="text-4xl" textColor="text-white" className="mb-4" />
                        <p className="text-slate-400 text-lg">
                            The ultimate space for sharing insights, showing off your developer journey, and discovering stellar tech content.
                        </p>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col gap-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">speed</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">Blazing Fast Experience</h4>
                                <p className="text-slate-400 text-sm mt-1">Read and write articles with absolute ease using a polished, intuitive editor layout.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">groups</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">Creative Community</h4>
                                <p className="text-slate-400 text-sm mt-1">Connect with developers, designers, and creators from around the globe.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-xl p-5">
                            <p className="text-slate-300 italic text-sm">
                                "ShowOff has completely transformed how I document my learning progress. The interface is clean, developer-focused, and exceptionally quick."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">JD</div>
                                <div>
                                    <h5 className="text-xs font-bold text-white">John Doe</h5>
                                    <p className="text-[10px] text-slate-500">Software Engineer</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 h-full overflow-y-auto relative dark:bg-slate-950 transition-colors duration-300">
                {/* Micro background blob on mobile */}
                <div className="lg:hidden absolute top-10 left-10 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -z-10" />

                <div className="w-full max-w-[420px] flex flex-col">
                    {/* Top Logo for Mobile */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <Logo fontSize="text-3xl" />
                    </div>

                    <div className="mb-8 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-on-background dark:text-white">Welcome back</h2>
                        <p className="text-on-surface-variant dark:text-slate-400 mt-2 text-sm">Please enter your credentials to log in.</p>
                    </div>

                    {/* Login Card */}
                    <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-5 md:p-6">
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    Email address
                                </label>
                                <input
                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                        errors.email 
                                            ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900' 
                                            : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                    }`}
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 hover:underline transition-colors font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        className={`flex h-9 w-full rounded-md border bg-transparent pl-3 pr-10 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            errors.password 
                                                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900' 
                                                : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                        }`}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center space-x-2 pt-1">
                                <input 
                                    type="checkbox" 
                                    id="remember" 
                                    className="h-4 w-4 rounded border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 focus:ring-slate-950 focus:ring-offset-2 dark:bg-slate-955 cursor-pointer" 
                                />
                                <label htmlFor="remember" className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer font-medium select-none">
                                    Remember this device
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 w-full mt-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary dark:text-indigo-400 font-bold hover:underline transition-all">
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
