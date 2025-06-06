import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
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
import { Action } from "../enums/Action";
import NotFound from "./NotFound";
import SittingOutSwitch from "../components/SittingOutSwitch";
import { PlayerState } from "../enums/PlayerState";
import AdminPanel from "../components/AdminPanel";

const Game = () => {
  let ctx: Context;
  try {
    ctx = getContext();
  } catch (e) {
    return <NotFound />;
  }

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const game = useStream<GetGameResponse>(
    `${getHostUrl()}/api/v1/game/stream?roomId=${ctx.roomId}`,
    () => {
      setIsGameLoading(false);
      refetchMyPlayer();
    },
  );

  const playersInRoom = useStream<{ players: Player[] }>(
    `${getHostUrl()}/api/v1/player/stream?roomId=${ctx.roomId}`,
  );
  const playersInQueue = useStream<{ players: Player[] }>(
    `${getHostUrl()}/api/v1/queue/stream?queueId=${ctx.queueId}`,
  );

  const {
    data: myPlayer,
    isLoading: isMyPlayerLoading,
    refetch: refetchMyPlayer,
  } = useQuery({
    queryFn: () => GetPlayer(),
    queryKey: ["myPlayer"],
  });

  const { data: rules } = useQuery({
    queryFn: () => GetRules(),
    queryKey: ["rules"],
  });

  const [isGameLoading, setIsGameLoading] = useState(false);

  const isBetSizeValid = (action: Action, betSize: number) => {
    if (!rules || !game) {
      return false;
    }
    if (
      action === Action.RAISE &&
      (betSize <= game?.currentBetSize || betSize < 2 * rules?.bigBlind)
    ) {
      return false;
    } else if (action === Action.RAISE && game.currentBetSize === 0) {
      return false;
    } else {
      return true;
    }
  };

  const isEnoughPlayersToStartGame = (players: Player[]) => {
    return players.filter((p) => p.chips != 0).length > 1;
  };

  return (
    <main className="game container">
      {playersInRoom && game !== null && rules && (
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
      )}
      {game?.state === GameState.IN_PROGRESS &&
        rules &&
        !isMyPlayerLoading &&
        myPlayer && (
          <PlayerActions
            actions={myPlayer.actions}
            currentPlayerId={game.currentTurnPlayerId}
            currentPlayerStakedChips={myPlayer.stakedChips}
            gameStage={game.stage}
            currentBetSize={game.currentBetSize}
            minBetSize={rules.bigBlind * 2}
            maxBetSize={myPlayer.chips}
            validBetSize={isBetSizeValid}
          />
        )}
      {game?.state === GameState.WAITING && playersInRoom && playersInQueue && (
        <>
          <div>
            {isAdmin() && (
              <button
                aria-busy={isGameLoading}
                disabled={!isEnoughPlayersToStartGame(playersInRoom.players)}
                onMouseDown={() => {
                  setIsGameLoading(true);
                  StartGame();
                }}
              >
                Start game
              </button>
            )}
            <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId || ""} />
          </div>
          {isAdmin() && rules && (
            <>
              <AdminPanel
                playersInRoom={playersInRoom.players}
                playersInQueue={playersInQueue.players}
                rules={rules}
                readOnly={isGameLoading}
              />
            </>
          )}
        </>
      )}
      <SittingOutSwitch
        onClicked={refetchMyPlayer}
        playerState={myPlayer?.state || PlayerState.SITTING_OUT}
      />
    </main>
  );
};

export default Game;
