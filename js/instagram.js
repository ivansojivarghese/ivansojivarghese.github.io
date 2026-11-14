const INSTAGRAM_API_URL = "https://instagram-embed-api.vercel.app/api/instagram";

function createInstagramPost(post) {
    const link = document.createElement("a");
    link.className = "instagram-post hoverB trs";
    link.href = post.permalink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (post.media_type === "VIDEO" && post.media_url) {
        const video = document.createElement("video");
        video.src = post.media_url;
        video.poster = post.thumbnail_url || "";
        video.controls = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", post.caption || "Instagram video");
        link.appendChild(video);
    } else {
        const image = document.createElement("img");
        image.src = post.media_url || post.thumbnail_url;
        image.alt = post.caption || "Instagram post";
        image.loading = "lazy";
        link.appendChild(image);
    }

    return link;
}

async function loadInstagramFeed() {
    const feed = document.getElementById("instagram_feed");
    if (!feed) {
        return;
    }

    try {
        const response = await fetch(INSTAGRAM_API_URL, {
            headers: { Accept: "application/json" }
        });
        const payload = await response.json();

        if (!response.ok) {
            throw new Error(payload.error || "Instagram request failed");
        }

        const posts = Array.isArray(payload.data) ? payload.data : [];
        feed.replaceChildren(...posts.map(createInstagramPost));

        if (!posts.length) {
            feed.textContent = "No Instagram posts available.";
        }
    } catch (error) {
        feed.textContent = "Unable to load Instagram posts.";
        console.error("Unable to load Instagram feed:", error);
    }
}

loadInstagramFeed();
