import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserApi, ApiError } from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import Logo from '../components/Logo';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate();
    const [strength, setStrength] = useState(0);
    
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const passwordValue = watch('password', '');

    useEffect(() => {
        let s = 0;
        if (passwordValue.length > 0) s += 25;
        if (passwordValue.length >= 8) s += 25;
        if (/[A-Z]/.test(passwordValue)) s += 25;
        if (/[0-9]/.test(passwordValue)) s += 25;
        setStrength(s);
    }, [passwordValue]);

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await UserApi.register(data);
            toast.success('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex bg-background dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
            {/* Left Decorative/Branding Sidebar - Visible on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 z-0" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] z-0" />
                <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] z-0 animate-pulse" />
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 z-0" />

                {/* Content */}
                <div className="relative z-10 max-w-md px-12 text-white flex flex-col gap-8">
                    <div>
                        <Logo fontSize="text-4xl" textColor="text-white" className="mb-4" />
                        <p className="text-slate-400 text-lg">
                            Create an account to join the premier network for developers and creative writers. Let's show off your next breakthrough.
                        </p>
                    </div>
                    
                    <div className="border-t border-slate-800 pt-8 flex flex-col gap-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">edit_note</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">Interactive Editor</h4>
                                <p className="text-slate-400 text-sm mt-1">Compose stories, customize categories, and publish instantly.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-xl">thumb_up</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-200">Reactions & Engagement</h4>
                                <p className="text-slate-400 text-sm mt-1">Receive direct feedback, stats, and interact with tech-minded individuals.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800">
                        <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/30 rounded-xl p-5">
                            <p className="text-slate-300 italic text-sm leading-relaxed">
                                "ShowOff has completely transformed how I document my learning progress. The interface is clean, developer-focused, and exceptionally quick."
                            </p>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">SM</div>
                                <div>
                                    <h5 className="text-xs font-bold text-white">Sarah Miller</h5>
                                    <p className="text-[10px] text-slate-500">Developer Advocate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Form Container - Vertically Centered & No scrollbar */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden dark:bg-slate-950 transition-colors duration-300">
                <div className="lg:hidden absolute top-10 right-10 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -z-10" />
                
                <div className="w-full max-w-[420px] flex flex-col">
                    {/* Top Logo for Mobile */}
                    <div className="lg:hidden flex justify-center mb-6">
                        <Logo fontSize="text-3xl" />
                    </div>

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-on-background dark:text-white">Create your account</h2>
                        <p className="text-on-surface-variant dark:text-slate-400 mt-2 text-sm">Join the community and get started today.</p>
                    </div>

                    {/* Register Card */}
                    <div className="bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-8">
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            {/* Profile Photo Upload View - Compact */}
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 relative group shadow-sm">
                                    <img 
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUNHq_xXDP1wNTqjouWd8VMCso0okNtVnjEvBdLgHpKAlD9W1YjBD49kpo2V5OdzV4NiAzZOylM6EaOVOEDMA-MIp29MK-axzVFsR14nMiEATIIMWPqosLuVBHNDj_OAg8oCfpcoZy7d7efIoOPxCVTjdUi4Kzln43AXcU7Dz3uL2-lCW9VNjeBTZtApiHlA7HuSn9xbZIbsDRK---tOa8aNSw4WHTARRoTK8U6U3UAxNGzn0BgixJXKFdF6qvPUd4C4VWIf35vxg" 
                                        alt="Preview" 
                                        className="w-full h-full object-cover" 
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="material-symbols-outlined text-white text-xs">add_a_photo</span>
                                    </div>
                                </div>
                                <span className="mt-1.5 text-primary dark:text-indigo-400 text-[10px] cursor-pointer font-bold tracking-wider hover:brightness-110 transition-all uppercase">Upload Avatar</span>
                            </div>

                            {/* Username Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">person</span>
                                    <input 
                                        className={`input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none ${errors.username ? 'border-error focus:ring-error' : ''}`} 
                                        placeholder="johndoe" 
                                        {...register('username')} 
                                    />
                                </div>
                                {errors.username && <p className="text-error text-xs mt-1.5 font-medium">{errors.username.message}</p>}
                            </div>

                            {/* Email address */}
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

                            {/* Phone Number Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">call</span>
                                    <input 
                                        className={`input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none ${errors.phoneNumber ? 'border-error focus:ring-error' : ''}`} 
                                        type="tel" 
                                        placeholder="10-digit number" 
                                        maxLength={10} 
                                        {...register('phoneNumber')} 
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-error text-xs mt-1.5 font-medium">{errors.phoneNumber.message}</p>}
                            </div>

                            {/* Password Input with Strength Meter */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
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
                                
                                <div className="mt-2.5 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold min-w-[50px] text-slate-400 dark:text-slate-500 tracking-wider">
                                        {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary dark:text-indigo-400 font-bold hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
