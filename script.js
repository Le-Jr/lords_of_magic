/**
 * DevTriviador - Arcade Edition
 */

// --- CONFIG & ENUMS ---
const DIFFICULTIES = {
    0: { id: 0, label: 'VIBECODER', mult: 0.8, desc: 'Perguntas fáceis para relaxar.' },
    1: { id: 1, label: 'JUNINHO', mult: 1.0, desc: 'Conhecimentos básicos de dia a dia.' },
    2: { id: 2, label: 'PLENO', mult: 1.5, desc: 'Desafios reais do mercado.' },
    3: { id: 3, label: 'SENIOR', mult: 2.0, desc: 'Arquitetura e internals.' },
    4: { id: 4, label: 'LINUS TORVALDS', mult: 3.0, desc: 'Kernel, Assembly e loucuras. Erro: -5pts.' },
    5: { id: 5, label: 'MAGO SUPREMO', mult: 4.0, desc: 'Compiladores e magia negra. Erro: -10pts.' }
};

const TITLES = [
    { min: 0, label: 'VIBECODER' },
    { min: 50, label: 'JUNINHO' },
    { min: 150, label: 'PLENO' },
    { min: 350, label: 'SENIOR' },
    { min: 700, label: 'LINUS TORVALDS' },
    { min: 1200, label: 'MAGO SUPREMO' }
];

// --- QUESTION BANK --- 
// (Carregado via questions.js)

// --- STATE ---
const state = {
    screen: 'login',
    currentUser: null, // { nickname: '', xp: 0, title: '' }
    currentGame: {
        difficulty: 0,
        category: null,
        questions: [],
        index: 0,
        score: 0,
        xpSession: 0
    }
};

// --- DOM ---
const screens = {
    login: document.getElementById('screen-login'),
    home: document.getElementById('screen-home'),
    difficulty: document.getElementById('screen-difficulty'),
    category: document.getElementById('screen-category'),
    game: document.getElementById('screen-game'),
    result: document.getElementById('screen-result'),
    ranking: document.getElementById('screen-ranking')
};

// --- INIT ---
function init() {
    setupInputs();
    setupNavigation();
    
    // Auto-focus logic
    document.getElementById('login-input').focus();
}

// --- LOGIN SYSTEM ---
function setupInputs() {
    const loginInput = document.getElementById('login-input');
    const loginBtn = document.getElementById('btn-login');
    const errorMsg = document.getElementById('login-error');

    loginBtn.addEventListener('click', attemptLogin);
    loginInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptLogin();
        errorMsg.classList.add('hidden');
    });
}

function attemptLogin() {
    const input = document.getElementById('login-input');
    const nick = input.value.trim().toUpperCase();
    
    if (!nick || nick.length < 3) {
        showLoginError("NOME INVÁLIDO (MIN 3 CHARS)");
        return;
    }

    let users = JSON.parse(localStorage.getItem('DevTriviadorUsers') || '{}');
    
    if (users[nick]) {
        state.currentUser = users[nick];
    } else {
        state.currentUser = { nickname: nick, xp: 0 };
        users[nick] = state.currentUser;
        localStorage.setItem('DevTriviadorUsers', JSON.stringify(users));
    }
    
    updateHomeProfile();
    changeScreen('home');
}

function showLoginError(msg) {
    const err = document.getElementById('login-error');
    err.textContent = msg;
    err.classList.remove('hidden');
}

// --- HOME & PROFILE ---
function updateHomeProfile() {
    const user = state.currentUser;
    const title = getTitle(user.xp);
    
    document.getElementById('home-name').textContent = user.nickname;
    document.getElementById('home-title').textContent = title;
    document.getElementById('home-xp').textContent = user.xp;
}

function getTitle(xp) {
    let currentTitle = TITLES[0].label;
    for (let t of TITLES) {
        if (xp >= t.min) currentTitle = t.label;
    }
    return currentTitle;
}

