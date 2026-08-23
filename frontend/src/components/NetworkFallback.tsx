import React, { useState } from 'react';
import { FiWifiOff, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

interface NetworkFallbackProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const NetworkFallback: React.FC<NetworkFallbackProps> = ({
    title = 'Trouble Connecting to Server',
    message = 'We encountered a temporary network or server connection blip. Please check your internet connection or try refreshing.',
    onRetry,
}) => {
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetry = () => {
        setIsRetrying(true);
        if (onRetry) {
            onRetry();
            setTimeout(() => setIsRetrying(false), 1500);
        } else {
            window.location.reload();
        }
    };

    return (
        <div className="min-h-[400px] w-full flex items-center justify-center p-6 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl my-6">
            <div className="max-w-md text-center flex flex-col items-center">
                <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-lg shadow-red-500/10">
                        <FiWifiOff className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-yellow-400">
                        <FiAlertCircle className="w-4 h-4" />
                    </div>
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-2">
                    {title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    {message}
                </p>

                <button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiRefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying ? 'Retrying Connection...' : 'Retry Now'}
                </button>
            </div>
        </div>
    );
};

export default NetworkFallback;
