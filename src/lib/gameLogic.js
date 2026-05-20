// Roba, Dispara, Whisky - Game Logic
// Duelo del salvaje oeste con mecánica piedra-papel-tijera

// === CONSTANTES ===

export const ACTION_TYPES = {
    LOOT: 'loot',
    SHOOT: 'shoot',
    WHISKY: 'whisky'
};

export const ACTION_ICONS = {
    loot: '🤚',
    shoot: '🔫',
    whisky: '🥃'
};

export const ACTION_NAMES = {
    loot: 'Robar',
    shoot: 'Disparar',
    whisky: 'Whisky'
};

export const SALOON_TYPES = {
    GOLD: 'gold',
    EXTRA_SHOT: 'extra_shot',
    EXTRA_WHISKY: 'extra_whisky'
};

export const SALOON_ICONS = {
    gold: '🪙',
    extra_shot: '🔫',
    extra_whisky: '🥃'
};

// Condiciones de victoria
export const WIN_CONDITIONS = {
    GOLD: 9,
    BULLETS: 4,
    WHISKY: 3 // 3 veces tener la botella (llena -> casi vacía -> vacía)
};

// Botella de whisky estados
export const BOTTLE_STATE = {
    NONE: 'none',
    FULL: 'full',
    ALMOST_EMPTY: 'almost_empty'
};

// === CREACIÓN DEL MAZO DE SALÓN ===

export function createSaloonDeck() {
    const cards = [];
    let id = 0;

    // 2 cartas de 3 pepitas de oro
    for (let i = 0; i < 2; i++) {
        cards.push({
            id: id++,
            type: SALOON_TYPES.GOLD,
            value: 3
        });
    }
    // 3 cartas de 4 pepitas de oro
    for (let i = 0; i < 3; i++) {
        cards.push({
            id: id++,
            type: SALOON_TYPES.GOLD,
            value: 4
        });
    }
    // 2 cartas de 5 pepitas de oro
    for (let i = 0; i < 2; i++) {
        cards.push({
            id: id++,
            type: SALOON_TYPES.GOLD,
            value: 5
        });
    }
    // 1 carta de 6 pepitas de oro
    cards.push({
        id: id++,
        type: SALOON_TYPES.GOLD,
        value: 6
    });

    // 3 cartas de trago de whisky
    for (let i = 0; i < 3; i++) {
        cards.push({
            id: id++,
            type: SALOON_TYPES.EXTRA_WHISKY,
            value: 0
        });
    }

    // 2 cartas de caja de balas
    for (let i = 0; i < 2; i++) {
        cards.push({
            id: id++,
            type: SALOON_TYPES.EXTRA_SHOT,
            value: 0
        });
    }

    return shuffle(cards);
}


// === CARTAS DE ACCIÓN ===

export function createActionCards(playerId) {
    return [{
        id: `${playerId}-loot-1`,
        type: ACTION_TYPES.LOOT,
        used: false
    },
    {
        id: `${playerId}-loot-2`,
        type: ACTION_TYPES.LOOT,
        used: false
    },
    {
        id: `${playerId}-shoot-1`,
        type: ACTION_TYPES.SHOOT,
        used: false
    },
    {
        id: `${playerId}-shoot-2`,
        type: ACTION_TYPES.SHOOT,
        used: false
    },
    {
        id: `${playerId}-whisky-1`,
        type: ACTION_TYPES.WHISKY,
        used: false
    },
    {
        id: `${playerId}-whisky-2`,
        type: ACTION_TYPES.WHISKY,
        used: false
    },
    ];
}

// === UTILIDADES ===

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// === INICIALIZACIÓN ===

export function initializeGame() {
    const saloonDeck = createSaloonDeck();
    const display = saloonDeck.splice(0, 4);

    return {
        players: [{
            id: 0,
            name: 'Jugador 1',
            actionCards: createActionCards(0),
            gold: 0,
            bullets: 0,
            whiskyCount: 0, // veces que ha tenido/volteado la botella
            hasBottle: false,
            bottleState: BOTTLE_STATE.NONE
        },
        {
            id: 1,
            name: 'Jugador 2',
            actionCards: createActionCards(1),
            gold: 0,
            bullets: 0,
            whiskyCount: 0,
            hasBottle: false,
            bottleState: BOTTLE_STATE.NONE
        }
        ],
        saloonDeck,
        display, // 4 cartas de salón visibles
        discardPile: [],
        phase: 1, // 1 o 2
        // Acciones colocadas: [slot0, slot1, slot2, slot3] cada slot = { p1: actionCard, p2: actionCard }
        placements: [null, null, null, null],
        gameState: 'selecting', // 'selecting' | 'revealing' | 'finished'
        currentSelectingPlayer: 0, // para pass & play
        selectingSlots: [0, 1], // qué slots se están seleccionando (fase 1: [0,1], fase 2: [2,3])
        winner: null,
        victoryType: null,
        roundNumber: 1,
        lastResolution: null
    };
}

