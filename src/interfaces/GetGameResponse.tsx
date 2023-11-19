import { GameStage } from "../enums/GameStage";
import { GameState } from "../enums/GameState";

interface GetGameResponse {
  state: GameState;
  stage: GameStage;
  stakedChips: number;
  currentBetSize: number;
  currentTurnPlayerId: string;
  dealerPlayerId: string;
  smallBlindPlayerId: string;
  bigBlindPlayerId: string;
}

export default GetGameResponse;
