export enum Action {
    FOLD = "FOLD",
    CHECK = "CHECK",
    CALL = "CALL",
    BET = "BET",
    RAISE = "RAISE",
    EMPTY = "",
};

export const action = (s: string) => {
    switch (s) {
        case "FOLD":
            return Action.FOLD;
        case "CHECK":
            return Action.CHECK;
        case "CALL":
            return Action.CHECK;
        case "BET":
            return Action.BET;
        case "RAISE":
            return Action.RAISE;
    }
    return Action.EMPTY;
}
