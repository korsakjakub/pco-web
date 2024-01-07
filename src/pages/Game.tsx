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
import { useRef, useState } from "react";
import GetRules from "../requests/GetRules";
import GameSettingsMenu from "../components/GameSettingsMenu";


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

    const {data: rules } = useQuery({
        queryFn: () => GetRules(),
        queryKey: ["rules"],
    });

    const [isGameLoading, setIsGameLoading] = useState(false);

    return (
        <main className="game container">
            {game?.state === GameState.WAITING && playersInRoom && playersInQueue && 
                <>
                    <section className="player-lists">
                        <PlayersList players={playersInRoom.players || []} />
                        <QueueList players={playersInQueue.players || []} />
                    </section>
                    <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
                    { isAdmin() && playersInRoom.players.length > 1 &&
                        <button aria-busy={isGameLoading} onClick={() => {
                            setIsGameLoading(true);
                            StartGame();
                        }}>Start game</button>
                    }
                </>
            }
            {game?.state !== GameState.IN_PROGRESS && rules && <GameSettingsMenu rules={rules} readOnly={isGameLoading} />}

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
        </main>
    );
};

export default Game;
