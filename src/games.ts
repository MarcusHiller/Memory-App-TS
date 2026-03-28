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
    rederGameApp();
    renderCards();
} )


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


function gameField() {
    return `
    <header class="display-field">
        <div class="game-info">
            <section class="status-player">
                <div class="player">
                    <img class="player__img" src="assets/img/game/label_blue.svg" alt="">
                    <p class="player__one">player one</p>
                    <span class="player__one">0</span>
                </div>
                <div class="player">
                    <img class="player__img" src="assets/img/game/label_orange.svg" alt="">
                    <p class="player__two">player two</p>
                    <span class="player__two">0</span>
                </div>
            </section>
            <div class="display-player">
                <p class="display-player__text">Current Player:</p>
                <img class="display-player__img" src="assets/img/game/label_blue.svg" alt="">
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