import { DB } from "./interface";

export let memoryGame:DB = {
    cureentPlayer: '',
    memoryDeck: 0,
    playedCards: [],
    theme: "",
    choosePlayer: "",
    points: {
        blue: 0,
        orange: 0
    },
    allCecked: 3,
    isChecked:false,
}


export function getFromLocalStorage() {
    let dataStorage = localStorage.getItem("memoryGame");
    if (dataStorage !== null){
        let dataParse = JSON.parse(dataStorage) as DB;
        memoryGame = dataParse;
    }    
}