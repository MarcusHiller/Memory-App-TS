let memoryGame = {
    cureentPlayer: '',
    memoryDeck: 16,
    playedCards: [],
    theme: '',
}

document.getElementById('play-btn')?.addEventListener("click", () => {
    goToNextpage();
})


document.getElementById('play-game')?.addEventListener("click", () => {
    playGame();
})


function goToNextpage():void {
    window.location.href = 'setting.html';
}


function playGame() {
    //window.location.href = 'game.html';
    console.log('Hallo Welt');
    
}


