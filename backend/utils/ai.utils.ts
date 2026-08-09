import { uploadBufferToCloudinary } from "./cloudinary.utils";

/**
 * Extracts a clean 1-2 word search term representing the core topic of the blog title.
 */
async function getSearchTerm(blogTitle: string): Promise<string> {
    try {
        const searchPrompt = `Extract the single most important programming language, technology, or core topic name from this blog title as a clean 1-2 word search term: "${blogTitle}". Output ONLY the term. Do not include quotes, intro, explanation, punctuation, or the word "photography".`;
        
        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (geminiApiKey) {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: searchPrompt }] }]
                    })
                }
            );
            if (response.ok) {
                const data: any = await response.json();
                const extracted = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (extracted) return extracted.replace(/["']/g, "").trim();
            }
        }

        // Fallback search term extractor using Pollinations Mistral
        const pollinationsKey = process.env.POLLINATIONS_API_KEY;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (pollinationsKey) {
            headers["Authorization"] = `Bearer ${pollinationsKey}`;
        }
        const response = await fetch(
            "https://gen.pollinations.ai/v1/chat/completions",
            {
                method: "POST",
                headers,
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
            if (extracted) return extracted.replace(/["']/g, "").trim();
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
 * Generates an Art Director visual composition brief for a blog title.
 * Primary: Gemini 2.5 Flash API
 * Fallback: Mistral (via Pollinations API)
 */
export async function generateArtDirectorBrief(blogTitle: string): Promise<string> {
    const artDirectorPrompt = `You are a creative Art Director. Analyze this blog title: "${blogTitle}". Design a beautiful, high-quality visual concept for an article cover representing this specific topic. Write a single, descriptive sentence describing the composition of this image (objects, background, lighting, and mood). Make it a conceptual metaphor or visual scene that is highly relevant and recognizable for the topic. If there are iconic symbols or visual metaphors commonly associated with the specific topic (such as databases, servers, gears, networks, locks, lightbulbs, atomic orbits, interlocking loops, or layers), creatively incorporate them into a modern artistic composition. STRICT RULES: 1. Start your response directly with the image description (e.g., "A..." or "An..."). Do not include any intro, thinking, notes, or meta-commentary. 2. Do not include any words, letters, text, alphabets, or typography in the description. 3. Do not include code syntax, code snippets, or user interface (UI) screens. 4. Describe only visual objects, colors, and art style. Use a professional, clean, and modern artistic aesthetic. 5. Avoid animal metaphors (like spiders, octopuses, etc.) or literal physical tools (like fishing hooks). Focus on abstract, geometric, digital, or technology-based representations.`;

    // Tier 3A: Gemini 2.5 Flash
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
        try {
            console.log("[Art Director] Generating brief with Gemini 2.5 Flash...");
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: artDirectorPrompt }] }]
                    })
                }
            );
            if (response.ok) {
                const data: any = await response.json();
                const brief = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
                if (brief) {
                    console.log(`[Art Director Gemini] Brief: "${brief}"`);
                    return brief;
                }
            } else {
                console.error(`Gemini API returned status ${response.status}`);
            }
        } catch (e) {
            console.error("Art Director (Gemini) failed:", e);
        }
    }

    // Tier 3B: Fallback to Mistral (via Pollinations)
    try {
        console.log("[Art Director] Falling back to Mistral (Pollinations)...");
        const pollinationsKey = process.env.POLLINATIONS_API_KEY;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (pollinationsKey) {
            headers["Authorization"] = `Bearer ${pollinationsKey}`;
        }
        const response = await fetch(
            "https://gen.pollinations.ai/v1/chat/completions",
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    model: "mistral-small-3.2",
                    messages: [{ role: "user", content: artDirectorPrompt }],
                    max_tokens: 100
                })
            }
        );
        if (response.ok) {
            const data: any = await response.json();
            const brief = data.choices?.[0]?.message?.content?.trim();
            if (brief) {
                console.log(`[Art Director Mistral] Brief: "${brief}"`);
                return brief;
            }
        }
    } catch (e) {
        console.error("Art Director (Mistral) failed:", e);
    }

    // Default emergency fallback brief
    return `A modern, sleek digital conceptual illustration for ${blogTitle}, clean glowing geometric shapes, futuristic lighting, high quality 3D art`;
}

