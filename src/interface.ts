

export interface ListInput{
    name: string | undefined;
    value: string | undefined;
}


export interface DB{
    currentPlayer: string | undefined,
    memoryDeck: number | undefined,
    playedCards: string [],
    cards:string [],
    theme: string | undefined,
    choosePlayer: string | undefined,
    points: {
        blue: number,
        orange: number
    },
    allCecked:number,
    isChecked:boolean,
    canFlip: boolean,
    isInitialStart: boolean,
}