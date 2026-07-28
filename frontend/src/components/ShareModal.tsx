import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaXTwitter, FaLinkedinIn, FaWhatsapp, FaRedditAlien, FaTelegram, FaShareNodes } from 'react-icons/fa6';
interface ShareModalProps {
    title: string;
    url?: string;
    isOpen: boolean;
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ title, url, isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out this blog: ${title}`,
                    url: shareUrl,
                });
                onClose();
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    toast.error("Failed to open native share sheet");
                }
            }
        } else {
            handleCopy();
        }
    };

    const socialPlatforms = [
        {
            name: 'X (Twitter)',
            Icon: FaXTwitter,
            color: 'bg-black hover:bg-slate-800 text-white',
            shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'LinkedIn',
            Icon: FaLinkedinIn,
            color: 'bg-[#0a66c2] hover:bg-[#084e96] text-white',
            shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'WhatsApp',
            Icon: FaWhatsapp,
            color: 'bg-[#25D366] hover:bg-[#1da851] text-white',
            shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out "${title}" on ShowOff! ${shareUrl}`)}`
        },
        {
            name: 'Reddit',
            Icon: FaRedditAlien,
            color: 'bg-[#FF4500] hover:bg-[#cc3700] text-white',
            shareUrl: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`
        },
        {
            name: 'Telegram',
            Icon: FaTelegram,
            color: 'bg-[#229ED9] hover:bg-[#1a7eb0] text-white',
            shareUrl: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`
        }
    ];

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transition-all flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">share</span>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Share Article</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Close share modal"
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-5">
                    {/* Article title preview */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Article Title</span>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">{title}</p>
                    </div>

                    {/* Native device share button */}
                    <button
                        onClick={handleNativeShare}
                        className="w-full py-2.5 px-4 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary dark:text-indigo-400 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-primary/20"
                    >
                        <FaShareNodes className="text-sm" />
                        <span>Open System Share Sheet (Native Share)</span>
                    </button>

                    {/* Social Media Grid */}
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Share via Platform</span>
                        <div className="grid grid-cols-5 gap-2">
                            {socialPlatforms.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.shareUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all hover:scale-105 ${platform.color}`}
                                    title={`Share on ${platform.name}`}
                                >
                                    <platform.Icon className="text-[20px] mb-1" />
                                    <span className="text-[9px] font-bold truncate max-w-full">{platform.name.split(' ')[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Copy Link Input Section */}
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Copy Link</span>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 rounded-xl p-1.5 border border-slate-200 dark:border-slate-800">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                onFocus={(e) => e.target.select()}
                                className="bg-transparent text-xs font-mono text-slate-600 dark:text-slate-300 outline-none px-2 flex-grow truncate"
                            />
                            <button
                                onClick={handleCopy}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${copied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-primary hover:brightness-110 text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {copied ? 'check' : 'content_copy'}
                                </span>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
