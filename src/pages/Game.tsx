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


const Game = () => {
    const ctx = getContext();

    const game = useStream(`${getHostUrl()}/api/v1/game/stream?roomId=${ctx.roomId}`, () => {
        console.log("update game");
        setIsStartGameLoading(false);
        refetchMyPlayer();
    }) as GetGameResponse | null;

    const playersInRoomStream = useStream(`${getHostUrl()}/api/v1/player/stream?roomId=${ctx.roomId}`) as {players: Player[]} | null;
    const playersInQueueStream = useStream(`${getHostUrl()}/api/v1/queue/stream?queueId=${ctx.queueId}`) as {players: Player[]} | null;

    const playersInRoom = playersInRoomStream?.players;
    const playersInQueue = playersInQueueStream?.players;

    const {data: myPlayer, isLoading: isMyPlayerLoading, refetch: refetchMyPlayer } = useQuery({
        queryFn: () => GetPlayer(),
        queryKey: ["myPlayer"],
    });

    const [isStartGameLoading, setIsStartGameLoading] = useState(false);


    if (!game) {
        return <h1 aria-busy="true">Loading...</h1>
    }

    return (
        <>
            {game?.state === GameState.WAITING && 
                <>
                    <PlayersList players={playersInRoom || []} />
                    <QueueList players={playersInQueue || []} />
                    <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
                    <button aria-busy={isStartGameLoading} onClick={() => {
                        setIsStartGameLoading(true);
                        StartGame();
                    }}>Start game</button>
                </>
            }
            {playersInRoom !== undefined &&
                <PlayingTable
                    players={playersInRoom || ([] as Player[])}
                    currentPlayer={game?.currentTurnPlayerId || ''}
                    stakedChips={game?.stakedChips || 0}
                    isLoading={false}
                />
            }
            {game?.state === GameState.IN_PROGRESS && !isMyPlayerLoading && myPlayer && <PlayerActions actions={myPlayer.actions} currentPlayerId={game.currentTurnPlayerId} />}
            <>
                {JSON.stringify(myPlayer)}
                {JSON.stringify(game)}
            </>
        </>
    );
};

export default Game;
