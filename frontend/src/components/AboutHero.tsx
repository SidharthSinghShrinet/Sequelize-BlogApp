import React from 'react';

const AboutHero = () => {
    return (
        <section className="flex flex-col gap-6 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary dark:text-indigo-400 bg-primary/5 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full w-fit">
                The Manifesto
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
                A Publishing Workspace Built for Technical Minds.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-normal">
                Showoff is more than just a writing platform. It is a highly optimized, automated ecosystem engineered to let developers, teachers, and creators document their breakthroughs without worrying about layout design, image styling, or database cruft.
            </p>
        </section>
    );
};

export default AboutHero;
