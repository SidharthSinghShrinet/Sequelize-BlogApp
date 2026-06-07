import React from 'react';
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
        <div className="min-h-screen flex bg-background dark:bg-slate-950 transition-colors duration-300">
            {/* Left Decorative/Branding Sidebar - Visible on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative dark:bg-slate-950 transition-colors duration-300">
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
                    <div className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-8">
                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">mail</span>
                                    <input
                                        className={`input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none ${errors.email ? 'border-error focus:ring-error' : ''}`}
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && <p className="text-error text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    <a href="#" className="text-xs text-primary dark:text-indigo-400 font-bold hover:underline transition-all">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">lock</span>
                                    <input
                                        className={`input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none ${errors.password ? 'border-error focus:ring-error' : ''}`}
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && <p className="text-error text-xs mt-1.5 font-medium">{errors.password.message}</p>}
                            </div>

                            <div className="flex items-center">
                                <input type="checkbox" id="remember" className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-800 text-primary dark:bg-slate-950 focus:ring-primary/20 cursor-pointer" />
                                <label htmlFor="remember" className="ml-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer font-medium select-none">Remember this device</label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