// --- NAVIGATION ---
function setupNavigation() {
    document.getElementById('btn-goto-diff').addEventListener('click', () => {
        renderDifficultyScreen();
        changeScreen('difficulty');
    });

    document.getElementById('btn-ranking').addEventListener('click', () => {
        renderLeaderboard();
        changeScreen('ranking');
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        state.currentUser = null;
        document.getElementById('login-input').value = '';
        changeScreen('login');
    });
    
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => changeScreen(btn.dataset.target));
    });
    
    document.getElementById('btn-home').addEventListener('click', () => changeScreen('home'));
    document.getElementById('btn-replay').addEventListener('click', () => changeScreen('difficulty'));
}

function changeScreen(targetId) {
    // BUGFIX: Prevent race condition with setTimeout
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    
    const target = screens[targetId];
    if (target) {
        target.classList.remove('hidden');
        // Force reflow for potential generic animations
        void target.offsetWidth;
        target.classList.add('active');
    }
}

// --- DIFFICULTY & CATEGORY ---
function renderDifficultyScreen() {
    const grid = document.querySelector('.difficulty-grid');
    grid.innerHTML = '';
    
    Object.values(DIFFICULTIES).forEach(diff => {
        const card = document.createElement('div');
        card.className = 'diff-card';
        card.innerHTML = `
            <h3>${diff.label}</h3>
            <p style="font-size: 0.8rem; color: #888">MULT: x${diff.mult}</p>
            <p style="font-size: 0.9rem; margin-top:0.5rem">${diff.desc}</p>
        `;
        card.addEventListener('click', () => {
            state.currentGame.difficulty = diff.id;
            renderCategoryScreen(); // Go to Category next
            changeScreen('category');
        });
        grid.appendChild(card);
    });
}

function renderCategoryScreen() {
    const grid = document.querySelector('.category-grid');
    grid.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'diff-card'; // Reuse style
        card.innerHTML = `<h3>${cat.name}</h3>`;
        card.addEventListener('click', () => startGame(cat.id));
        grid.appendChild(card);
    });
}

// --- GAME ENGINE ---
function startGame(categoryId) {
    console.log("Starting Game...", { categoryId, difficulty: state.currentGame.difficulty });

    state.currentGame.category = categoryId;
    state.currentGame.score = 0;
    state.currentGame.xpSession = 0;
    state.currentGame.index = 0;
    
    const diffId = Number(state.currentGame.difficulty); // Ensure number
    const questions = window.QUESTION_BANK || [];
    
    if (!questions.length) {
        console.error("QUESTION_BANK is empty or undefined!");
        alert("Erro: Banco de perguntas não carregado.");
        return;
    }

    const pool = questions.filter(q => q.level === diffId && q.category === categoryId);
    
    console.log("Filtered Pool:", pool);

    // Shuffle and pick 10 (or less if not enough)
    state.currentGame.questions = pool.sort(() => 0.5 - Math.random()).slice(0, 10);
    
    if (state.currentGame.questions.length === 0) {
        console.warn("No questions found for this combo.");
        alert("Nenhuma pergunta encontrada para este nível/categoria neste MVP! Tente outro.");
        return;
    }
    
    changeScreen('game');
    loadQuestion();
}

function loadQuestion() {
    const game = state.currentGame;
    const q = game.questions[game.index];
    const diff = DIFFICULTIES[game.difficulty];
    
    // Update HUD
    document.getElementById('game-diff-label').textContent = diff.label;
    document.getElementById('game-score').textContent = `SCORE: ${game.score}`;
    document.getElementById('q-category').textContent = q.category.toUpperCase();
    document.getElementById('game-q-count').textContent = `${game.index + 1}/${game.questions.length}`;
    document.getElementById('q-text').textContent = q.question;
    
    // Options
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    // Shuffle options
    const shuffledOpts = [...q.options].sort(() => 0.5 - Math.random());
    
    shuffledOpts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn option-btn-arcade';
        btn.textContent = opt;
        btn.dataset.value = opt;
        btn.onclick = () => handleAnswer(btn, q);
        container.appendChild(btn);
    });
    
    // Hide feedback
    document.getElementById('feedback-overlay').classList.add('hidden');
}

