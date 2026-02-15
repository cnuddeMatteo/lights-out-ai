let gridRows = 5, gridCols = 5, gridState = [];
let undoStack = [], isAiPlaying = false, isCustomMode = false;
let playerMoveCount = 0, aiMoveCount = 0, timerInterval, secondsElapsed = 0;
let mathSolutionQueue = [], aiBrainMode = "chasing", justChangedMode = false;
let bubbleTimeout;
let isSoundOn = true;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}

function playRobotSound() {
    playTone(800, 'sine', 0.1);
    setTimeout(() => playTone(1200, 'square', 0.05), 100);
}

// --- INITIALISATION UNIQUE ---
// --- INITIALISATION UNIQUE ---
window.onload = () => {
    // 1. Initialiser UI standard
    updateRobotUI();
    
    // Si la fonction updatePreview existe (page d'accueil), on la lance
    if (typeof updatePreview === "function") updatePreview();

    // 2. Message de bienvenue par défaut
    const bubble = document.getElementById('assistant-bubble');
    const text = document.getElementById('assistant-text');
    const nameDisplay = document.getElementById('robot-name-display');
    
    if(bubble && text && nameDisplay) {
        bubble.classList.remove('hidden-bubble');
        nameDisplay.classList.add('pulse-name');
        text.innerHTML = `Initialisation... Mode <b>Chasing</b> (Rouge) actif.`;
        
        // Timeout standard pour cacher la bulle
        setTimeout(() => {
            // On ne cache la bulle que si on n'est pas en train de charger une grille personnalisée
            if (!window.location.search.includes('loadgrid')) {
                bubble.classList.add('hidden-bubble');
                nameDisplay.classList.remove('pulse-name');
            }
        }, 4000);
    }

    // 3. GESTION DE L'IMPORTATION DEPUIS LA SIMULATION (TryInGame)
    const urlParams = new URLSearchParams(window.location.search);
    const loadGrid = urlParams.get('loadgrid');
    
    if (loadGrid) {
        // A. Récupération des dimensions
        const r = parseInt(urlParams.get('rows')) || 3;
        const c = parseInt(urlParams.get('cols')) || 3;
        
        // B. Lancement du jeu
        gridRows = r; gridCols = c;
        startGame(r); // Crée la grille vide et cache le menu
        
        // C. FORCER LE MODE MATHÉMATIQUE
        const aiSelect = document.getElementById('ai-mode-select');
        if(aiSelect) aiSelect.value = "math";
        aiBrainMode = "math";
        updateRobotUI(); // Le robot devient BLEU immédiatement
        
        // D. Remplissage de la grille (avec petit délai pour être sûr que le DOM est prêt)
        setTimeout(() => {
            // Remplissage visuel et logique
            for(let i=0; i<loadGrid.length; i++) {
                if(loadGrid[i] === '1') {
                    const row = Math.floor(i / c);
                    const col = i % c;
                    gridState[row][col] = 1;
                    const cell = document.getElementById(`c-${row}-${col}`);
                    if(cell) cell.classList.add('on');
                }
            }

            // E. PRÉ-CALCUL DE LA SOLUTION
            // On calcule tout de suite pour savoir combien de coups sont nécessaires
            mathSolutionQueue = solveGaussJordan(gridState, gridRows, gridCols);

            // F. EXPLICATION DU ROBOT
            if(text && bubble) {
                // On réaffiche la bulle (au cas où elle se serait fermée)
                bubble.classList.remove('hidden-bubble');
                nameDisplay.classList.add('pulse-name');
                playRobotSound();

                text.innerHTML = `
                    <b>Mode Laboratoire activé !</b><br>
                    J'ai importé la grille.<br>
                    Solution mathématique trouvée en <b>${mathSolutionQueue.length} coups</b>.<br>
                    <span style="color:#3b82f6">Clique sur <b>💡 Indice</b> pour que je te guide !</span>
                `;
                
                // On laisse le message affiché plus longtemps (8 secondes)
                setTimeout(() => {
                    bubble.classList.add('hidden-bubble');
                    nameDisplay.classList.remove('pulse-name');
                }, 8000);
            }
        }, 100);
    }
};

