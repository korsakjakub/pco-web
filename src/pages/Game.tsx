import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
import Rules from "../interfaces/Rules";
import Context from "../interfaces/Context";
import PlayingTable from "../components/PlayingTable";
import { useQuery } from "@tanstack/react-query";
import { GameState } from "../enums/GameState";
import GetPlayer from "../requests/GetPlayer";
import StartGame from "../requests/StartGame";
import PlayerActions from "../components/PlayerActions";
import GetGameResponse from "../interfaces/GetGameResponse";
import getHostUrl from "../utils/getHostUrl";
import useStream from "../hooks/useStream";
import { useState } from "react";
import GetRules from "../requests/GetRules";
import GameSettingsMenu from "../components/GameSettingsMenu";
import { Action } from "../enums/Action";
import NotFound from "./NotFound";


const Game = () => {
  let ctx: Context;
  try {
    ctx = getContext();
  } catch(e) {
    return <NotFound />;
  }

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const game = useStream(`${getHostUrl()}/api/v1/game/stream?roomId=${ctx.roomId}`, () => {
    setIsGameLoading(false);
    refetchMyPlayer();
  }) as GetGameResponse | null;

  const playersInRoom = useStream(`${getHostUrl()}/api/v1/player/stream?roomId=${ctx.roomId}`) as {players: Player[]} | null;
  const playersInQueue = useStream(`${getHostUrl()}/api/v1/queue/stream?queueId=${ctx.queueId}`) as {players: Player[]} | null;

  const {data: myPlayer, isLoading: isMyPlayerLoading, refetch: refetchMyPlayer } = useQuery({
    queryFn: () => GetPlayer(),
    queryKey: ["myPlayer"],
  });

  const {data: rules } = useQuery({
    queryFn: () => GetRules(),
    queryKey: ["rules"],
    initialData: {
      startingChips: 1000,
      ante: 0,
      smallBlind: 10,
      bigBlind: 20,
    } as Rules,
  });

  const [isGameLoading, setIsGameLoading] = useState(false);

  const isBetSizeValid = (action: Action, betSize: number) => {
    if (!rules || !game) {
      return false;
    }
    if (action === Action.RAISE && 
      (betSize <= game?.currentBetSize || betSize < 2 * rules?.bigBlind)) {
      return false;
    } else if (action === Action.RAISE && game.currentBetSize === 0) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <main className="game container">
      {playersInRoom && game !== null &&
        <PlayingTable
          players={playersInRoom.players}
          currentPlayer={game.currentTurnPlayerId}
          stakedChips={game.stakedChips}
          gameStage={game.stage}
          gameState={game.state}
          dealerId={game.dealerPlayerId}
          isLoading={isGameLoading}
          rules={rules}
        />
      }
      {game?.state === GameState.IN_PROGRESS && rules && !isMyPlayerLoading && myPlayer && 
        <PlayerActions actions={myPlayer.actions} currentPlayerId={game.currentTurnPlayerId} currentPlayerStakedChips={myPlayer.stakedChips} gameStage={game.stage} currentBetSize={game.currentBetSize} minBetSize={rules.bigBlind * 2} maxBetSize={myPlayer.chips} validBetSize={isBetSizeValid}/>}
      {game?.state === GameState.WAITING && playersInRoom && playersInQueue && 
        <>
          { isAdmin() && playersInRoom.players.length > 1 && 
            <button aria-busy={isGameLoading} onMouseDown={() => {
              setIsGameLoading(true);
              StartGame();
            }}>Start game</button>
          }
          { isAdmin() && 
            <details>
              <summary>Admin Panel</summary>
              <section>
                <PlayersList players={playersInRoom.players || []} />
                <QueueList players={playersInQueue.players || []} />
              </section>
            </details>
          }
          <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId || ""} />
        </>
      }
      {isAdmin() && game?.state !== GameState.IN_PROGRESS && rules && <GameSettingsMenu rules={rules} readOnly={isGameLoading} />}
    </main>
  );
};

export default Game;
