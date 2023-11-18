export enum Action {
    FOLD = "Fold",
    CHECK = "Check",
    CALL = "Call",
    BET = "Bet",
    RAISE = "Raise",
    EMPTY = "",
};

export const action = (s: string) => {
    switch (s) {
        case "Fold":
            return Action.FOLD;
        case "Check":
            return Action.CHECK;
        case "Call":
            return Action.CHECK;
        case "Bet":
            return Action.BET;
        case "Raise":
            return Action.RAISE;
    }
    return Action.EMPTY;
}
