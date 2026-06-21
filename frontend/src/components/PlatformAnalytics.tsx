import React, { useEffect, useState } from 'react';
import { BlogApi } from '../api/client';

const PlatformAnalytics = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response: any = await BlogApi.getAnalytics();
                if (response?.data) {
                    setAnalytics(response.data);
                }
            } catch (err) {
                console.error("Failed to load platform analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const totalArticles = analytics?.totalArticles ?? 0;
    const coverCount = analytics?.coverCount ?? 0;
    const avgReadingTime = analytics?.avgReadingTime ?? 0;
    const totalStorageSavedBytes = analytics?.totalStorageSavedBytes ?? 0;

    // Format Storage Saved dynamically
    const storageSavedKB = totalStorageSavedBytes / 1024;
    const storageSavedText = storageSavedKB > 1024 
        ? (storageSavedKB / 1024).toFixed(1) + " MB" 
        : Math.round(storageSavedKB) + " KB";

    return (
        <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest">
                    Live Metrics // Production Database
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Platform Insights
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Real-time statistics queried directly from active blog entities and tracked media structures in MySQL.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Card 1: Total Posts */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Articles</span>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
                            {totalArticles}
                            <span className="text-xs font-medium text-slate-400">published</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-450 text-[11px] mt-2 leading-relaxed">
                            Active technical items successfully stored in database tables.
                        </p>
                    </div>

                    {/* Card 2: AI Covers */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">AI Covers Generated</span>
                        <div className="text-3xl font-extrabold text-indigo-500 dark:text-indigo-400 mt-1 flex items-baseline gap-2">
                            {coverCount}
                            <span className="text-xs font-medium text-slate-400">images</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-450 text-[11px] mt-2 leading-relaxed">
                            Blog headers automatically synthesized and linked.
                        </p>
                    </div>

                    {/* Card 3: Avg Read Time */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Average Read Time</span>
                        <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
                            {avgReadingTime}
                            <span className="text-xs font-medium text-slate-400">minutes</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-450 text-[11px] mt-2 leading-relaxed">
                            Dynamically computed reading duration across all blogs.
                        </p>
                    </div>

                    {/* Card 4: Storage Saved */}
                    <div className="bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">Cleaned Storage</span>
                        <div className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1 flex items-baseline gap-2">
                            {storageSavedText}
                            <span className="text-xs font-medium text-slate-400">saved</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-450 text-[11px] mt-2 leading-relaxed">
                            Purged orphaned media assets released by background cron jobs.
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PlatformAnalytics;
