export enum GameMode {
  CASH = "CASH",
  TOURNAMENT = "TOURNAMENT",
}

export const gameMode = (s: string) => {
  switch (s) {
    case "Cash Game":
      return GameMode.CASH;
    case "Tournament":
      return GameMode.TOURNAMENT;
  }
};