// === SELECCIÓN DE CARTAS (Pass & Play) ===

// Un jugador coloca sus 2 cartas de acción en los slots correspondientes
export function placeActions(gameState, playerIndex, slot1CardId, slot2CardId) {
    const state = JSON.parse(JSON.stringify(gameState));
    const player = state.players[playerIndex];
    const [slotA, slotB] = state.selectingSlots;

    const card1 = player.actionCards.find(c => c.id === slot1CardId);
    const card2 = player.actionCards.find(c => c.id === slot2CardId);

    if (!card1 || !card2) return state;

    // Marcar como usadas
    player.actionCards = player.actionCards.map(c => {
        if (c.id === slot1CardId || c.id === slot2CardId) {
            return {
                ...c,
                used: true
            };
        }
        return c;
    });

    // Colocar en los slots
    if (!state.placements[slotA]) {
        state.placements[slotA] = {};
    }
    if (!state.placements[slotB]) {
        state.placements[slotB] = {};
    }

    const key = playerIndex === 0 ? 'p1' : 'p2';
    state.placements[slotA][key] = card1.type;
    state.placements[slotB][key] = card2.type;

    // Pasar al siguiente jugador o a revelación
    if (playerIndex === 0) {
        state.currentSelectingPlayer = 1;
    } else {
        state.gameState = 'revealing';
        state.currentSelectingPlayer = 0;
    }

    return state;
}

// === RESOLUCIÓN ===

// Determinar ganador de un enfrentamiento
export function getWinner(action1, action2) {
    if (action1 === action2) return 'tie';

    // Whisky vence a Shoot
    if (action1 === ACTION_TYPES.WHISKY && action2 === ACTION_TYPES.SHOOT) return 0;
    if (action2 === ACTION_TYPES.WHISKY && action1 === ACTION_TYPES.SHOOT) return 1;

    // Shoot vence a Loot
    if (action1 === ACTION_TYPES.SHOOT && action2 === ACTION_TYPES.LOOT) return 0;
    if (action2 === ACTION_TYPES.SHOOT && action1 === ACTION_TYPES.LOOT) return 1;

    // Loot vence a Whisky
    if (action1 === ACTION_TYPES.LOOT && action2 === ACTION_TYPES.WHISKY) return 0;
    if (action2 === ACTION_TYPES.LOOT && action1 === ACTION_TYPES.WHISKY) return 1;

    return 'tie';
}

// Dar la botella de whisky a un jugador
function giveWhisky(state, playerIndex) {
    const player = state.players[playerIndex];
    const opponent = state.players[1 - playerIndex];

    if (!player.hasBottle) {
        // Tomar la botella (del centro o del oponente)
        if (opponent.hasBottle) {
            opponent.hasBottle = false;
            opponent.bottleState = BOTTLE_STATE.NONE;
            opponent.whiskyCount = 0;
        }
        player.hasBottle = true;
        player.bottleState = BOTTLE_STATE.FULL;
        player.whiskyCount = 1;
    } else if (player.bottleState === BOTTLE_STATE.FULL) {
        // Voltear a casi vacía
        player.bottleState = BOTTLE_STATE.ALMOST_EMPTY;
        player.whiskyCount = 2;
    } else if (player.bottleState === BOTTLE_STATE.ALMOST_EMPTY) {
        // ¡Vaciar! Victoria
        player.whiskyCount = 3;
        state.winner = playerIndex;
        state.victoryType = 'whisky';
        state.gameState = 'finished';
    }

    return state;
}

// Dar una bala a un jugador
function giveBullet(state, playerIndex) {
    const player = state.players[playerIndex];
    player.bullets += 1;

    if (player.bullets >= WIN_CONDITIONS.BULLETS) {
        state.winner = playerIndex;
        state.victoryType = 'bullets';
        state.gameState = 'finished';
    }

    return state;
}

// Dar oro a un jugador
function giveGold(state, playerIndex, amount) {
    const player = state.players[playerIndex];
    player.gold += amount;

    if (player.gold >= WIN_CONDITIONS.GOLD) {
        state.winner = playerIndex;
        state.victoryType = 'gold';
        state.gameState = 'finished';
    }

    return state;
}

