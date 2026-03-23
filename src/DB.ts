import { DB } from "./interface";

export let memoryGame:DB = {
    cureentPlayer: '',
    memoryDeck: 16,
    playedCards: [],
    theme: "code",
    choosePlayer: '',
    points: {
        blue: 0,
        orange: 0
    }
}