/**
 * Generates an image buffer from an Art Director prompt.
 * Primary: Cloudflare Workers AI Flux (@cf/black-forest-labs/flux-1-schnell)
 * Fallback: Pollinations Flux
 */
async function generateFluxImage(brief: string): Promise<Buffer | null> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // Tier 4A: Cloudflare Workers AI Flux-1-Schnell
    if (accountId && apiToken) {
        try {
            console.log("[Flux Image Gen] Attempting Cloudflare Workers AI (@cf/black-forest-labs/flux-1-schnell)...");
            const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`;
            const response = await fetch(cfUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ prompt: brief })
            });

            if (response.ok) {
                const contentType = response.headers.get("content-type") || "";
                if (contentType.includes("image/") || contentType.includes("application/octet-stream")) {
                    console.log("[Flux Image Gen] Cloudflare returned direct binary image buffer.");
                    const ab = await response.arrayBuffer();
                    return Buffer.from(ab);
                }

                // Cloudflare might return JSON containing base64 image data
                const data: any = await response.json();
                if (data.result?.image) {
                    console.log("[Flux Image Gen] Cloudflare returned base64 image payload.");
                    return Buffer.from(data.result.image, "base64");
                }
            } else {
                const errText = await response.text();
                console.error(`Cloudflare Workers AI failed (${response.status}): ${errText}`);
            }
        } catch (e) {
            console.error("Cloudflare Flux image generation failed:", e);
        }
    }

    // Tier 4B: Fallback to Pollinations Flux
    try {
        console.log("[Flux Image Gen] Falling back to Pollinations Flux...");
        const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(brief)}?width=800&height=450&nologo=true&private=true&model=flux`;
        const imgResp = await fetch(imgUrl);
        if (imgResp.ok) {
            const ab = await imgResp.arrayBuffer();
            return Buffer.from(ab);
        }
    } catch (e) {
        console.error("Pollinations Flux image generation failed:", e);
    }

    return null;
}

/**
 * Main Smart Blog Cover Pipeline:
 * Unsplash -> Pexels -> Art Director (Gemini -> Mistral) -> Cloudflare Flux -> Pollinations Flux -> Cloudinary Upload
 */
export async function generateSmartBlogCover(blogTitle: string): Promise<{ url: string; publicId: string; bytes: number } | null> {
    try {
        // Step 1: Extract clean search term
        const searchTerm = await getSearchTerm(blogTitle);
        console.log(`[Cover Pipeline] Extracted search term: "${searchTerm}" for blog title: "${blogTitle}"`);

        let buffer: Buffer | null = null;

        // Step 2: Try Unsplash
        buffer = await tryUnsplash(searchTerm);

        // Step 3: Try Pexels if Unsplash failed
        if (!buffer) {
            buffer = await tryPexels(searchTerm);
        }

        // Step 4: Fall back to Art Director + Flux AI Generation if Stock photos failed
        if (!buffer) {
            console.log("[Cover Pipeline] Stock photos unavailable. Initiating AI Art Director + Flux pipeline...");
            const brief = await generateArtDirectorBrief(blogTitle);
            buffer = await generateFluxImage(brief);
        }

        // Step 5: Upload result to Cloudinary
        if (buffer) {
            console.log("[Cover Pipeline] Uploading generated cover buffer to Cloudinary...");
            const uploadResult: any = await uploadBufferToCloudinary(buffer, "blog_thumbnails");
            return {
                url: uploadResult.secure_url,
                publicId: uploadResult.public_id,
                bytes: uploadResult.bytes
            };
        }

        throw new Error("Pipeline failed to produce an image buffer across all search and AI tiers.");
    } catch (error) {
        console.error("Smart Blog Cover Generation Error:", error);
        return null;
    }
}
