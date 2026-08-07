const API = 'https://api.jikan.moe/v4';

const SAMPLE_SOURCES = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

let animeList = [];
let current = null;
let currentEp = 1;

const $ = (id) => document.getElementById(id);
const grid = $('anime-grid');
const modal = $('modal');
const video = $('video');
const toastEl = $('toast');

function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2600);
}

async function loadTrending() {
    try {
        const res = await fetch(`${API}/top/anime?limit=24&type=tv`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        animeList = data.data.map((a) => ({
            id: a.mal_id,
            title: a.title_english || a.title,
            image: a.images.jpg.large_image_url || a.images.jpg.image_url,
            rating: a.score,
            episodes: a.episodes || 12,
            year: a.year || '',
            synopsis: (a.synopsis || '').slice(0, 320),
            genres: (a.genres || []).slice(0, 3).map((g) => g.name),
            status: a.status,
        }));
        render();
        $('result-count').textContent = `${animeList.length} titles`;
    } catch {
        $('skeleton').hidden = true;
        toast('Could not load anime right now. Try again in a moment.');
    }
}

function render(filter = '') {
    const q = filter.trim().toLowerCase();
    const list = q
        ? animeList.filter((a) => (a.title + ' ' + a.genres.join(' ')).toLowerCase().includes(q))
        : animeList;
    grid.innerHTML = '';
    $('skeleton').hidden = true;
    $('empty').hidden = list.length > 0;
    list.forEach((a, i) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.style.animationDelay = `${Math.min(i * 55, 700)}ms`;
        el.innerHTML = `
            <img src="${a.image}" alt="${a.title}" loading="lazy">
            ${a.rating ? `<span class="rating-pill">★ ${a.rating.toFixed(1)}</span>` : ''}
            <div class="card-play">▶</div>
            <div class="card-overlay">
                <div class="card-title">${a.title}</div>
                <div class="card-sub">
                    ${a.year ? `<span>${a.year}</span>` : ''}
                    ${a.episodes ? `<span>${a.episodes} eps</span>` : ''}
                </div>
            </div>`;
        el.addEventListener('click', () => openAnime(a));
        grid.appendChild(el);
    });
}

function sourceFor(ep) {
    return SAMPLE_SOURCES[(ep - 1) % SAMPLE_SOURCES.length];
}

function playEpisode(ep) {
    currentEp = ep;
    video.src = sourceFor(ep);
    video.play().catch(() => {});
    $('mask-ep').textContent = ep;
    document.querySelectorAll('.ep-btn').forEach((b) => {
        b.classList.toggle('current', +b.dataset.ep === ep);
    });
}

function openAnime(anime) {
    current = anime;
    currentEp = 1;
    $('poster').src = anime.image;
    $('poster').alt = anime.title;
    $('anime-title').textContent = anime.title;
    $('synopsis').textContent = anime.synopsis || 'No synopsis available.';
    $('tags').innerHTML = `
        ${anime.status ? `<span class="tag accent2">${anime.status}</span>` : ''}
        ${anime.genres.map((g) => `<span class="tag">${g}</span>`).join('')}
    `;
    const total = anime.episodes || 12;
    $('ep-count').textContent = `${total} episodes`;
    const list = $('ep-list');
    list.innerHTML = '';
    for (let i = 1; i <= total; i++) {
        const b = document.createElement('button');
        b.className = 'ep-btn';
        b.dataset.ep = i;
        b.textContent = i;
        b.addEventListener('click', () => {
            playEpisode(i);
            toast(`Episode ${i} — ${anime.title}`);
        });
        list.appendChild(b);
    }
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    playEpisode(1);
    toast(`Now playing ${anime.title} — Ep 1`);
}

function closeModal() {
    modal.hidden = true;
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.style.overflow = '';
}

$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});
video.addEventListener('play', () => $('player-mask').classList.add('hidden'));
video.addEventListener('pause', () => $('player-mask').classList.remove('hidden'));
$('player-mask').addEventListener('click', () => video.play());
$('logo').addEventListener('click', () => {
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
$('surprise').addEventListener('click', () => {
    if (animeList.length) openAnime(animeList[Math.floor(Math.random() * animeList.length)]);
});
$('search').addEventListener('input', (e) => render(e.target.value));

loadTrending();
