import { memoryGame, getFromLocalStorage, saveLocalStorage, resetMemoryGame } from "./DB";


document.addEventListener('DOMContentLoaded', () => {
    getFromLocalStorage();
    setTheme();
    setAktivPlayer();
    renderGameApp();
    addCardToDeck();
    renderCards();
})


document.addEventListener('click', (event) => {
    overlaAktion(event);
    flipCard(event);
})


function openModal() {
    let open = document.querySelector('.overlay') as HTMLElement;
    open.classList.add('fade-in');
}


function closeModal() {
    let open = document.querySelector('.overlay') as HTMLElement;
    open.classList.remove('fade-in');
}


function quitGame() {
    resetMemoryGame();
    saveLocalStorage();
    window.location.href = 'setting.html';
}


function overlaAktion(event: any) {
    let action = (event.target as HTMLElement).closest('[data-action]')?.getAttribute('data-action');
    if (action === 'open') return openModal();
    if (action === 'modal') return event.stopPropagation();
    if (action === 'close') return closeModal();
    if (action === 'exit') return quitGame();
}


function setTheme() {
    let body = document.querySelector('body');
    body?.classList.add(`theme__${memoryGame.theme}`);
}


function setAktivPlayer() {
    memoryGame.currentPlayer = memoryGame.choosePlayer;
}


function renderGameApp() {
    let playingField = document.querySelector('.game-board') as HTMLElement;
    playingField.innerHTML = "";
    playingField.innerHTML = gameField();
}


function addCardToDeck() {
    if (memoryGame.cards.length == 0) {
        let imgPath = generatePath();
        let amountDeck = memoryGame.memoryDeck;
        if (amountDeck && imgPath.length >= amountDeck / 2) {
            let half = amountDeck / 2;
            for (let index = 0; index < half; index++) {
                let cardPath = imgPath[index];
                memoryGame.cards.push(cardPath);
                memoryGame.cards.push(cardPath);
            }
        }
    shuffleCards(memoryGame.cards);
    saveLocalStorage();
    }
}


function generatePath() {
    const modules = import.meta.glob(`./../public/assets/img/cards/**/*.svg`, {
        eager: true,
        import: 'default'
    });
    const allCardPaths = Object.keys(modules).map(path => {
        return path.replace(/.*\/public/, '')
    });
    const filterPaths = allCardPaths.filter(path => path.includes(`/${memoryGame.theme}`));
    return filterPaths;
}


function shuffleCards(array: string[]) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}


function renderCards() {
    let howMuchCards = memoryGame.memoryDeck;
    if (howMuchCards) {
        let playingField = document.querySelector('.playing-field') as HTMLElement;
        playingField.innerHTML = "";
        for (let i = 0; i < howMuchCards; i++) {
            playingField.innerHTML += singleDeck(i);
        }
    }
}


function insertPictureHeader() {
    let centerPathSuffix: string;
    let playerDisplayPath: string;
    let centerBackground: string;
    let font: string | null;
    if (memoryGame.theme == "code") {
        centerPathSuffix = "label_" + memoryGame.currentPlayer;
        playerDisplayPath = "label_";
        centerBackground = "transparent";
        font = "font-aktiv";
    } else {
        centerPathSuffix = "chess_pawn_white";
        playerDisplayPath = "chess_pawn_";
        centerBackground = memoryGame.currentPlayer!;
        font = null;
    }
    return { center: centerPathSuffix, player: playerDisplayPath, backgr: centerBackground, font: font };
}


function flipCard(event: any) {
    let btn = event.target.closest('button');
    if (btn) {
        let cardInner = btn.querySelector('.card__inner');
        if (cardInner) {
            cardInner.classList.toggle('is-flipped');
        }
    }
}


function gameField() {
    let headImg = insertPictureHeader();
    return `
    <header class="display-field">
        <div class="game-info">
            <section class="status-player">
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}blue.svg" alt="">
                    <p class="player__one ${headImg.font}">Blue</p>
                    <span class="player__one font-aktiv">0</span>
                </div>
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}orange.svg" alt="">
                    <p class="player__two ${headImg.font}">Orange</p>
                    <span class="player__two font-aktiv">0</span>
                </div>
            </section>
            <div class="display-player">
                <p class="display-player__text">Current Player:</p>
                <div class="display-player__img-background display-player__img-background--${headImg.backgr}">
                    <img class="display-player__img" src="assets/img/game/${headImg.center}.svg" alt="">
                </div>
            </div>
        </div>
        <div>
            <button data-action="open" class="btn btn-exit">
                <img class="btn-exit__img" src="assets/img/game/exit_item.svg" alt="">
                <p class="btn-exit__text">Exit game</p>
            </button>
        </div>
    </header>
    <section class="playing-field playing-field--grid-${memoryGame.memoryDeck}">
    </section>
    `;
}


function singleDeck(i: number) {
    return `
        <button id="card${i}" class="card card--hover">
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <img class="card__img card__img--front" src="assets/img/game/da_logo.svg" alt="">
                </div>
                <div class="card__face card__face--back">
                    <img class="card__img" src="${memoryGame.cards[i]}" alt="">
                </div>
            </div>
        </button>
    `;
}