// Resolver un slot individual
function resolveSlot(state, slotIndex) {
    const placement = state.placements[slotIndex];
    if (!placement || !placement.p1 || !placement.p2) return state;

    const action1 = placement.p1;
    const action2 = placement.p2;
    const saloonCard = state.display[slotIndex];
    const winner = getWinner(action1, action2);

    const resolution = {
        slot: slotIndex,
        action1,
        action2,
        winner,
        saloonCard,
        effect: null
    };

    if (winner === 'tie') {
        // Empate: descartar carta de salón
        if (saloonCard) {
            state.discardPile.push(saloonCard);
            state.display[slotIndex] = null;
        }
        resolution.effect = 'discard';
    } else {
        const winnerAction = winner === 0 ? action1 : action2;

        if (winnerAction === ACTION_TYPES.WHISKY) {
            // Whisky vence a Shoot: ganador toma/voltea botella
            state = giveWhisky(state, winner);
            resolution.effect = 'whisky';
            // La carta de salón permanece
        } else if (winnerAction === ACTION_TYPES.SHOOT) {
            // Shoot vence a Loot: ganador toma bala
            state = giveBullet(state, winner);
            resolution.effect = 'bullet';
            // La carta de salón permanece
        } else if (winnerAction === ACTION_TYPES.LOOT) {
            // Loot vence a Whisky: ganador toma carta de salón
            if (saloonCard) {
                if (saloonCard.type === SALOON_TYPES.GOLD) {
                    state = giveGold(state, winner, saloonCard.value);
                    resolution.effect = 'gold';
                } else if (saloonCard.type === SALOON_TYPES.EXTRA_SHOT) {
                    state = giveBullet(state, winner);
                    resolution.effect = 'extra_bullet';
                } else if (saloonCard.type === SALOON_TYPES.EXTRA_WHISKY) {
                    state = giveWhisky(state, winner);
                    resolution.effect = 'extra_whisky';
                }
                state.discardPile.push(saloonCard);
                state.display[slotIndex] = null;
            }
        }
    }

    return {
        state,
        resolution
    };
}

// Resolver la fase actual (2 slots)
export function resolvePhase(gameState) {
    let state = JSON.parse(JSON.stringify(gameState));
    const [slotA, slotB] = state.selectingSlots;
    const resolutions = [];

    // Resolver slot A (más cercano al mazo)
    const resultA = resolveSlot(state, slotA);
    state = resultA.state;
    if (resultA.resolution) resolutions.push(resultA.resolution);

    // Si ya hay ganador, no resolver el segundo
    if (state.gameState === 'finished') {
        state.lastResolution = resolutions;
        return state;
    }

    // Resolver slot B
    const resultB = resolveSlot(state, slotB);
    state = resultB.state;
    if (resultB.resolution) resolutions.push(resultB.resolution);

    state.lastResolution = resolutions;

    // Si ya hay ganador, terminar
    if (state.gameState === 'finished') {
        return state;
    }

    // Avanzar fase
    if (state.phase === 1) {
        state.phase = 2;
        state.selectingSlots = [2, 3];
        state.gameState = 'selecting';
        state.placements = [state.placements[0], state.placements[1], null, null];
    } else {
        // Fin de ronda: preparar siguiente
        state = prepareNextRound(state);
    }

    return state;
}

// Preparar siguiente ronda
function prepareNextRound(state) {
    // Recuperar cartas de acción
    state.players[0].actionCards = createActionCards(0);
    state.players[1].actionCards = createActionCards(1);

    // Compactar display: mover cartas restantes hacia el inicio (deslizar hacia el mazo)
    const remaining = state.display.filter(c => c !== null);

    // Rellenar hasta 4 cartas desde el mazo
    while (remaining.length < 4 && state.saloonDeck.length > 0) {
        remaining.push(state.saloonDeck.shift());
    }

    if (remaining.length < 4) {
        // No se puede rellenar a 4: el juego termina
        state.gameState = 'finished';
        if (state.players[0].hasBottle) {
            state.winner = 0;
        } else if (state.players[1].hasBottle) {
            state.winner = 1;
        } else {
            state.winner = null;
        }
        state.victoryType = 'bottle_tiebreak';
        return state;
    }

    // Asignar el display compactado (las restantes al inicio, nuevas al final)
    state.display = remaining.slice(0, 4);

    state.phase = 1;
    state.selectingSlots = [0, 1];
    state.placements = [null, null, null, null];
    state.gameState = 'selecting';
    state.currentSelectingPlayer = 0;
    state.roundNumber++;

    return state;
}