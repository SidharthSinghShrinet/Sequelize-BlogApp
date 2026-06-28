export const CATEGORY_KEYWORDS: Record<string, string[]> = {
    frontend: ['react', 'vue', 'angular', 'svelte', 'css', 'html', 'tailwind', 'flexbox', 'grid', 'frontend', 'ui', 'ux', 'components', 'responsive', 'dom', 'browser', 'javascript', 'typescript', 'hooks', 'state', 'usestate', 'useeffect'],
    backend: ['node', 'bun', 'express', 'koa', 'nest', 'api', 'backend', 'rest', 'graphql', 'router', 'controller', 'middleware', 'auth', 'jwt', 'session', 'token', 'server', 'http', 'websocket'],
    databases: ['sequelize', 'mysql', 'postgres', 'postgresql', 'sqlite', 'mongodb', 'redis', 'nosql', 'sql', 'query', 'orm', 'migration', 'database', 'db', 'schema', 'transaction', 'indexing'],
    devops: ['cloudinary', 'cron', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'deploy', 'deployment', 'ci/cd', 'github actions', 'upload', 'purged', 'cleanup', 'automation', 'pipeline'],
    ai: ['ai', 'llm', 'mistral', 'pollinations', 'flux', 'prompt', 'image generation', 'cover art', 'artwork', 'gpt', 'openai', 'diffusion', 'generative', 'brief', 'artist']
};

export const getCategoryForBlog = (title: string, content: string): string => {
    const combinedText = `${title || ''} ${content || ''}`.toLowerCase();
    
    let bestCategory = 'general';
    let maxMatches = 0;
    
    for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        let matches = 0;
        for (const keyword of keywords) {
            if (combinedText.includes(keyword)) {
                matches++;
            }
        }
        
        if (matches > maxMatches) {
            maxMatches = matches;
            bestCategory = catId;
        }
    }
    
    return bestCategory;
};
