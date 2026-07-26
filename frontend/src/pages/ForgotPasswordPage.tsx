import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { UserApi, ApiError } from '../api/client';
import Logo from '../components/Logo';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
    const [emailSent, setEmailSent] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            await UserApi.forgotPassword(data.email);
            setEmailSent(true);
            toast.success('Reset link dispatched successfully!');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to generate reset link.');
        }
    };

    return (
        <div className="h-screen overflow-hidden flex bg-background dark:bg-slate-950 transition-colors duration-300">
            {/* Left Decorative/Branding Sidebar */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative overflow-hidden bg-slate-900 justify-center items-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 z-0" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] z-0 animate-pulse" />

                <div className="relative z-10 max-w-md px-12 text-white flex flex-col gap-6">
                    <div>
                        <Logo fontSize="text-4xl" textColor="text-white" className="mb-4" />
                        <h3 className="text-2xl font-bold text-slate-100 tracking-tight">Recover your account</h3>
                        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                            No worries! Enter your registered developer email, and we will dispatch a secure, tokenized reset link to help you verify and restore your access.
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
                        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Reset password</h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">Enter your account email to receive a password reset link.</p>
                    </div>

                    {emailSent ? (
                        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 p-6 text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">mark_email_read</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-base">Email Dispatched</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    We have sent a verification token link. Please check your inbox to continue.
                                </p>
                            </div>

                            <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60 space-y-1 text-left">
                                <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase block">Resend Email Service</span>
                                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                    A password reset link has been dispatched to your email address via Resend. Please check your inbox (and spam folder) to proceed.
                                </p>
                            </div>

                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 w-full mt-2"
                            >
                                Back to Log In
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50 p-5 md:p-6">
                            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-1 text-left">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Email address
                                    </label>
                                    <input
                                        className={`flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.email
                                                ? 'border-red-500 focus-visible:ring-red-500 dark:border-red-900 dark:focus-visible:ring-red-900'
                                                : 'border-slate-200 focus-visible:ring-slate-950 dark:border-slate-800 dark:focus-visible:ring-slate-300'
                                            }`}
                                        type="email"
                                        placeholder="name@example.com"
                                        {...register('email')}
                                    />
                                    {errors.email && <p className="text-[10px] font-semibold text-red-500 dark:text-red-400 mt-0.5">{errors.email.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-9 px-4 py-1 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 w-full mt-3"
                                >
                                    {isSubmitting ? 'Sending Request...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </div>
                    )}

                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Remembered your password?{' '}
                        <Link to="/login" className="text-primary dark:text-indigo-400 font-bold hover:underline transition-all">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
