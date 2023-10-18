export enum GameStage {
    PRE_FLOP,
    FLOP,
    TURN,
    RIVER,
};

export const gameStage = (s: string) => {
    switch (s) {
        case "PRE_FLOP":
            return GameStage.PRE_FLOP;
        case "FLOP":
            return GameStage.FLOP;
        case "TURN":
            return GameStage.TURN;
        case "RIVER":
            return GameStage.RIVER;
    }
    return GameStage.PRE_FLOP;
}
