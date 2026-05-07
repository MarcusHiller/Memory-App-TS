import { setTimeout } from "node:timers/promises";
import { memoryGame, getFromLocalStorage, saveLocalStorage, resetMemoryGame } from "./DB";


document.addEventListener('DOMContentLoaded', () => {
    getFromLocalStorage();
    setTheme();
    setAktivPlayer();
    renderGameApp();
    addCardToDeck();
    renderCards();
    isMidGame();
})


document.addEventListener('click', (event) => {
    overlaAktion(event);
    flipCard(event);
    gamePlay(event);
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
    if (memoryGame.isInitialStart) {
        memoryGame.currentPlayer = memoryGame.choosePlayer;
        memoryGame.isInitialStart = false;
        saveLocalStorage();
    }
}


function renderGameApp() {
    let playingField = document.querySelector('.game-board') as HTMLElement;
    playingField.innerHTML = "";
    if (memoryGame.theme == "code") {
        playingField.innerHTML = gameFieldCode();
    } else {
        playingField.innerHTML = gameField();
    }
    //playingField.innerHTML = gameField();


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


function isMidGame() {
    memoryGame.playedCards.forEach((ids) => {
        let card = document.getElementById(ids) as HTMLElement;
        let cardInner = card.querySelector('.card__inner') as HTMLElement;
        cardInner.classList.add('is-flipped');
        let imgInner = card.querySelector('.card__face--back') as HTMLElement;
        imgInner.classList.add('card--match');
    });
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


function gamePlay(event: any) {
    let playingField = document.querySelector('.playing-field') as HTMLElement;
    if (playingField) {
        let selections = playingField.querySelectorAll('[data-selected]');
        if (selections.length === 2) {
            memoryGame.canFlip = false;
            let firstCard = selections[0].getAttribute('src');
            let secondCard = selections[1].getAttribute('src');
            if (firstCard === secondCard) {
                match(selections);
                countPoints();
                uptadeScoreDisplay();
            } else {
                resetInvalidCards(selections);
                changeCurrentPlayer();
                changeDisplayCurrentPlayer();
            }
        }
    }
    checkIsGameFinished();
}


function match(selections: NodeListOf<Element>) {
    selections.forEach(element => {
        element.removeAttribute('data-selected');
        let cardMatch = element.closest('.card__face--back');
        memoryGame.canFlip = true;
        if (cardMatch) {
            cardMatch.classList.add('card--match');
        }
    });
    selections.forEach(element => {
        let btn = element.closest('button') as HTMLElement;
        memoryGame.playedCards.push(btn.id);
        console.log(btn.id);
    });
}


function countPoints() {
    let aktivPlayer = memoryGame.currentPlayer as keyof typeof memoryGame.points;
    memoryGame.points[aktivPlayer] += 1;
    saveLocalStorage();
}


function changeCurrentPlayer() {
    memoryGame.currentPlayer === "blue" ? memoryGame.currentPlayer = "orange" : memoryGame.currentPlayer = "blue";
    saveLocalStorage();
}

function changeDisplayCurrentPlayer() {
    window.setTimeout(() => {
        if (memoryGame.theme === "code") {
            let background = document.getElementById('player-img') as HTMLImageElement;
            console.log(background);
            let stringSrc = `assets/img/game/label_${memoryGame.currentPlayer}.svg`;
            background.src = stringSrc;
        } else {
            let background = document.getElementById('player-background') as HTMLElement;
            let blue = "display-player__img-background--blue";
            let orange = "display-player__img-background--orange";
            if (background.classList.contains(blue)) {
                background.classList.replace(blue, orange);
            } else if (background.classList.contains(orange)) {
                background.classList.replace(orange, blue);
            }
        }
    }, 1050);
}


function uptadeScoreDisplay() {
    let displayScore = document.getElementById(`score-${memoryGame.currentPlayer}`) as HTMLElement;
    let aktivPLayer = memoryGame.currentPlayer as keyof typeof memoryGame.points;
    displayScore.innerHTML = "";
    displayScore.innerHTML = `${memoryGame.points[aktivPLayer]}`;
}


function resetInvalidCards(selections: NodeListOf<Element>) {
    selections.forEach((selection) => {
        selection.removeAttribute('data-selected');
    })
    window.setTimeout(() => {
        selections.forEach((selection) => {
            memoryGame.canFlip = true;
            saveLocalStorage();
            let cardInner = selection.closest('.card__inner');
            if (cardInner) {
                cardInner.classList.remove('is-flipped');
            }
        })
    }, 1000);
}


function checkIsGameFinished() {
    let points = (memoryGame.points.blue + memoryGame.points.orange) * 2;
    if (points == memoryGame.memoryDeck) {
        console.log("Finish");
        //cleanGameField();
    }
    /* if (0 == 0) {
        cleanGameField();
    } */
}


function cleanGameField() {
    let playingField = document.querySelector('.game-board') as HTMLElement;
    playingField.innerHTML = "";
    playingField.innerHTML = showWinner();
}


function flipCard(event: any) {
    if (!memoryGame.canFlip) return;
    let btn = event.target.closest('button');
    let isMatchCard = btn?.querySelector('.card__face--back')?.classList.contains('card--match');
    if (isMatchCard) return;
    if (btn) {
        let cardInner = btn.querySelector('.card__inner');
        let selection = btn.querySelector('[name="card-img"]');
        if (cardInner) {
            cardInner.classList.toggle('is-flipped');
            selection.toggleAttribute('data-selected');
        }
    }
}


function gameField() {
    let headImg = insertPictureHeader();
    return `
    <header class="display-field">
        <div class="game-info">
            <section id="score-display" class="status-player">
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}blue.svg" alt="">
                    <p class="player__one ${headImg.font}">Blue</p>
                    <span id="score-blue" class="player__one font-aktiv">${memoryGame.points.blue}</span>
                </div>
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}orange.svg" alt="">
                    <p class="player__two ${headImg.font}">Orange</p>
                    <span id="score-orange" class="player__two font-aktiv">${memoryGame.points.orange}</span>
                </div>
            </section>
            <div class="display-player">
                <p class="display-player__text">Current Player:</p>
                <div id="player-background" class="display-player__img-background display-player__img-background--${headImg.backgr}">
                    <img id="player-img" class="display-player__img" src="assets/img/game/${headImg.center}.svg" alt="">
                </div>
            </div>
            <div>
                <button data-action="open" class="btn btn-exit">
                    <svg 
                        
                        viewBox="0 0 26 23" 
                        xmlns="http://www.w3.org/2000/svg" 
                        class="btn-exit__img">
                        <path d="M21.4375 12.5H7.5C7.14583 12.5 6.84896 12.3802 6.60938 12.1406C6.36979 11.901 6.25 11.6042 6.25 11.25C6.25 10.8958 6.36979 10.599 6.60938 10.3594C6.84896 10.1198 7.14583 10 7.5 10H21.4375L20.375 8.9375C20.125 8.6875 20.0052 8.39583 20.0156 8.0625C20.026 7.72917 20.1458 7.4375 20.375 7.1875C20.625 6.9375 20.9219 6.80729 21.2656 6.79688C21.6094 6.78646 21.9062 6.90625 22.1562 7.15625L25.375 10.375C25.625 10.625 25.75 10.9167 25.75 11.25C25.75 11.5833 25.625 11.875 25.375 12.125L22.1562 15.3438C21.9062 15.5938 21.6094 15.7135 21.2656 15.7031C20.9219 15.6927 20.625 15.5625 20.375 15.3125C20.1458 15.0625 20.026 14.7708 20.0156 14.4375C20.0052 14.1042 20.125 13.8125 20.375 13.5625L21.4375 12.5ZM15 6.25V2.5H2.5V20H15V16.25C15 15.8958 15.1198 15.599 15.3594 15.3594C15.599 15.1198 15.8958 15 16.25 15C16.6042 15 16.901 15.1198 17.1406 15.3594C17.3802 15.599 17.5 15.8958 17.5 16.25V20C17.5 20.6875 17.2552 21.276 16.7656 21.7656C16.276 22.2552 15.6875 22.5 15 22.5H2.5C1.8125 22.5 1.22396 22.2552 0.734375 21.7656C0.244792 21.276 0 20.6875 0 20V2.5C0 1.8125 0.244792 1.22396 0.734375 0.734375C1.22396 0.244792 1.8125 0 2.5 0H15C15.6875 0 16.276 0.244792 16.7656 0.734375C17.2552 1.22396 17.5 1.8125 17.5 2.5V6.25C17.5 6.60417 17.3802 6.90104 17.1406 7.14062C16.901 7.38021 16.6042 7.5 16.25 7.5C15.8958 7.5 15.599 7.38021 15.3594 7.14062C15.1198 6.90104 15 6.60417 15 6.25Z" 
                        fill="currentColor" />  
                    </svg>
                    <p class="btn-exit__text">Exit game</p>
                </button>
            </div>
        </div>
    </header>
    <section class="playing-field playing-field--grid-${memoryGame.memoryDeck}">
    </section>
    `;
}


function gameFieldCode() {
    let headImg = insertPictureHeader();
    return `
    <header class="display-field">
        <div class="game-info">
            <section id="score-display" class="status-player">
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}blue.svg" alt="">
                    <p class="player__one ${headImg.font}">Blue</p>
                    <span id="score-blue" class="player__one font-aktiv">${memoryGame.points.blue}</span>
                </div>
                <div class="player">
                    <img class="player__img" src="assets/img/game/${headImg.player}orange.svg" alt="">
                    <p class="player__two ${headImg.font}">Orange</p>
                    <span id="score-orange" class="player__two font-aktiv">${memoryGame.points.orange}</span>
                </div>
            </section>
            <div class="display-player">
                <p class="display-player__text">Current Player:</p>
                <div id="player-background" class="display-player__img-background display-player__img-background--${headImg.backgr}">
                    <img id="player-img" class="display-player__img" src="assets/img/game/${headImg.center}.svg" alt="">
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
        <button id="${i}" data-action="playingCard" class="card card--hover">
            <div class="card__inner">
                <div class="card__face card__face--front">
                    <img class="card__img card__img--front" src="assets/img/game/da_logo.svg" alt="">
                </div>
                <div class="card__face card__face--back">
                    <img name="card-img" class="card__img" src="${memoryGame.cards[i]}" alt="">
                </div>
            </div>
        </button>
    `;
}


function showWinner() {
    let headImg = insertPictureHeader();
    return `
        <section>
            <div>
                <h2>Game over</h2>
                <div>
                    <p>Final score</p>
                    <section id="score-display" class="status-player">
                        <div class="player">
                            <img class="player__img" src="assets/img/game/${headImg.player}blue.svg" alt="">
                            <p class="player__one ${headImg.font}">Blue</p>
                            <span id="score-blue" class="player__one font-aktiv">${memoryGame.points.blue}</span>
                        </div>
                        <div class="player">
                            <img class="player__img" src="assets/img/game/${headImg.player}orange.svg" alt="">
                            <p class="player__two ${headImg.font}">Orange</p>
                            <span id="score-orange" class="player__two font-aktiv">${memoryGame.points.orange}</span>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    `;
}