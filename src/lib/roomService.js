import {
    db
} from './firebase.js';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    onSnapshot,
    deleteDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    createSaloonDeck,
    createActionCards,
    BOTTLE_STATE
} from './gameLogic.js';

// Generar código de sala de 4 caracteres
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}

// Crear sala
export async function createRoom(playerName) {
    const code = generateRoomCode();
    const saloonDeck = createSaloonDeck();
    const display = saloonDeck.splice(0, 4);

    const roomData = {
        code,
        status: 'waiting', // waiting | playing | finished
        createdAt: serverTimestamp(),
        players: {
            p1: {
                name: playerName,
                ready: true
            },
            p2: null
        },
        game: {
            saloonDeck,
            display,
            discardPile: [],
            phase: 1,
            placements: [null, null, null, null],
            selectingSlots: [0, 1],
            roundNumber: 1,
            p1: {
                gold: 0,
                bullets: 0,
                whiskyCount: 0,
                hasBottle: false,
                bottleState: BOTTLE_STATE.NONE,
                actionCards: createActionCards(0),
                selectedActions: [null, null],
                confirmed: false
            },
            p2: {
                gold: 0,
                bullets: 0,
                whiskyCount: 0,
                hasBottle: false,
                bottleState: BOTTLE_STATE.NONE,
                actionCards: createActionCards(1),
                selectedActions: [null, null],
                confirmed: false
            },
            winner: null,
            victoryType: null,
            lastResolution: null,
            p1ReadyToContinue: false,
            p2ReadyToContinue: false,
            p1WantsRematch: false,
            p2WantsRematch: false
        }
    };

    await setDoc(doc(db, 'rooms', code), roomData);
    return code;
}

// Unirse a sala
export async function joinRoom(code, playerName) {
    const roomRef = doc(db, 'rooms', code);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error('Sala no encontrada');
    }

    const data = roomSnap.data();

    if (data.players.p2 !== null) {
        throw new Error('Sala llena');
    }

    if (data.status !== 'waiting') {
        throw new Error('Partida ya iniciada');
    }

    await updateDoc(roomRef, {
        'players.p2': {
            name: playerName,
            ready: true
        },
        status: 'ready'
    });

    return data;
}

// Escuchar cambios en la sala
export function listenToRoom(code, callback) {
    const roomRef = doc(db, 'rooms', code);
    return onSnapshot(roomRef, (snap) => {
        if (snap.exists()) {
            callback(snap.data());
        } else {
            callback(null);
        }
    });
}

// Confirmar selección de cartas
export async function confirmSelection(code, playerKey, action1, action2) {
    const roomRef = doc(db, 'rooms', code);
    await updateDoc(roomRef, {
        [`game.${playerKey}.selectedActions`]: [action1, action2],
        [`game.${playerKey}.confirmed`]: true
    });
}

// Actualizar estado del juego (después de resolver)
export async function updateGameState(code, gameUpdate) {
    const roomRef = doc(db, 'rooms', code);
    await updateDoc(roomRef, gameUpdate);
}

// Reiniciar partida (jugar de nuevo)
export async function restartGame(code) {
    const roomRef = doc(db, 'rooms', code);
    const saloonDeck = createSaloonDeck();
    const display = saloonDeck.splice(0, 4);

    await updateDoc(roomRef, {
        status: 'playing',
        'game.saloonDeck': saloonDeck,
        'game.display': display,
        'game.discardPile': [],
        'game.phase': 1,
        'game.placements': [null, null, null, null],
        'game.selectingSlots': [0, 1],
        'game.roundNumber': 1,
        'game.winner': null,
        'game.victoryType': null,
        'game.lastResolution': null,
        'game.p1.gold': 0,
        'game.p1.bullets': 0,
        'game.p1.whiskyCount': 0,
        'game.p1.hasBottle': false,
        'game.p1.bottleState': BOTTLE_STATE.NONE,
        'game.p1.actionCards': createActionCards(0),
        'game.p1.selectedActions': [null, null],
        'game.p1.confirmed': false,
        'game.p2.gold': 0,
        'game.p2.bullets': 0,
        'game.p2.whiskyCount': 0,
        'game.p2.hasBottle': false,
        'game.p2.bottleState': BOTTLE_STATE.NONE,
        'game.p2.actionCards': createActionCards(1),
        'game.p2.selectedActions': [null, null],
        'game.p2.confirmed': false,
        'game.p1ReadyToContinue': false,
        'game.p2ReadyToContinue': false,
        'game.p1WantsRematch': false,
        'game.p2WantsRematch': false
    });
}

// Host inicia la partida
export async function startOnlineGame(code) {
    const roomRef = doc(db, 'rooms', code);
    await updateDoc(roomRef, {
        status: 'playing'
    });
}

// Eliminar sala
export async function deleteRoom(code) {
    const roomRef = doc(db, 'rooms', code);
    await deleteDoc(roomRef);
}