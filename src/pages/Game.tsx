import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
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
import SettingsMenu from "../components/SettingsMenu";


const Game = () => {
    const ctx = getContext();
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

    const [isGameLoading, setIsGameLoading] = useState(false);

    return (
        <div className="game">
            {game?.state === GameState.WAITING && playersInRoom && playersInQueue && 
                <>
                    <PlayersList players={playersInRoom.players || []} />
                    <QueueList players={playersInQueue.players || []} />
                    <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
                    { isAdmin() && playersInRoom.players.length > 1 &&
                        <button aria-busy={isGameLoading} onClick={() => {
                            setIsGameLoading(true);
                            StartGame();
                        }}>Start game</button>
                    }
                </>
            }
            {game !== null && [GameState.IN_PROGRESS, GameState.WAITING].includes(game.state) &&
                <SettingsMenu />
            }
            {playersInRoom && game !== null &&
                <PlayingTable
                    players={playersInRoom.players}
                    currentPlayer={game.currentTurnPlayerId}
                    stakedChips={game.stakedChips}
                    gameStage={game.stage}
                    isLoading={isGameLoading}
                />
            }
            {game?.state === GameState.IN_PROGRESS && !isMyPlayerLoading && myPlayer && 
                <PlayerActions actions={myPlayer.actions} currentPlayerId={game.currentTurnPlayerId} currentPlayerStakedChips={myPlayer.stakedChips} gameStage={game.stage} onActionPerformed={() => setIsGameLoading(true)}/>}
        </div>
    );
};

export default Game;