function handleAnswer(btn, q) {
    // Disable all
    const allBtns = document.querySelectorAll('.option-btn-arcade');
    allBtns.forEach(b => b.onclick = null);
    
    const selected = btn.dataset.value;
    const isCorrect = selected === q.answer;
    const diff = DIFFICULTIES[state.currentGame.difficulty];
    
    // Highlights
    if (isCorrect) {
        btn.classList.add('correct');
        // Calculate Score
        // Base 10 * Mult
        const points = Math.round(10 * diff.mult);
        state.currentGame.score += points;
        state.currentGame.xpSession += points; // XP = Score for simplicity, or separate? Prompt doesnt specify.
        
        showFeedback(true, `+${points} PTS`, q.explanation);
    } else {
        btn.classList.add('wrong');
        // Highlight correct
        allBtns.forEach(b => {
             if (b.dataset.value === q.answer) b.classList.add('correct');
        });
        
        // Penalty?
        let penalty = 0;
        if (diff.id === 4) penalty = 5; // Linus
        if (diff.id === 5) penalty = 10; // Mage
        
        state.currentGame.score -= penalty;
        // Cap score at 0? Or negative? Prompt implies penalty, usually strict.
        // Let's allow negative score in game, but maybe XP doesn't go negative?
        
        showFeedback(false, penalty > 0 ? `-${penalty} PTS` : 'MISS!', q.explanation);
    }
}

function showFeedback(isWin, title, desc) {
    const overlay = document.getElementById('feedback-overlay');
    const fTitle = document.getElementById('feedback-title');
    const fText = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('btn-next-q');
    
    fTitle.textContent = title;
    fTitle.style.color = isWin ? 'var(--terminal-green)' : 'var(--alert-red)';
    fText.textContent = desc;
    
    overlay.classList.remove('hidden');
    
    nextBtn.onclick = () => {
        state.currentGame.index++;
        if (state.currentGame.index < state.currentGame.questions.length) {
            loadQuestion();
        } else {
            endGame();
        }
    };
}

function endGame() {
    // Persist
    const game = state.currentGame;
    const user = state.currentUser;
    
    user.xp += Math.max(0, game.xpSession); // Don't reduce user XP on bad game
    
    // Update Users DB
    let users = JSON.parse(localStorage.getItem('DevTriviadorUsers') || '{}');
    users[user.nickname] = user;
    localStorage.setItem('DevTriviadorUsers', JSON.stringify(users));
    
    // Update Rankings (Top Scores Global? Or Users by XP?)
    // Prompt 4: "Ranking deve exibir: Nickname, Título atual, XP total".
    // This implies the Ranking is a Leaderboard of Users by XP.
    // NOTE: Previous implementation was "Run Score". This one is "Total XP".
    // I will use `users` map to build ranking.
    
    // Update Result Screen
    document.getElementById('result-score').textContent = game.score;
    document.getElementById('result-xp').textContent = `+${game.xpSession}`;
    
    updateHomeProfile();
    changeScreen('result');
}

// --- RANKING LOGIC ---
function getRanking() {
    let users = JSON.parse(localStorage.getItem('DevTriviadorUsers') || '{}');
    return Object.values(users).sort((a, b) => b.xp - a.xp);
}

function renderLeaderboard() {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';
    
    const ranking = getRanking();
    
    if (ranking.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">NO DATA</td></tr>';
        return;
    }
    
    ranking.forEach((u, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${idx + 1}</td>
            <td>${u.nickname}</td>
            <td>${getTitle(u.xp)}</td>
            <td>${u.xp}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Start
init();
