export enum GameState {
    WAITING = "WAITING",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETE = "COMPLETE",
};

export const gameState = (s: string) => {
    switch (s) {
        case "WAITING":
            return GameState.WAITING;
        case "IN_PROGRESS":
            return GameState.IN_PROGRESS;
        case "COMPLETE":
            return GameState.COMPLETE;
    }
    return GameState.WAITING;
}
