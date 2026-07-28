import React, { useState } from 'react';
import { BlogApi } from '../api/client';
import toast from 'react-hot-toast';

const AiSandbox = () => {
    const [sandboxTitle, setSandboxTitle] = useState('Modern Web Security & Encryption');
    const [sandboxLoading, setSandboxLoading] = useState(false);
    const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
    const [sandboxBrief, setSandboxBrief] = useState('');
    const [sandboxImageUrl, setSandboxImageUrl] = useState('');
    const [imageLoading, setImageLoading] = useState(false);

    const handleSandboxSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sandboxTitle.trim()) {
            toast.error("Please enter a title to test the sandbox!");
            return;
        }

        setSandboxLoading(true);
        setSandboxBrief('');
        setSandboxImageUrl('');
        setSandboxLogs([
            `[SYSTEM] Connecting to Showoff AI Proxy Server...`,
        ]);

        const appendLog = (msg: string, delay: number) => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    setSandboxLogs(prev => [...prev, msg]);
                    resolve();
                }, delay);
            });
        };

        try {
            await appendLog(`[SYSTEM] Starting Art Director pipeline for title: "${sandboxTitle}"`, 400);
            await appendLog(`[ART DIRECTOR] Executing completions using Mistral-Small model...`, 600);

            const response: any = await BlogApi.testAiPrompt({ title: sandboxTitle });
            
            await appendLog(`[ART DIRECTOR] completions request completed successfully.`, 400);
            await appendLog(`[SYSTEM] visual concept brief generated: "${response.data.brief}"`, 300);
            
            setSandboxBrief(response.data.brief);
            
            await appendLog(`[ARTIST] Routing brief description to Flux canvas renderer...`, 400);
            
            const generatedUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(response.data.brief)}?width=800&height=450&nologo=true&private=true&model=flux`;
            setSandboxImageUrl(generatedUrl);
            setImageLoading(true);
            
            await appendLog(`[SYSTEM] Rendering cover layout complete. Sandbox active.`, 500);
        } catch (err: any) {
            console.error(err);
            setSandboxLogs(prev => [...prev, `[ERROR] Pipeline execution failed: ${err.message || err}`]);
            toast.error("AI prompt sandbox failed to generate.");
        } finally {
            setSandboxLoading(false);
        }
    };

    return (
        <section className="flex flex-col gap-8 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 md:p-8">
            <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] font-bold text-primary dark:text-indigo-400 uppercase tracking-widest">
                    Platform Interactive Sandbox
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    AI Art Director Playground
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Type any custom technical topic title to test the Art Director pipeline and see the generated concept and cover design in real time!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Control panel (Left 5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                    <form onSubmit={handleSandboxSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider font-mono">
                                Test Blog Title
                            </label>
                            <input 
                                type="text" 
                                value={sandboxTitle}
                                onChange={(e) => setSandboxTitle(e.target.value)}
                                placeholder="Enter title (e.g. Master Docker Orchestration)"
                                disabled={sandboxLoading}
                                className="w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <button 
                            type="submit"
                            disabled={sandboxLoading}
                            className="flex items-center justify-center gap-2 bg-primary text-white font-bold text-sm px-5 py-3.5 rounded-xl hover:brightness-105 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all shadow-md shadow-primary/10"
                        >
                            {sandboxLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Analyzing Title...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">science</span>
                                    Run Art Director Pipeline
                                </>
                            )}
                        </button>
                    </form>

                    {/* Terminal Console Logs */}
                    <div className="flex flex-col gap-2 flex-grow min-h-[180px] mt-2">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-350 uppercase tracking-wider font-mono">
                            Developer Console Output
                        </span>
                        <div className="bg-slate-900 dark:bg-slate-950 rounded-xl p-4 font-mono text-[10px] text-amber-500/90 flex flex-col gap-1.5 h-full overflow-y-auto border border-slate-800 max-h-[220px]">
                            {sandboxLogs.length === 0 ? (
                                <span className="text-slate-500 italic">// Console idle. Enter a title above and run to test pipeline.</span>
                            ) : (
                                sandboxLogs.map((log, idx) => {
                                    const isError = log.startsWith("[ERROR]");
                                    const isSystem = log.startsWith("[SYSTEM]");
                                    const isSuccess = log.includes("successful") || log.includes("complete");
                                    let textColor = "text-amber-500/90";
                                    if (isError) textColor = "text-rose-500 font-bold";
                                    else if (isSystem) textColor = "text-slate-400";
                                    else if (isSuccess) textColor = "text-emerald-400";
                                    
                                    return (
                                        <div key={idx} className={textColor}>
                                            {log}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Rendering View panel (Right 7 Cols) */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-6 shadow-inner justify-between min-h-[380px]">
                    {sandboxLoading ? (
                        <div className="flex flex-col flex-grow items-center justify-center gap-4 py-12">
                            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-mono text-slate-400">Art Director is thinking...</span>
                        </div>
                    ) : sandboxBrief ? (
                        <div className="flex flex-col gap-4 flex-grow justify-between animate-[fadeIn_0.3s_ease-out]">
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                                    Stage Output // Visual Brief
                                </span>
                                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 leading-relaxed text-xs text-slate-700 dark:text-slate-350 italic">
                                    "{sandboxBrief}"
                                </div>
                            </div>

                            {sandboxImageUrl && (
                                <div className="flex flex-col gap-2 mt-2">
                                    <span className="font-mono text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                                        Stage Output // Flux Generated Canvas
                                    </span>
                                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                                        {imageLoading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 z-10">
                                                <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                        <img 
                                            src={sandboxImageUrl} 
                                            alt="Generated Sandbox Cover" 
                                            onLoad={() => setImageLoading(false)}
                                            onError={() => setImageLoading(false)}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col flex-grow items-center justify-center gap-3 py-12 text-slate-400 dark:text-slate-650">
                            <span className="material-symbols-outlined text-5xl">settings_input_component</span>
                            <span className="text-xs font-semibold text-center leading-relaxed max-w-[280px]">
                                Ready to generate. Enter a topic title on the left and run the pipeline to view visual briefs and AI canvas previews.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AiSandbox;
