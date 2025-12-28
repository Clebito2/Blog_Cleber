function renderPosts() {
    const container = document.getElementById('posts-container');
    const featuredContainer = document.getElementById('featured-post-container');

    if (!container || !featuredContainer) return;

    container.innerHTML = '';
    featuredContainer.innerHTML = '';

    const featured = blogData.posts.find(p => p.featured);
    const others = blogData.posts.filter(p => !p.featured);

    // Render Featured
    if (featured) {
        featuredContainer.innerHTML = `
            <article onclick="viewPost(${featured.id})" class="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-center fade-in-up delay-200">
                <div class="lg:col-span-7 relative overflow-hidden rounded-lg h-[400px] lg:h-[500px]">
                    <div class="absolute inset-0 bg-charcoal/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src="${featured.image}" 
                         alt="${featured.title}" 
                         class="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out">
                </div>
                <div class="lg:col-span-5 flex flex-col justify-center">
                    <div class="flex items-center gap-3 font-mono text-xs text-slate mb-4">
                        <span class="uppercase tracking-widest">${featured.category}</span>
                        <span class="w-1 h-1 rounded-full bg-terracotta"></span>
                        <span>${featured.date}</span>
                    </div>
                    <h2 class="font-serif text-3xl md:text-4xl text-charcoal font-bold leading-tight mb-6 group-hover:text-terracotta transition-colors duration-300">
                        ${featured.title}
                    </h2>
                    <p class="font-sans text-slate text-base leading-loose font-light mb-6 drop-cap text-justify line-clamp-4">
                        ${featured.description}
                    </p>
                    <div class="flex items-center gap-2 group/link">
                        <span class="font-mono text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-1 group-hover/link:text-terracotta group-hover/link:border-terracotta transition-all">Ler Texto Completo</span>
                        <i class="fa-solid fa-arrow-right -rotate-45 group-hover/link:rotate-0 transition-transform duration-300 text-xs"></i>
                    </div>
                </div>
            </article>
        `;
    }

    // Render Others
    others.forEach(post => {
        const html = `
            <article onclick="viewPost(${post.id})" class="group cursor-pointer flex flex-col">
                <div class="aspect-[16/9] overflow-hidden rounded-lg mb-5 bg-gray-200 relative">
                     <img src="${post.image}" alt="${post.title}" class="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0">
                </div>
                <div class="font-mono text-[10px] text-terracotta uppercase tracking-widest mb-2">${post.category}</div>
                <h3 class="font-serif text-2xl text-charcoal font-bold leading-snug mb-3 group-hover:underline decoration-1 underline-offset-4">
                    ${post.title}
                </h3>
                <p class="font-sans text-base text-slate leading-relaxed line-clamp-3">
                    ${post.description}
                </p>
            </article>
        `;
        container.innerHTML += html;
    });
}

// Routing Logic
function handleHashChange() {
    const hash = window.location.hash;

    // Ignore non-post hashes (like #contato, #newsletter) to prevent conflict with anchors
    if (hash.startsWith('#post?id=')) {
        const id = hash.replace('#post?id=', '');
        // Determine if ID is number (blog) or string (tool)
        let finalId = id;
        // Check if it's a number
        if (!isNaN(parseInt(id)) && /^\d+$/.test(id)) {
            finalId = parseInt(id);
        }

        renderPostDetails(finalId);
    } else {
        // If hash is empty or not a post hash, verify if we need to close the post view
        const view = document.getElementById('single-post-view');
        if (view && !view.classList.contains('hidden')) {
            closePostDetails();
        }
    }
}

// Trigger hash change to view post
function viewPost(id) {
    window.location.hash = `post?id=${id}`;
}

// Trigger hash clear to close post
function closePost() {
    // Remove hash without scrolling (if possible) or just clear it
    if (window.location.hash.startsWith('#post?id=')) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        // Manually trigger handler because pushState doesn't trigger hashchange
        handleHashChange();
    } else {
        // Fallback
        closePostDetails();
    }
}

