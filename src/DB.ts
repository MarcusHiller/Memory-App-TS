import { DB } from "./interface";

export let memoryGame:DB = {
    cureentPlayer: '',
    memoryDeck: undefined,
    playedCards: [],
    theme: "code",
    choosePlayer: undefined,
    points: {
        blue: 0,
        orange: 0
    },
    allCecked: 3,
}


export function getFromLocalStorage() {
    let dataStorage = localStorage.getItem("memoryGame");

    
    if (dataStorage !== null){
        let dataParse = JSON.parse(dataStorage) as DB;
        memoryGame = dataParse;
    }    
}