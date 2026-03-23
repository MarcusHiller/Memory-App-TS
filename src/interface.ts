

export interface ListInput{
    name: string | undefined;
    value: string | undefined;
}


export interface DB{
    cureentPlayer: string | undefined,
    memoryDeck: number | undefined,
    playedCards: any,
    theme: string | undefined,
    choosePlayer: string | undefined,
    points: {
        blue: number,
        orange: number
    }
}