// Actual DOM Manipulation (UI Only)
function renderPostDetails(id) {
    let post = blogData.posts.find(p => p.id === id);
    if (!post && blogData.tools) {
        post = blogData.tools.find(t => t.id === id);
    }
    if (!post) return;

    // Populate View
    document.getElementById('post-category').innerText = post.category;
    document.getElementById('post-date').innerText = post.date || 'Data não disponível';
    document.getElementById('post-title').innerText = post.title || post.name;
    document.getElementById('post-image').src = post.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop";

    // Inject Content + Copy Link Button
    const contentContainer = document.getElementById('post-content');
    contentContainer.innerHTML = post.content;

    // Add Share Icon at Bottom
    const shareContainer = document.createElement('div');
    shareContainer.className = "flex justify-center mt-12 pt-8 opacity-50 hover:opacity-100 transition-opacity";
    shareContainer.innerHTML = `
        <button onclick="copyLink()" class="text-charcoal hover:text-terracotta transition-colors text-xl" title="Compartilhar Link">
            <i class="fa-solid fa-share-nodes"></i>
        </button>
    `;
    contentContainer.appendChild(shareContainer);

    // Toggle Views
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));

    const tabs = document.querySelector('.sticky.top-24');
    if (tabs) tabs.classList.add('hidden');

    const view = document.getElementById('single-post-view');
    view.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide Newsletter if Tool
    const isTool = blogData.tools.some(t => t.id === id);
    if (isTool) {
        document.getElementById('newsletter-section')?.classList.add('hidden');
    }

    // Update Page Title
    document.title = `${post.title || post.name} | Cléber Donato`;
}

function closePostDetails() {
    document.getElementById('single-post-view').classList.add('hidden');

    // Show tabs
    const tabs = document.querySelector('.sticky.top-24');
    if (tabs) tabs.classList.remove('hidden');

    // Restore Default Tab
    switchTab('blog');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    document.getElementById('newsletter-section')?.classList.remove('hidden');

    // Reset Page Title
    document.title = 'Cléber | Humanismo Digital';
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copiado para a área de transferência!');
    });
}


// Helpers
document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    renderTools();
    updateCounts();

    // Initialize Router
    window.addEventListener('hashchange', handleHashChange);
    // Check initial hash on load
    handleHashChange();
});

// Keep existing renderTools and updateCounts
function renderTools() {
    const container = document.getElementById('tools-container');
    if (!container) return;

    container.innerHTML = '';

    blogData.tools.forEach(tool => {
        let html = '';
        if (tool.content) {
            // Render as an Article Card (Clickable to view)
            html = `
                <div onclick="viewPost('${tool.id}')" class="group cursor-pointer p-6 border border-sand bg-white hover:border-charcoal transition-all duration-300 hover:shadow-hover rounded-sm relative overflow-hidden flex flex-col h-full">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                         <i class="fa-solid fa-book-open text-charcoal"></i>
                    </div>
                    <div class="font-mono text-[10px] text-terracotta mb-4 border border-terracotta/20 inline-block px-2 py-1 rounded-sm">${tool.category}</div>
                    <h4 class="font-serif text-xl font-bold text-charcoal mb-4">${tool.name}</h4>
                    <p class="font-sans text-sm text-slate leading-relaxed mb-6 flex-grow">
                        ${tool.description}
                    </p>
                     <div class="flex items-center gap-2 mt-auto">
                        <span class="font-mono text-xs uppercase tracking-widest text-charcoal border-b border-charcoal pb-1 group-hover:text-terracotta group-hover:border-terracotta transition-all">Ler Análise</span>
                    </div>
                </div>
            `;
        } else {
            // Render as a Standard Link Card
            html = `
                <a href="${tool.link}" class="group p-6 border border-sand bg-white hover:border-charcoal transition-all duration-300 hover:shadow-hover rounded-sm relative overflow-hidden flex flex-col h-full">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <i class="fa-solid fa-arrow-up-right-from-square text-charcoal"></i>
                    </div>
                    <div class="font-mono text-[10px] text-slate mb-4 border border-sand inline-block px-2 py-1 rounded-sm">${tool.category}</div>
                    <h4 class="font-serif text-xl font-bold text-charcoal mb-2">${tool.name}</h4>
                    <p class="font-sans text-sm text-slate leading-relaxed">
                        ${tool.description}
                    </p>
                </a>
            `;
        }
        container.innerHTML += html;
    });
}

function updateCounts() {
    const blogCount = document.getElementById('count-blog');
    const toolsCount = document.getElementById('count-tools');

    if (blogCount) blogCount.innerText = blogData.posts.length.toString().padStart(2, '0');
    if (toolsCount) toolsCount.innerText = blogData.tools.length.toString().padStart(2, '0');
}
