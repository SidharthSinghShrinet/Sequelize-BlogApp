import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { UserApi, ApiError } from '../api/client';
import Logo from '../components/Logo';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        if (!token) {
            toast.error('Invalid request: Reset token is missing.');
            return;
        }
        try {
            await UserApi.resetPassword({
                token,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            toast.success('Password reset successfully! Please sign in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to reset password.');
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background dark:bg-slate-950 text-center">
                <span className="material-symbols-outlined text-4xl text-rose-500 mb-2">error</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Invalid Reset Link</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">The password reset link is invalid or missing a security token.</p>
                <Link to="/login" className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md">
                    Back to Log In
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen overflow-hidden flex bg-background dark:bg-slate-955 transition-colors duration-300">
            {/* Left Decorative/Branding Sidebar */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-slate-900 justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 z-0" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] z-0" />

                <div className="relative z-10 max-w-md px-12 text-white flex flex-col gap-6">
                    <div>
                        <Logo fontSize="text-4xl" textColor="text-white" className="mb-4" />
                        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Verify your credentials</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            Please select a strong password. It should contain at least 8 characters. Do not reuse old passwords to keep your developer credentials fully secure.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Form Container */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 h-full overflow-y-auto relative dark:bg-slate-950 transition-colors duration-300">
                <div className="w-full max-w-[420px] flex flex-col">
                    <div className="lg:hidden flex justify-center mb-6">
                        <Logo fontSize="text-3xl" />
                    </div>

                    <div className="mb-6 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold tracking-tight text-on-background dark:text-white">Create new password</h2>
                        <p className="text-on-surface-variant dark:text-slate-400 mt-2 text-sm">Please set your new password below.</p>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white text-slate-955 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 p-5 md:p-6">
                        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                            {/* Password Input */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    New Password
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
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1 text-left">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        className={`flex h-9 w-full rounded-md border bg-transparent pl-3 pr-10 py-1 text-sm ring-offset-background placeholder:text-slate-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.confirmPassword
                                                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900'
                                                : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                            }`}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200 transition-colors flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-base">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.confirmPassword.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center text-white justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-555 hover:bg-slate-900/90 h-9 px-4 py-1 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 w-full mt-4"
                            >
                                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
