import { uploadBufferToCloudinary } from "./cloudinary.utils";

/**
 * Extracts a clean 1-2 word search term representing the core topic of the blog title.
 */
async function getSearchTerm(blogTitle: string, headers: any): Promise<string> {
    try {
        const searchPrompt = `Extract the single most important programming language, technology, or core topic name from this blog title as a clean 1-2 word search term: "${blogTitle}". Output ONLY the term. Do not include quotes, intro, explanation, punctuation, or the word "photography".`;
        const response = await fetch(
            "https://gen.pollinations.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral-small-3.2",
                    messages: [{ role: "user", content: searchPrompt }],
                    max_tokens: 15
                })
            }
        );
        if (response.ok) {
            const data: any = await response.json();
            const extracted = data.choices?.[0]?.message?.content?.trim();
            if (extracted) return extracted;
        }
    } catch (e) {
        console.error("Failed to extract search term:", e);
    }
    return blogTitle;
}

/**
 * Tries to fetch a relevant high-quality stock photo from Unsplash.
 */
async function tryUnsplash(searchTerm: string): Promise<Buffer | null> {
    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) return null;
    try {
        console.log(`[Unsplash] Searching for "${searchTerm}"...`);
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchTerm)}&per_page=1&client_id=${accessKey}`;
        const response = await fetch(url);
        if (response.ok) {
            const data: any = await response.json();
            if (data.results && data.results.length > 0) {
                const imgUrl = data.results[0].urls.regular;
                console.log(`[Unsplash] Found image: ${imgUrl}`);
                const imgResp = await fetch(imgUrl);
                if (imgResp.ok) {
                    const ab = await imgResp.arrayBuffer();
                    return Buffer.from(ab);
                }
            }
        }
    } catch (e) {
        console.error("Unsplash search failed:", e);
    }
    return null;
}

/**
 * Tries to fetch a relevant high-quality stock photo from Pexels.
 */
async function tryPexels(searchTerm: string): Promise<Buffer | null> {
    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) return null;
    try {
        console.log(`[Pexels] Searching for "${searchTerm}"...`);
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=1`;
        const response = await fetch(url, {
            headers: { "Authorization": apiKey }
        });
        if (response.ok) {
            const data: any = await response.json();
            if (data.photos && data.photos.length > 0) {
                const imgUrl = data.photos[0].src.large;
                console.log(`[Pexels] Found image: ${imgUrl}`);
                const imgResp = await fetch(imgUrl);
                if (imgResp.ok) {
                    const ab = await imgResp.arrayBuffer();
                    return Buffer.from(ab);
                }
            }
        }
    } catch (e) {
        console.error("Pexels search failed:", e);
    }
    return null;
}

/**
 * Generates a custom abstract visual cover using AI (Mistral + Flux).
 */
async function generateAICover(blogTitle: string, headers: any): Promise<Buffer | null> {
    try {
        console.log("[AI Cover] Falling back to custom AI generation...");
        const artDirectorPrompt = `You are a creative Art Director. Analyze this blog title: "${blogTitle}". Design a beautiful, high-quality visual concept for an article cover representing this specific topic. Write a single, descriptive sentence describing the composition of this image (objects, background, lighting, and mood). Make it a conceptual metaphor or visual scene that is highly relevant and recognizable for the topic. If there are iconic symbols or visual metaphors commonly associated with the specific topic (such as databases, servers, gears, networks, locks, lightbulbs, atomic orbits, interlocking loops, or layers), creatively incorporate them into a modern artistic composition. STRICT RULES: 1. Start your response directly with the image description (e.g., "A..." or "An..."). Do not include any intro, thinking, notes, or meta-commentary. 2. Do not include any words, letters, text, alphabets, or typography in the description. 3. Do not include code syntax, code snippets, or user interface (UI) screens. 4. Describe only visual objects, colors, and art style. Use a professional, clean, and modern artistic aesthetic. 5. Avoid animal metaphors (like spiders, octopuses, etc.) or literal physical tools (like fishing hooks). Focus on abstract, geometric, digital, or technology-based representations.`;

        const response = await fetch(
            "https://gen.pollinations.ai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "mistral-small-3.2",
                    messages: [{ role: "user", content: artDirectorPrompt }],
                    max_tokens: 100
                })
            }
        );

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Text API failed with status ${response.status}: ${errText}`);
        }

        const data: any = await response.json();
        const generatedBrief = data.choices?.[0]?.message?.content?.trim();
        if (!generatedBrief) throw new Error("Generated brief was empty.");

        console.log(`[AI Cover] Generated Brief: "${generatedBrief}"`);
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(generatedBrief)}?width=800&height=450&nologo=true&private=true&model=flux`;
        const imgResp = await fetch(imgUrl);
        if (!imgResp.ok) {
            const imgErr = await imgResp.text();
            throw new Error(`Flux image generation failed: ${imgErr}`);
        }

        const ab = await imgResp.arrayBuffer();
        return Buffer.from(ab);
    } catch (e) {
        console.error("AI Cover generation failed:", e);
    }
    return null;
}

/**
 * Generates a highly relevant, text-free blog cover image by checking stock photo search
 * endpoints first (Unsplash, Pexels), and falling back to a custom AI generation pipeline if none found.
 */
export async function generateSmartBlogCover(blogTitle: string): Promise<{ url: string; publicId: string; bytes: number } | null> {
    try {
        const pollinationsKey = process.env.POLLINATIONS_API_KEY;
        const headers: Record<string, string> = {};
        if (pollinationsKey) {
            headers["Authorization"] = `Bearer ${pollinationsKey}`;
        }

        // Step 1: Extract a clean search keyword from the title using LLM
        const searchTerm = await getSearchTerm(blogTitle, headers);
        console.log(`[Cover Pipeline] Extracted search term: "${searchTerm}" for title: "${blogTitle}"`);

        let buffer: Buffer | null = null;

        // Step 2: Try searching Unsplash
        buffer = await tryUnsplash(searchTerm);

        // Step 3: Try searching Pexels if Unsplash failed
        if (!buffer) {
            buffer = await tryPexels(searchTerm);
        }

        // Step 4: Fall back to AI Cover Generation if both searches failed
        if (!buffer) {
            buffer = await generateAICover(blogTitle, headers);
        }

        // Step 5: Upload image buffer to Cloudinary
        if (buffer) {
            console.log("[Cover Pipeline] Uploading image buffer to Cloudinary...");
            const uploadResult: any = await uploadBufferToCloudinary(buffer, "blog_thumbnails");
            return {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                bytes: uploadResult.bytes
            };
        }

        throw new Error("Failed to produce any image buffer from searches or AI generation");
    } catch (error) {
        console.error("Cover Generation Pipeline Error:", error);
        return null;
    }
}
