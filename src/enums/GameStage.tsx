export enum GameStage {
    PRE_FLOP,
    FLOP,
    TURN,
    RIVER,
    SHOWDOWN,
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
        case "SHOWDOWN":
            return GameStage.SHOWDOWN;
    }
    return GameStage.PRE_FLOP;
}

export const gameStageString = (g: GameStage) => {
    switch (g) {
        case GameStage.PRE_FLOP:
            return "Preflop"
        case GameStage.FLOP:
            return "Flop"
        case GameStage.TURN:
            return "Turn"
        case GameStage.RIVER:
            return "River"
        case GameStage.SHOWDOWN:
            return "Showdown"
    }
};
