const GRAPH_API_VERSION = process.env.IG_GRAPH_API_VERSION || "v27.0";
const APP_ID = process.env.IG_APP_ID;
const APP_SECRET = process.env.IG_APP_SECRET;
const MEDIA_FIELDS = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp"
].join(",");

export default async function handler(request, response) {
    response.setHeader(
        "Access-Control-Allow-Origin",
        "https://ivansojivarghese.github.io"
    );
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    response.setHeader("Vary", "Origin");

    if (request.method === "OPTIONS") {
        return response.status(200).end();
    }

    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        return response.status(405).json({ error: "Method not allowed" });
    }

    const accountId = process.env.IG_ACCOUNT_ID;
    const accessToken = process.env.IG_ACCESS_TOKEN;

    if (!APP_ID || !APP_SECRET || !accountId || !accessToken) {
        return response.status(500).json({
            error: "Instagram integration is not configured"
        });
    }

    const url = new URL(
        `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}/media`
    );
    url.searchParams.set("fields", MEDIA_FIELDS);
    url.searchParams.set("limit", "9");
    url.searchParams.set("access_token", accessToken);

    try {
        const instagramResponse = await fetch(url);
        const payload = await instagramResponse.json();

        if (!instagramResponse.ok) {
            return response.status(502).json({
                error: payload.error?.message || "Instagram request failed"
            });
        }

        const posts = Array.isArray(payload.data)
            ? payload.data.filter((post) => post.permalink && (post.media_url || post.thumbnail_url))
            : [];

        response.setHeader(
            "Cache-Control",
            "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400"
        );
        return response.status(200).json({ data: posts });
    } catch (error) {
        console.error("Unable to load Instagram posts:", error);
        return response.status(502).json({ error: "Unable to load Instagram posts" });
    }
}
