import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserApi, ApiError } from '../api/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

const profileSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z.string().length(10, 'Phone number must be exactly 10 characters'),
    password: z.string().optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            password: '',
        }
    });

    const onSubmit = async (data: ProfileFormValues) => {
        try {
            // Clean up password if not typed
            const payload: any = {
                username: data.username,
                email: data.email,
                phoneNumber: data.phoneNumber,
            };
            if (data.password && data.password.trim() !== '') {
                payload.password = data.password;
            }

            const response: any = await UserApi.updateProfile(payload);
            updateUser(response.data);
            toast.success('Profile updated successfully!');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to update profile.');
        }
    };

    const handleSignOut = async () => {
        await logout();
        navigate('/login');
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete your account? This action is permanent."
        );
        if (!confirmDelete) return;

        try {
            await UserApi.deleteAccount();
            // Local cleanup is handled in AuthContext after session is cleared
            await logout();
            toast.success('Your account has been successfully deleted.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err instanceof ApiError ? err.message : 'Failed to delete account.');
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-slate-950 transition-colors duration-300">
            <TopNavBar />

            <main className="flex-grow w-full max-w-container-max mx-auto px-gutter py-12 flex items-center justify-center">
                <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                    {/* Left: Summary Profile Card */}
                    <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-bold text-3xl text-primary uppercase select-none shadow-sm mb-4">
                            {user.username.charAt(0)}
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{user.username}</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase font-bold tracking-wider">ShowOff Creator</p>

                        <div className="w-full border-t border-slate-50 dark:border-slate-800 my-6 pt-6 flex flex-col gap-4 text-left">
                            <div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Email Address</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">{user.email}</span>
                            </div>

                            <div>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Phone Number</span>
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5 block">{user.phoneNumber}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSignOut}
                            className="w-full mt-2 py-3 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-error dark:hover:text-red-400 flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-base">logout</span>
                            Sign Out Account
                        </button>

                        <button
                            onClick={handleDeleteAccount}
                            className="w-full mt-2.5 py-3 border border-red-200 dark:border-red-900/50 bg-red-50/10 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 transition-colors rounded-xl text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5"
                        >
                            <span className="material-symbols-outlined text-base">delete</span>
                            Delete Account
                        </button>
                    </div>

                    {/* Right: Edit Settings Form */}
                    <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none p-8">
                        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Edit Account Settings</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your developer details and account credentials below.</p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Username */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">person</span>
                                        <input
                                            className={`input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all outline-none ${errors.username ? 'border-error' : ''}`}
                                            placeholder="johndoe"
                                            {...register('username')}
                                        />
                                    </div>
                                    {errors.username && <p className="text-error text-xs mt-1.5 font-medium">{errors.username.message}</p>}
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">call</span>
                                        <input
                                            className={`input-field w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition-all outline-none ${errors.phoneNumber ? 'border-error' : ''}`}
                                            type="tel"
                                            placeholder="10-digit number"
                                            maxLength={10}
                                            {...register('phoneNumber')}
                                        />
                                    </div>
                                    {errors.phoneNumber && <p className="text-error text-xs mt-1.5 font-medium">{errors.phoneNumber.message}</p>}
                                </div>
                            </div>

                            {/* Email */}
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

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password (leave blank to keep current)</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-lg">lock</span>
                                    <input
                                        className="input-field w-full rounded-xl pl-10 pr-4 py-3 text-sm transition-all outline-none"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register('password')}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:shadow-primary/35 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2 ml-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving changes...
                                    </>
                                ) : 'Save Settings'}
                            </button>
                        </form>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
