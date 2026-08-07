const JIKAN = 'https://api.jikan.moe/v4';
const ANILIST = 'https://graphql.anilist.co';

const GENRES = [
    { name: 'Action', id: 1 },
    { name: 'Adventure', id: 2 },
    { name: 'Comedy', id: 4 },
    { name: 'Drama', id: 8 },
    { name: 'Fantasy', id: 10 },
    { name: 'Horror', id: 14 },
    { name: 'Romance', id: 22 },
    { name: 'Sci-Fi', id: 24 },
    { name: 'Sports', id: 30 },
];

const FALLBACK_CATALOG = [
    { id: 16498, title: 'Attack on Titan', episodes: 25, year: 2013, rating: 8.5, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg', genres: ['Action', 'Drama', 'Fantasy'], status: 'Finished', synopsis: 'Humanity fights for survival behind enormous walls against man-eating giants called Titans.' },
    { id: 101922, title: 'Demon Slayer: Kimetsu no Yaiba', episodes: 26, year: 2019, rating: 8.3, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg', genres: ['Action', 'Fantasy', 'Adventure'], status: 'Finished', synopsis: 'Tanjiro becomes a demon slayer to cure his sister Nezuko and avenge his family.' },
    { id: 113415, title: 'JUJUTSU KAISEN', episodes: 24, year: 2020, rating: 8.4, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg', genres: ['Action', 'Supernatural'], status: 'Finished', synopsis: 'Yuji swallows a cursed finger and joins a school of sorcerers to fight curses.' },
    { id: 1535, title: 'Death Note', episodes: 37, year: 2006, rating: 8.4, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg', genres: ['Thriller', 'Psychological'], status: 'Finished', synopsis: 'A student finds a notebook that kills anyone whose name is written in it.' },
    { id: 21459, title: 'My Hero Academia', episodes: 24, year: 2016, rating: 7.7, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg', genres: ['Action', 'School'], status: 'Finished', synopsis: 'A quirkless boy trains to become the world’s greatest hero.' },
];

let animeList = [];
let source = '';
let current = null;
let currentEp = 1;
let lastQuery = '';

const $ = (id) => document.getElementById(id);
const grid = $('anime-grid');
const modal = $('modal');
const embedPlayer = $('embed-player');
const serverSelect = $('server-select');
const toastEl = $('toast');

function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

async function fetchRetry(url, tries = 3, delay = 1200) {
    let last;
    for (let i = 0; i < tries; i++) {
        try {
            const res = await fetch(url);
            if (res.ok) return await res.json();
            last = new Error(`HTTP ${res.status}`);
        } catch (e) {
            last = e;
        }
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
    throw last;
}

const mapJikan = (a) => ({
    id: a.mal_id,
    title: a.title_english || a.title,
    image: a.images.jpg.large_image_url || a.images.jpg.image_url,
    rating: a.score,
    episodes: a.episodes || 12,
    year: a.year || '',
    synopsis: (a.synopsis || '').slice(0, 320),
    genres: (a.genres || []).slice(0, 3).map((g) => g.name),
    status: a.status,
});

const mapAniList = (m) => ({
    id: m.id,
    title: m.title.english || m.title.romaji,
    image: m.coverImage.large,
    rating: (m.averageScore || 0) / 10,
    episodes: m.episodes || 12,
    year: m.startDate ? m.startDate.year : '',
    synopsis: '',
    genres: (m.genres || []).slice(0, 3),
    status: m.status || '',
});

async function postAniList(query, variables = {}) {
    const res = await fetch(ANILIST, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}

const ANILIST_BASE = `
    id
    title { romaji english }
    startDate { year }
    coverImage { large }
    averageScore episodes genres status
`;

async function loadTrending() {
    try {
        const pages = await Promise.all(
            [1, 2, 3, 4].map((p) => fetchRetry(`${JIKAN}/top/anime?limit=25&type=tv&page=${p}`, 2, 1000))
        );
        const seen = new Set();
        animeList = pages
            .flatMap((pg) => pg.data)
            .filter((a) => (seen.has(a.mal_id) ? false : (seen.add(a.mal_id), true)))
            .map(mapJikan);
        source = 'MyAnimeList';
    } catch {
        try {
            const data = await postAniList(`query { Page(perPage: 50) { media(type: ANIME, sort: TRENDING_DESC) { ${ANILIST_BASE} } } }`);
            animeList = (data.data.Page.media || []).map(mapAniList);
            source = 'AniList';
        } catch {
            animeList = FALLBACK_CATALOG.slice();
            source = 'offline catalog';
        }
    }
    lastQuery = '';
    $('search').value = '';
    setSectionTitle('Trending Now', `${animeList.length} titles · ${source}`, '🔥');
    render();
}

async function searchAnime(q) {
    lastQuery = q;
    try {
        const data = await fetchRetry(`${JIKAN}/anime?q=${encodeURIComponent(q)}&limit=30&sfw=true`, 2, 1000);
        animeList = data.data.map(mapJikan);
        source = 'MyAnimeList';
    } catch {
        const res = await postAniList(`query ($q: String) { Page(perPage: 30) { media(type: ANIME, search: $q) { ${ANILIST_BASE} } } }`, { q });
        animeList = (res.data.Page.media || []).map(mapAniList);
        source = 'AniList';
    }
    setSectionTitle(`Results for "${q}"`, `${animeList.length} titles · ${source}`, '🔎');
    render();
}

async function loadGenre(genre) {
    lastQuery = '';
    $('search').value = '';
    try {
        const data = await fetchRetry(`${JIKAN}/anime?genres=${genre.id}&limit=24&order_by=score&sort=desc`, 2, 1000);
        animeList = data.data.map(mapJikan);
        source = 'MyAnimeList';
    } catch {
        const res = await postAniList(`query ($g: String) { Page(perPage: 24) { media(type: ANIME, genre: $g, sort: POPULARITY_DESC) { ${ANILIST_BASE} } } }`, { g: genre.name });
        animeList = res.data.Page.media.map(mapAniList);
        source = 'AniList';
    }
    setSectionTitle(`${genre.name} Anime`, `${animeList.length} titles · ${source}`, '🎯');
    render();
}

function setSectionTitle(text, hint, emoji) {
    $('section-title').textContent = text;
    $('result-count').textContent = hint;
    document.title = `${emoji} ${text} — AniFlow`;
}

function render(filter = '') {
    const q = filter.trim().toLowerCase();
    const list = q
        ? animeList.filter((a) => (a.title + ' ' + (a.genres || []).join(' ')).toLowerCase().includes(q))
        : animeList;
    grid.innerHTML = '';
    if (!list.length) {
        $('empty').hidden = false;
        return;
    }
    $('empty').hidden = true;
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

function getEmbedUrl(animeId, ep, server) {
    switch (server) {
        case 'vidsrc2':
            return `https://vidsrc.cc/v2/embed/anime/${animeId}/${ep}`;
        case 'embed2':
            return `https://2embed.org/embed/anime/${animeId}/${ep}`;
        case 'vidsrc':
        default:
            return `https://vidsrc.icu/embed/anime/${animeId}/${ep}`;
    }
}

let episodeMeta = [];

function playEpisode(ep) {
    currentEp = ep;
    if (current && current.id) {
        embedPlayer.src = getEmbedUrl(current.id, ep, serverSelect.value);
    }
    $('mask-ep').textContent = ep;
    document.querySelectorAll('.ep-btn').forEach((b) => {
        b.classList.toggle('current', +b.dataset.ep === ep);
    });
    const meta = episodeMeta.find((m) => m.id === ep);
    if (meta) {
        $('ep-name').textContent = `Ep ${ep}: ${meta.title}`;
        $('ep-name').title = `${meta.title}${meta.aired ? ' — ' + meta.aired : ''}`;
    } else {
        $('ep-name').textContent = `Ep ${ep}`;
        $('ep-name').title = '';
    }
}

serverSelect.addEventListener('change', () => {
    if (current) {
        playEpisode(currentEp);
        toast(`Switched server to ${serverSelect.options[serverSelect.selectedIndex].text}`);
    }
});

function openAnime(anime) {
    current = anime;
    currentEp = 1;
    $('poster').src = anime.image;
    $('poster').alt = anime.title;
    $('anime-title').textContent = anime.title;
    $('synopsis').textContent = anime.synopsis || 'No synopsis available.';
    $('tags').innerHTML = `
        ${anime.status ? `<span class="tag accent2">${anime.status}</span>` : ''}
        ${(anime.genres || []).map((g) => `<span class="tag">${g}</span>`).join('')}
    `;
    const total = anime.episodes || 12;
    $('ep-count').textContent = `${total} episodes`;
    const list = $('ep-list');
    list.innerHTML = '';
    episodeMeta = [];
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
    if (anime.id) loadEpisodeMeta(anime);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    playEpisode(1);
    toast(`Now playing ${anime.title} — Ep 1`);
}

function loadEpisodeMeta(anime) {
    fetch(`${JIKAN}/anime/${anime.id}/episodes`)
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((data) => {
            const total = anime.episodes || data.data.length || 12;
            for (let i = 1; i <= total; i++) {
                const raw = data.data[i - 1];
                if (!raw) continue;
                episodeMeta.push({
                    id: raw.mal_id,
                    title: raw.title || `Episode ${raw.mal_id}`,
                    aired: raw.aired ? raw.aired.slice(0, 10) : '',
                });
            }
            playEpisode(1);
            if (current) {
                $('ep-count').textContent = `${total} episodes · real titles from MyAnimeList`;
                const btns = document.querySelectorAll('.ep-btn');
                for (const m of episodeMeta) {
                    const b = btns[m.id - 1];
                    if (b) b.title = `${m.title}${m.aired ? ' · ' + m.aired : ''}`;
                }
            }
        })
        .catch(() => playEpisode(1));
}

function closeModal() {
    modal.hidden = true;
    embedPlayer.src = '';
    document.body.style.overflow = '';
}

$('modal-close').addEventListener('click', closeModal);
$('modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
});

$('player-mask').addEventListener('click', () => {
    $('player-mask').classList.add('hidden');
});

$('logo').addEventListener('click', () => {
    closeModal();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

$('surprise').addEventListener('click', () => {
    if (animeList.length) openAnime(animeList[Math.floor(Math.random() * animeList.length)]);
});

$('chips').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const name = chip.dataset.name;
    if (!name) { loadTrending(); return; }
    const genre = GENRES.find((g) => g.name === name);
    if (genre) loadGenre(genre);
});

let searchTimer = null;
$('search').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const q = e.target.value.trim();
    if (!q) {
        if (lastQuery) loadTrending();
        return;
    }
    searchTimer = setTimeout(() => searchAnime(q), 400);
});

loadTrending();
