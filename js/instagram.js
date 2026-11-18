const INSTAGRAM_API_URL = "https://instagram-embed-api.vercel.app/api/instagram";

function createInstagramPost(post) {
    const link = document.createElement("a");
    link.className = "instagram-post is-loading hoverB trs";
    link.href = post.permalink;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const skeleton = document.createElement("span");
    skeleton.className = "instagram-skeleton";
    link.appendChild(skeleton);

    const markAsLoaded = () => {
        link.classList.remove("is-loading");
    };

    if (post.media_type === "VIDEO" && post.media_url) {
        const video = document.createElement("video");
        video.className = "instagram-media";
        video.src = post.media_url;
        video.poster = post.thumbnail_url || "";
        video.controls = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", post.caption || "Instagram video");
        video.addEventListener("loadeddata", markAsLoaded, { once: true });
        link.appendChild(video);
    } else {
        const image = document.createElement("img");
        image.className = "instagram-media";
        image.src = post.media_url || post.thumbnail_url;
        image.alt = post.caption || "Instagram post";
        image.loading = "lazy";
        image.addEventListener("load", markAsLoaded, { once: true });
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
        feed.setAttribute("aria-busy", "false");
        feed.replaceChildren(...posts.map(createInstagramPost));
        window.attachHoverListeners?.();

        if (!posts.length) {
            feed.textContent = "No Instagram posts available.";
        }
    } catch (error) {
        feed.setAttribute("aria-busy", "false");
        feed.textContent = "Unable to load Instagram posts.";
        console.error("Unable to load Instagram feed:", error);
    }
}

loadInstagramFeed();

const topClicks = document.querySelectorAll("#top3_images .top-click");
let topClicksFrame = 0;
let topClicksOffsets = Array.from(topClicks, () => 0);

topClicks.forEach((card) => {
    const image = card.querySelector("img");
    if (!image) {
        return;
    }

    const markTopClickLoaded = () => {
        card.classList.remove("is-loading");
    };

    if (image.complete) {
        markTopClickLoaded();
    } else {
        image.addEventListener("load", markTopClickLoaded, { once: true });
        image.addEventListener("error", markTopClickLoaded, { once: true });
    }
});

function updateTopClicksParallax() {
    topClicksFrame = 0;

    if (window.matchMedia("(max-width: 600px) and (orientation: portrait)").matches) {
        topClicks.forEach((card) => {
            card.style.transform = "";
        });
        topClicksOffsets = Array.from(topClicks, () => 0);
        return;
    }

    const viewportCenter = window.innerHeight / 2;

    topClicks.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distanceFromCenter = rect.top + (rect.height / 2) - viewportCenter;
        const strength = [0.08, 0.12, 0.16][index] || 0.08;
        const targetOffset = Math.max(-48, Math.min(48, distanceFromCenter * -strength));
        topClicksOffsets[index] += (targetOffset - topClicksOffsets[index]) * 0.12;

        if (Math.abs(targetOffset - topClicksOffsets[index]) < 0.05) {
            topClicksOffsets[index] = targetOffset;
        }

        card.style.transform = `translateY(${topClicksOffsets[index].toFixed(2)}px)`;
    });

    const isSettling = topClicksOffsets.some((offset, index) => {
        const card = topClicks[index];
        if (!card) {
            return false;
        }

        const rect = card.getBoundingClientRect();
        const distanceFromCenter = rect.top + (rect.height / 2) - viewportCenter;
        const strength = [0.08, 0.12, 0.16][index] || 0.08;
        const targetOffset = Math.max(-48, Math.min(48, distanceFromCenter * -strength));
        return Math.abs(targetOffset - offset) > 0.05;
    });

    if (isSettling) {
        topClicksFrame = window.requestAnimationFrame(updateTopClicksParallax);
    }
}

function requestTopClicksParallax() {
    if (!topClicksFrame) {
        topClicksFrame = window.requestAnimationFrame(updateTopClicksParallax);
    }
}

if (topClicks.length) {
    const sections = document.querySelector(".sections");
    sections?.addEventListener("scroll", requestTopClicksParallax, { passive: true });
    window.addEventListener("scroll", requestTopClicksParallax, { passive: true });
    window.addEventListener("resize", requestTopClicksParallax);
    requestTopClicksParallax();
}
