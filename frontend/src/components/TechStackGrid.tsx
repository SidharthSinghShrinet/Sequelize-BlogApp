import React from 'react';

const TechStackGrid = () => {
    const techStack = [
        {
            name: "Bun",
            role: "Runtime & Package Manager",
            description: "Serves as the ultra-fast JavaScript runtime powering our backend environment, providing rapid startup speeds and robust process monitoring.",
            color: "from-amber-400 to-orange-500",
            icon: "⚡"
        },
        {
            name: "Sequelize",
            role: "MySQL Object-Relational Mapper",
            description: "Manages our database modeling, schema synchronizations, and complex relational associations (blogs, media assets, and authors) safely.",
            color: "from-blue-500 to-indigo-600",
            icon: "🛡️"
        },
        {
            name: "Cloudinary",
            role: "Cloud CDN Media Host",
            description: "Handles secure media uploading, automatic image compression, caching, and globally optimized delivery for cover thumbnails.",
            color: "from-sky-400 to-blue-500",
            icon: "☁️"
        },
        {
            name: "Pollinations AI",
            role: "Multi-Modal AI Pipeline",
            description: "Chains lightweight open-source text models (Mistral) for visual analysis with fast diffusion models (Flux) for free, instant cover synthesis.",
            color: "from-violet-500 to-fuchsia-500",
            icon: "🤖"
        }
    ];

    return (
        <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    The Tech Stack
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Built using developer-focused utilities designed for lightweight execution and zero dependencies.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {techStack.map((tech, idx) => (
                    <div 
                        key={idx} 
                        className="group relative bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-primary/20 dark:hover:border-indigo-500/20 transition-all duration-300"
                    >
                        {/* Top colored accent border line */}
                        <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${tech.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="text-3xl mt-2 select-none">{tech.icon}</div>
                        
                        <div className="flex flex-col">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-indigo-400 transition-colors">
                                {tech.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 dark:text-slate-555 font-semibold uppercase tracking-wider mt-0.5">
                                {tech.role}
                            </span>
                        </div>
                        
                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                            {tech.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TechStackGrid;
