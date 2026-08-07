const JIKAN = 'https://api.jikan.moe/v4';
const ANILIST = 'https://graphql.anilist.co';

const SAMPLE_SOURCES = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
];

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
    { title: 'Attack on Titan', episodes: 25, year: 2013, rating: 8.5, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx16498-buvcRTBx4NSm.jpg', genres: ['Action', 'Drama', 'Fantasy'], status: 'Finished', synopsis: 'Humanity fights for survival behind enormous walls against man-eating giants called Titans.' },
    { title: 'Demon Slayer: Kimetsu no Yaiba', episodes: 26, year: 2019, rating: 8.3, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx101922-WBsBl0ClmgYL.jpg', genres: ['Action', 'Fantasy', 'Adventure'], status: 'Finished', synopsis: 'Tanjiro becomes a demon slayer to cure his sister Nezuko and avenge his family.' },
    { title: 'JUJUTSU KAISEN', episodes: 24, year: 2020, rating: 8.4, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx113415-LHBAeoZDIsnF.jpg', genres: ['Action', 'Supernatural'], status: 'Finished', synopsis: 'Yuji swallows a cursed finger and joins a school of sorcerers to fight curses.' },
    { title: 'Death Note', episodes: 37, year: 2006, rating: 8.4, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx1535-kUgkcrfOrkUM.jpg', genres: ['Thriller', 'Psychological'], status: 'Finished', synopsis: 'A student finds a notebook that kills anyone whose name is written in it.' },
    { title: 'My Hero Academia', episodes: 24, year: 2016, rating: 7.7, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21459-nYh85uj2Fuwr.jpg', genres: ['Action', 'School'], status: 'Finished', synopsis: 'A quirkless boy trains to become the world’s greatest hero.' },
    { title: 'Hunter x Hunter (2011)', episodes: 148, year: 2011, rating: 8.9, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11061-y5gsT1hoHuHw.png', genres: ['Action', 'Adventure'], status: 'Finished', synopsis: 'Gon becomes a Hunter to find his father and faces deadly challenges.' },
    { title: 'One-Punch Man', episodes: 12, year: 2015, rating: 8.3, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21087-B5DHjqZ3kW4b.jpg', genres: ['Action', 'Comedy'], status: 'Finished', synopsis: 'An overpowered hero defeats every villain with a single punch.' },
    { title: 'ONE PIECE', episodes: 1000, year: 1999, rating: 8.7, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21-ELSYx3yMPcKM.jpg', genres: ['Action', 'Adventure'], status: 'Airing', synopsis: 'Monkey D. Luffy sails with his pirate crew to find the One Piece treasure.' },
    { title: 'Tokyo Ghoul', episodes: 12, year: 2014, rating: 7.6, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/b20605-k665mVkSug8D.jpg', genres: ['Action', 'Horror'], status: 'Finished', synopsis: 'A student becomes half-ghoul and must live between both worlds.' },
    { title: 'Fullmetal Alchemist: Brotherhood', episodes: 64, year: 2009, rating: 9.0, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx5114-nSWCgQlmOMtj.jpg', genres: ['Action', 'Drama'], status: 'Finished', synopsis: 'Two brothers search for the Philosopher’s Stone after a forbidden alchemy ritual.' },
    { title: 'Naruto', episodes: 220, year: 2002, rating: 8.0, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20-dE6UHbFFg1A5.jpg', genres: ['Action', 'Adventure'], status: 'Finished', synopsis: 'A young ninja with a sealed demon works to become the leader of his village.' },
    { title: 'Sword Art Online', episodes: 25, year: 2012, rating: 7.6, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx11757-SxYDUzdr9rh2.jpg', genres: ['Action', 'Fantasy'], status: 'Finished', synopsis: 'Players trapped in a VR game must clear it to survive.' },
    { title: 'Sousou no Frieren', episodes: 28, year: 2023, rating: 9.3, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx154587-qQTzQnEJJ3oB.jpg', genres: ['Adventure', 'Drama', 'Fantasy'], status: 'Finished', synopsis: 'An elven mage journeys to a heaven to meet a long-lost friend.' },
    { title: 'Steins;Gate', episodes: 24, year: 2011, rating: 9.1, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx9253-tIUXF2gfU8Sg.jpg', genres: ['Sci-Fi', 'Thriller'], status: 'Finished', synopsis: 'A scientist discovers he can send messages to the past and alters fate.' },
    { title: 'A Silent Voice', episodes: 1, year: 2016, rating: 8.8, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx20954-sYRfE5jQRtSB.jpg', genres: ['Drama', 'Romance'], status: 'Finished', synopsis: 'A former bully seeks redemption with the deaf girl he once tormented.' },
    { title: 'Your Name.', episodes: 1, year: 2016, rating: 8.6, image: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx21519-SUo3ZQuCbYhJ.png', genres: ['Drama', 'Fantasy'], status: 'Finished', synopsis: 'Two strangers mysteriously swap bodies and change each other’s lives.' },
];

let animeList = [];
let source = '';
let current = null;
let currentEp = 1;
let lastQuery = '';

const $ = (id) => document.getElementById(id);
const grid = $('anime-grid');
const modal = $('modal');
const video = $('video');
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
    id: null,
    title: m.title.english || m.title.romaji,
    image: m.coverImage.large,
    rating: (m.averageScore || 0) / 10,
    episodes: m.episodes || 12,
    year: m.startDate.year || '',
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
    setSection('Trending Now', `${animeList.length} titles · ${source}`, '🔥');
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

function sourceFor(ep) {
    return SAMPLE_SOURCES[(ep - 1) % SAMPLE_SOURCES.length];
}

let episodeMeta = [];

function playEpisode(ep) {
    currentEp = ep;
    video.src = sourceFor(ep);
    video.play().catch(() => {});
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