import { gameStage } from "../enums/GameStage";
import { gameState } from "../enums/GameState";
import Game from "../interfaces/Game";
import getHostUrl from "../utils/getHostUrl";

const GetGame = async (
  roomId: string,
): Promise<Game> => {
  const r = await fetch(getHostUrl() + "/api/v1/game?roomId=" + roomId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (r.ok) {
    const rb = await r.json();
    return {
      bigBlindPlayerId: rb.bigBlindPlayerId,
      currentBetSize: rb.currentBetSize,
      currentTurnPlayerId: rb.currentTurnPlayerId,
      dealerPlayerId: rb.dealerPlayerId,
      smallBlindPlayerId: rb.smallBlindPlayerId,
      stage: gameStage(rb.stage),
      stakedChips: rb.stakedChips,
      state: gameState(rb.state),
    } as Game;
  } else {
    throw Error("could not fetch game.")
  }
};

export default GetGame;
