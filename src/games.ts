import { memoryGame, getFromLocalStorage } from "./DB";

function openModal(event: any) {
    let getButton = event.target as HTMLElement;
    let overlay = getButton.closest('.overlay');
    let btn = getButton.closest('.btn-exit');
    if (btn) {
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.add('fade-in');
        console.log('Button 1');
    } else if (overlay) {
        console.log('overlay 2');
        let open = document.querySelector('.overlay') as HTMLElement;
        open.classList.remove('fade-in');
    }
}


document.addEventListener('click', (event) => {
    openModal(event);
})

document.addEventListener('DOMContentLoaded', () => {
    getFromLocalStorage();
    deckLayout();
    renderCards();
} )


function deckLayout() {
    let playingField = document.querySelector('.playing-field') as HTMLElement;
    playingField.classList.add(`playing-field--grid-${memoryGame.memoryDeck}`);
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