// --- GESTION DE L'APERÇU (PREVIEW) ---
function updatePreview() {
    let r = parseInt(document.getElementById('custom-rows').value) || 1;
    let c = parseInt(document.getElementById('custom-cols').value) || 1;
    const container = document.getElementById('grid-preview-container');

    if (!container) return;

    // Force les limites visuelles (8x8 max)
    if (r > 8) r = 8; if (c > 8) c = 8;
    if (r < 1) r = 1; if (c < 1) c = 1;

    container.style.gridTemplateRows = `repeat(${r}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
    container.innerHTML = '';

    for (let i = 0; i < r * c; i++) {
        const dot = document.createElement('div');
        dot.className = 'preview-cell';
        container.appendChild(dot);
    }
}

// --- LOGIQUE UI ROBOT ---
function updateRobotUI() {
    const select = document.getElementById('ai-mode-select');
    const modeValue = select ? select.value : "chasing";
    const container = document.querySelector('.robot-container');
    const nameDisplay = document.getElementById('robot-name-display');
    const statusDisplay = document.getElementById('current-ai-name');
    
    const aiName = modeValue === "chasing" ? "IA CHASING" : "IA MATHÉMATIQUE";
    
    if(nameDisplay) nameDisplay.innerText = aiName;
    if(statusDisplay) statusDisplay.innerText = modeValue === "chasing" ? "Chasing" : "Math";

    if(container && nameDisplay) {
        container.classList.remove('mode-chasing', 'mode-math');
        nameDisplay.classList.remove('mode-chasing', 'mode-math');
        container.classList.add(`mode-${modeValue}`);
        nameDisplay.classList.add(`mode-${modeValue}`);
    }
}

// --- JEU ---
function startGame(size) {
    gridRows = size; gridCols = size;
    isCustomMode = false;
    setupGame(true);
}

function startCustomMode() {
    let r = parseInt(document.getElementById('custom-rows').value);
    let c = parseInt(document.getElementById('custom-cols').value);
    
    // Validation stricte
    if(r > 8) r = 8; if(r < 1) r = 1;
    if(c > 8) c = 8; if(c < 1) c = 1;

    document.getElementById('custom-rows').value = r;
    document.getElementById('custom-cols').value = c;

    gridRows = r; gridCols = c;
    isCustomMode = true; 
    setupGame(false); 

    // Mode édition : on cache les contrôles de jeu, on affiche le bouton START
    document.querySelector('.controls').classList.add('invisible');
    const btn = document.getElementById('btn-start-custom');
    btn.classList.remove('hidden');
    btn.innerText = "LANCER LA PARTIE ►"; 
    
    const bubble = document.getElementById('assistant-bubble');
    if(bubble) {
        bubble.classList.remove('hidden-bubble');
        document.getElementById('assistant-text').innerHTML = "<b>Mode Création :</b> Allume les cases, puis lance la partie !";
        setTimeout(() => bubble.classList.add('hidden-bubble'), 4000);
    }
}

function checkAndPlayCustom() {
    // Vérification solvabilité
    const solution = solveGaussJordan(gridState, gridRows, gridCols);
    const isEmpty = gridState.every(row => row.every(cell => cell === 0));

    if (solution.length === 0 && !isEmpty) {
        playRobotSound();
        const bubble = document.getElementById('assistant-bubble');
        bubble.classList.remove('hidden-bubble');
        document.getElementById('assistant-text').innerText = "⚠️ Attention : Cette grille est mathématiquement impossible.";
        
        setTimeout(() => {
            if(confirm("Le robot a détecté que cette grille est impossible. Jouer quand même ?")) {
                startPlayingCustom();
            }
            bubble.classList.add('hidden-bubble');
        }, 500);
    } else {
        startPlayingCustom();
    }
}

function startPlayingCustom() {
    isCustomMode = false;
    document.getElementById('btn-start-custom').classList.add('hidden');
    document.querySelector('.controls').classList.remove('invisible');
    startTimer();
}

function setupGame(withScramble) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('game-layout').classList.remove('hidden');
    const select = document.getElementById('ai-mode-select');
    aiBrainMode = select ? select.value : "chasing";
    updateRobotUI();
    initGrid(withScramble);
    if(!isCustomMode) startTimer();
}

function showMenu() { location.href = "index.html"; }

function initGrid(withScramble) {
    const gridEl = document.getElementById('grid');
    gridEl.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    gridEl.innerHTML = '';
    gridState = Array(gridRows).fill().map(() => Array(gridCols).fill(0));
    undoStack = []; mathSolutionQueue = []; playerMoveCount = 0; aiMoveCount = 0;

    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `c-${r}-${c}`;
            cell.onclick = () => {
                if (!isAiPlaying) {
                    if(isCustomMode) {
                        // En mode création, on allume juste la case, pas les voisins
                        gridState[r][c] = 1 - gridState[r][c];
                        cell.classList.toggle('on', gridState[r][c] === 1);
                        playTone(200, 'sine', 0.05);
                    } else {
                        handleMove(r, c, "Joueur");
                    }
                }
            };
            gridEl.appendChild(cell);
        }
    }
    if (withScramble) scramble();
}

function handleMove(r, c, source = "IA") {
    if (source !== "Mélange") {
        undoStack.push(JSON.parse(JSON.stringify(gridState)));
        playTone(440, 'sine', 0.08);
        if (source === "Joueur") mathSolutionQueue = [];
    }

    const dirs = [[0,0], [1,0], [-1,0], [0,1], [0,-1]];
    dirs.forEach(([dr, dc]) => {
        let nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols) {
            gridState[nr][nc] = 1 - gridState[nr][nc];
            const el = document.getElementById(`c-${nr}-${nc}`);
            if(el) el.classList.toggle('on', gridState[nr][nc] === 1);
        }
    });

    if (source === "Joueur") playerMoveCount++;
    else if (source.startsWith("IA")) aiMoveCount++;
    
    if (source !== "Mélange") {
        const list = document.getElementById('move-list');
        if (list) {
            const item = document.createElement('div');
            item.className = 'move-item';
            const colorClass = source === "Joueur" ? "text-green" : "text-blue";
            item.innerHTML = `<span class="${colorClass}">> ${source}</span> [L:${r+1}, C:${c+1}]`;
            list.prepend(item);
        }
        document.querySelectorAll('.ai-target, .ai-source').forEach(el => el.classList.remove('ai-target', 'ai-source'));
        checkWin();
    }
}

// --- LOGIQUE IA ---
function toggleAI() {
    // SÉCURITÉ : Empêche l'IA de jouer si on est en train de créer la grille
    if (isCustomMode) return;

    isAiPlaying = !isAiPlaying;
    aiBrainMode = document.getElementById('ai-mode-select').value;
    document.getElementById('btn-play').innerText = isAiPlaying ? "Pause" : "Lecture IA";
    
    if(isAiPlaying) {
        if (aiBrainMode === "math" && mathSolutionQueue.length === 0) {
            mathSolutionQueue = solveGaussJordan(gridState, gridRows, gridCols);
        }
        runAI();
    }
}

async function runAI() {
    while (isAiPlaying) {
        let nextMove = null;
        let explanationCell = null;

        if (aiBrainMode === "chasing") {
            for (let r = 0; r < gridRows - 1; r++) {
                for (let c = 0; c < gridCols; c++) {
                    if (gridState[r][c] === 1) {
                        nextMove = { r: r + 1, c: c };
                        explanationCell = { r: r, c: c };
                        break; 
                    }
                }
                if (nextMove) break;
            }
        } else {
            if (mathSolutionQueue.length === 0) mathSolutionQueue = solveGaussJordan(gridState, gridRows, gridCols);
            if (mathSolutionQueue.length > 0) nextMove = mathSolutionQueue[0];
        }

        if (!nextMove) { stopAI(); break; }

        const targetEl = document.getElementById(`c-${nextMove.r}-${nextMove.c}`);
        if(targetEl) targetEl.classList.add('ai-target');

        if(explanationCell && aiBrainMode === "chasing") {
            const sourceEl = document.getElementById(`c-${explanationCell.r}-${explanationCell.c}`);
            if(sourceEl) sourceEl.classList.add('ai-source'); 
        }

        await new Promise(r => setTimeout(r, 600));

        if (!isAiPlaying) break;
        
        if (aiBrainMode === "chasing") handleMove(nextMove.r, nextMove.c, "IA-Chasing");
        else { mathSolutionQueue.shift(); handleMove(nextMove.r, nextMove.c, "IA-Math"); }
    }
}

function stopAI() { isAiPlaying = false; document.getElementById('btn-play').innerText = "Lecture IA"; }

function getHint() {
    // SÉCURITÉ : Pas d'indice pendant la création ou si l'IA joue déjà
    if (isAiPlaying || isCustomMode) return;

    const bubble = document.getElementById('assistant-bubble');
    const text = document.getElementById('assistant-text');
    const nameDisplay = document.getElementById('robot-name-display');
    const currentMode = document.getElementById('ai-mode-select').value;

    nameDisplay.classList.add('pulse-name');
    bubble.classList.remove('hidden-bubble');
    clearTimeout(bubbleTimeout);
    playRobotSound();

    // ... (Le reste de la fonction getHint est identique à avant) ...
    if (justChangedMode) {
        text.innerHTML = currentMode === "chasing" 
            ? "<b>Mode Chasing :</b> Je clique sous les lumières allumées."
            : "<b>Mode Math :</b> Je calcule la solution parfaite (Gauss-Jordan).";
        justChangedMode = false;
    } else {
        let hintMove = null;
        let hintType = "";

        if (currentMode === "chasing") {
            for (let r = 0; r < gridRows - 1; r++) {
                for (let c = 0; c < gridCols; c++) {
                    if (gridState[r][c] === 1) { hintMove = { r: r + 1, c: c }; hintType = "chasing"; break; }
                }
                if (hintMove) break;
            }
        } else {
            const hints = solveGaussJordan(gridState, gridRows, gridCols);
            if (hints.length > 0) { hintMove = hints[0]; hintType = "math"; } 
            else hintType = "impossible";
        }

        if (hintMove) {
            text.innerText = `Conseil : Clique en [${hintMove.r+1}, ${hintMove.c+1}]`;
            const cell = document.getElementById(`c-${hintMove.r}-${hintMove.c}`);
            if(cell) { cell.classList.add('ai-target'); setTimeout(() => cell.classList.remove('ai-target'), 2500); }
        } else {
            const isWin = gridState.every(r => r.every(cell => cell === 0));
            text.innerText = isWin ? "Bravo, c'est gagné !" : "Aucun mouvement logique trouvé.";
        }
    }
    bubbleTimeout = setTimeout(() => { bubble.classList.add('hidden-bubble'); nameDisplay.classList.remove('pulse-name'); }, 8000);
}

// EVENT LISTENERS
document.getElementById('ai-mode-select').addEventListener('change', function() {
    updateRobotUI();
    justChangedMode = true;
    const bubble = document.getElementById('assistant-bubble');
    const text = document.getElementById('assistant-text');
    bubble.classList.remove('hidden-bubble');
    text.innerText = `Noyau changé : ${this.value.toUpperCase()}.`;
    playRobotSound();
    setTimeout(() => bubble.classList.add('hidden-bubble'), 4000);
});

// GAUSS JORDAN
function solveGaussJordan(state, rows, cols) {
    const N = rows * cols;
    let matrix = Array(N).fill().map(() => Array(N + 1).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let i = r * cols + c;
            matrix[i][N] = state[r][c];
            [[0,0],[1,0],[-1,0],[0,1],[0,-1]].forEach(([dr, dc]) => {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) matrix[i][nr * cols + nc] = 1;
            });
        }
    }
    let pivot = 0;
    for (let j = 0; j < N && pivot < N; j++) {
        let sel = pivot;
        while (sel < N && matrix[sel][j] === 0) sel++;
        if (sel === N) continue;
        [matrix[pivot], matrix[sel]] = [matrix[sel], matrix[pivot]];
        for (let i = 0; i < N; i++) {
            if (i !== pivot && matrix[i][j] === 1) {
                for (let k = j; k <= N; k++) matrix[i][k] ^= matrix[pivot][k];
            }
        }
        pivot++;
    }
    let res = [];
    for (let i = 0; i < N; i++) {
        if (matrix[i][N] === 1) {
            let col = matrix[i].indexOf(1);
            if (col < N) res.push({ r: Math.floor(col / cols), c: col % cols });
        }
    }
    return res;
}

// UTILS
function undoMove() {
    // SÉCURITÉ : Pas d'annulation pendant la création
    if (undoStack.length === 0 || isAiPlaying || isCustomMode) return;
    
    gridState = undoStack.pop();
    playerMoveCount = Math.max(0, playerMoveCount - 1);
    mathSolutionQueue = [];
    gridState.forEach((row, r) => row.forEach((val, c) => {
        document.getElementById(`c-${r}-${c}`).classList.toggle('on', val === 1);
    }));
}
function checkWin() {
    if (isCustomMode) return;
    if (gridState.every(r => r.every(c => c === 0)) && (playerMoveCount > 0 || aiMoveCount > 0)) {
        clearInterval(timerInterval); isAiPlaying = false;
        document.getElementById('player-moves').innerText = playerMoveCount;
        document.getElementById('ai-moves').innerText = aiMoveCount;
        document.getElementById('final-time').innerText = document.getElementById('timer-display').innerText.split(' ')[2];
        document.getElementById('victory-overlay').classList.remove('hidden');
        playTone(523, 'triangle', 0.5);
    }
}
function startTimer() { clearInterval(timerInterval); secondsElapsed = 0; timerInterval = setInterval(() => { secondsElapsed++; let m = Math.floor(secondsElapsed/60).toString().padStart(2,'0'); let s = (secondsElapsed%60).toString().padStart(2,'0'); document.getElementById('timer-display').innerText = `TEMPS : ${m}:${s}`; }, 1000); }
function stopTimer() { clearInterval(timerInterval); }
function closeVictory() { document.getElementById('victory-overlay').classList.add('hidden'); }
function scramble() { for (let i = 0; i < (gridRows * gridCols); i++) handleMove(Math.floor(Math.random()*gridRows), Math.floor(Math.random()*gridCols), "Mélange"); playerMoveCount = 0; aiMoveCount = 0; document.getElementById('move-list').innerHTML = ''; }
// --- GESTION DU SON ---

// 1. Fonction modifiée pour vérifier si le son est actif
function playTone(freq, type, duration) {
    if (!isSoundOn) return; // SÉCURITÉ : Si son coupé, on arrête tout ici.

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    
    // Volume plus doux pour ne pas agresser les oreilles
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    osc.start(); 
    osc.stop(audioCtx.currentTime + duration);
}

// 2. Fonction pour activer/désactiver le son (liée au bouton)
function toggleSound() {
    isSoundOn = !isSoundOn;
    const btn = document.getElementById('btn-sound-toggle');
    
    if (isSoundOn) {
        btn.innerHTML = '<i class="fas fa-volume-high"></i>';
        btn.classList.remove('sound-off');
        playMenuSound(); // Petit bip de confirmation
    } else {
        btn.innerHTML = '<i class="fas fa-volume-xmark"></i>';
        btn.classList.add('sound-off');
    }
}

// 3. Son spécifique pour les clics de menu (bip aigu et court)
function playMenuSound() {
    // 800Hz, onde sinusoïdale, très court (0.05s)
    playTone(800, 'sine', 0.05);
}