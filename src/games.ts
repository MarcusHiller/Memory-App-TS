import { memoryGame, getFromLocalStorage } from "./DB";

function openModal(event: any) {
    let getButton = event.target as HTMLElement;
    let overlay = getButton.closest('.overlay');
    let btn = getButton.closest('.btn-exit');
    if (btn) {
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.add('fade-in');
    } else if (overlay) {
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.remove('fade-in');
    }
}


document.addEventListener('click', (event) => {
    openModal(event);
})


document.addEventListener('DOMContentLoaded', () => {
    getFromLocalStorage();
    setTheme();
    setAktivPlayer();
    rederGameApp();
    renderCards();
} )


function setTheme() {
    let body = document.querySelector('body');
    body?.classList.add(`theme__${memoryGame.theme}`);
}


function setAktivPlayer() {
    memoryGame.cureentPlayer = memoryGame.choosePlayer;
}



function rederGameApp() {
    let playingField = document.querySelector('.game-board') as HTMLElement;
    playingField.innerHTML = "";
    playingField.innerHTML = gameField();
}


function renderCards() {
    let howMuchCards = memoryGame.memoryDeck;
    if (howMuchCards) {
        let playingField = document.querySelector('.playing-field') as HTMLElement;
            playingField.innerHTML = "";
        for (let i = 0; i < howMuchCards; i++) {
            playingField.innerHTML += singleDeck();
        }
    }
}


function insertPictureHeader() {
    let centerPathSuffix:string;
    let playerDisplayPath:string;
    let centerBackground:string;
    let font:string | null;
    if (memoryGame.theme == "code") {
        centerPathSuffix = "label_" + memoryGame.cureentPlayer;
        playerDisplayPath = "label_";
        centerBackground = "transparent";
        font = "font-aktiv";
    } else {
        centerPathSuffix = "chess_pawn_white";
        playerDisplayPath = "chess_pawn_";
        centerBackground = memoryGame.cureentPlayer!;
        font= null;
    }
    return {center:centerPathSuffix, player:playerDisplayPath, backgr:centerBackground, font:font};
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
            <button id="openModal" class="btn btn-exit">
                <img class="btn-exit__img" src="assets/img/game/exit_item.svg" alt="">
                <p class="btn-exit__text">Exit game</p>
            </button>
        </div>
    </header>
    <section class="playing-field playing-field--grid-${memoryGame.memoryDeck}">
    </section>
    `;
}


function singleDeck() {
    return `
        <button class="card card--hover">
            <div class="card__inner">
                <img class="card__face" src="assets/img/game/da_logo.svg" alt="">
                <img class="card__face card__face--back" src="assets/img/startscreen/stadia_controller.svg" alt="">
            </div>
        </button>
    `;
}