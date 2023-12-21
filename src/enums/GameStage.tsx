export enum GameStage {
    PRE_FLOP = "PRE_FLOP",
    FLOP = "FLOP",
    TURN = "TURN",
    RIVER = "RIVER",
    SHOWDOWN = "SHOWDOWN",
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
