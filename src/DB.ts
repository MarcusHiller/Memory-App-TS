import { DB } from "./interface";

export let memoryGame:DB = {
    currentPlayer: '',
    memoryDeck: 0,
    playedCards: [],
    cards: [],
    theme: "",
    choosePlayer: "",
    points: {
        blue: 0,
        orange: 0
    },
    allCecked: 3,
    isChecked:false,
}


export function saveLocalStorage() {
    localStorage.setItem("memoryGame", JSON.stringify(memoryGame));
}


export function getFromLocalStorage() {
    let dataStorage = localStorage.getItem("memoryGame");
    if (dataStorage !== null){
        let dataParse = JSON.parse(dataStorage) as DB;
        memoryGame = dataParse;
    }    
}


export function resetMemoryGame() {
    memoryGame.currentPlayer = '';
    memoryGame.memoryDeck = 0;
    memoryGame.playedCards = [];
    memoryGame.cards = [];
    memoryGame.theme = "";
    memoryGame.choosePlayer = "";
    memoryGame.points.blue = 0;
    memoryGame.points.orange = 0;
    memoryGame.allCecked = 3;
    memoryGame.isChecked = false;
}