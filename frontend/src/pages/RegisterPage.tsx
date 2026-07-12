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
    const [showPassword, setShowPassword] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAUNHq_xXDP1wNTqjouWd8VMCso0okNtVnjEvBdLgHpKAlD9W1YjBD49kpo2V5OdzV4NiAzZOylM6EaOVOEDMA-MIp29MK-axzVFsR14nMiEATIIMWPqosLuVBHNDj_OAg8oCfpcoZy7d7efIoOPxCVTjdUi4Kzln43AXcU7Dz3uL2-lCW9VNjeBTZtApiHlA7HuSn9xbZIbsDRK---tOa8aNSw4WHTARRoTK8U6U3UAxNGzn0BgixJXKFdF6qvPUd4C4VWIf35vxg"
    );

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

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('email', data.email);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('password', data.password);
            if (avatarFile) {
                formData.append('profileImage', avatarFile);
            }

            await UserApi.register(formData);
            toast.success('Account created successfully! Please sign in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-background dark:bg-slate-950 transition-colors duration-300">
            {/* Left Decorative/Branding Sidebar - Visible on Desktop */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-slate-900 justify-center items-center">
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
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 h-full overflow-y-auto relative dark:bg-slate-950 transition-colors duration-300">
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
                    <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-5 md:p-6">
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            {/* Profile Photo Upload View - Compact Horizontal Layout */}
                            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800/40">
                                <div
                                    onClick={() => document.getElementById('avatarInput')?.click()}
                                    className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-955 relative group shadow-sm shrink-0 cursor-pointer"
                                >
                                    <img
                                        src={avatarPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-white text-[14px]">add_a_photo</span>
                                    </div>
                                </div>
                                <div className="flex flex-col text-left">
                                    <span
                                        onClick={() => document.getElementById('avatarInput')?.click()}
                                        className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors"
                                    >
                                        Profile Picture
                                    </span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">Upload a custom developer avatar</span>
                                </div>
                                <input
                                    type="file"
                                    id="avatarInput"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>

                            {/* Username Input */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    Username
                                </label>
                                <input
                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.username
                                        ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900'
                                        : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                        }`}
                                    placeholder="johndoe"
                                    {...register('username')}
                                />
                                {errors.username && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.username.message}</p>}
                            </div>

                            {/* Phone Number Input */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-555 dark:text-slate-400">
                                    Phone Number
                                </label>
                                <input
                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm ring-offset-background placeholder:text-slate-555 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.phoneNumber
                                        ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900'
                                        : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                        }`}
                                    type="tel"
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    {...register('phoneNumber')}
                                />
                                {errors.phoneNumber && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.phoneNumber.message}</p>}
                            </div>

                            {/* Email address */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    Email address
                                </label>
                                <input
                                    className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email
                                        ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900'
                                        : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                        }`}
                                    type="email"
                                    placeholder="name@example.com"
                                    {...register('email')}
                                />
                                {errors.email && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.email.message}</p>}
                            </div>

                            {/* Password Input with Strength Meter */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        className={`flex h-9 w-full rounded-md border bg-transparent pl-3 pr-10 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.password
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

                                <div className="mt-2 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-300"
                                            style={{ width: `${strength}%` }}
                                        />
                                    </div>
                                    <span className="text-[9px] uppercase font-bold min-w-[50px] text-slate-400 dark:text-slate-500 tracking-wider">
                                        {strength <= 25 ? 'Weak' : strength <= 50 ? 'Fair' : strength <= 75 ? 'Good' : 'Strong'}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-1 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 w-full mt-3"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <span className="material-symbols-outlined text-sm ml-1.5">arrow_forward</span>
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
