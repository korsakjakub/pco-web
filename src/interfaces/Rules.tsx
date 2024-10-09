import { GameMode } from "../enums/GameMode";

interface Rules {
  startingChips: number;
  ante: number;
  smallBlind: number;
  bigBlind: number;
  gameMode: GameMode;
}

export default Rules;
