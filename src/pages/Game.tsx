import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
import { Button, Container, Row, Spinner } from "react-bootstrap";
import PlayingTable from "../components/PlayingTable";
import { useQuery } from "@tanstack/react-query";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { GameState } from "../enums/GameState";
import GetGame from "../requests/GetGame";
import GetPlayer from "../requests/GetPlayer";
import StartGame from "../requests/StartGame";
import PlayerActions from "../components/PlayerActions";
import GetPlayersInQueue from "../requests/GetPlayersInQueue";
import GetGameResponse from "../interfaces/GetGameResponse";
import { useEffect, useState } from "react";
import getHostUrl from "../utils/getHostUrl";

interface Stream {
    getGameResponse: GetGameResponse;
    getPlayersResponse: {players: Player[]};
}

const Game = () => {
    const ctx = getContext();

    const [stream, setStream] = useState<Stream| null>(null);
    useEffect(() => {
        const eventSource = new EventSource(getHostUrl() + `/api/v1/game/stream?roomId=${ctx.roomId}`);

        eventSource.addEventListener('message', (event) => {
            const updatedGame = JSON.parse(event.data);
            console.log(updatedGame);
            setStream(updatedGame);
        });

        return () => {
            eventSource.close();
        };
    }, []);

    const { data: playersInQueue, refetch: queueRefetch } = useQuery({
        queryFn: () => GetPlayersInQueue(),
        queryKey: ["playersInQueue"],
        refetchInterval: 2000,
        enabled: stream?.getGameResponse.state === GameState.WAITING,
    });

    const {data: myPlayer, isLoading: isMyPlayerLoading } = useQuery({
        queryFn: () => GetPlayer(),
        queryKey: ["myPlayer"],
    });
    const game = stream?.getGameResponse;
    const playersInRoom = stream?.getPlayersResponse.players;


    return (
        <Container>
            {false&&//isLoading && 
                <Spinner/>
            }
            {game?.state === GameState.WAITING && 
                <>
                    <Row>
                        <PlayersList players={playersInRoom || []} />
                    </Row>
                    <Row>
                        <QueueList players={playersInQueue || []} onPlayerModified={
                            () => {
                                //playersRefetch(); 
                                queueRefetch();
                            }}/>
                    </Row>
                    <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
                    <Button onClick={() => StartGame()}>Start game</Button>
                </>
            }
            <PlayingTable
                players={playersInRoom || ([] as Player[])}
                currentPlayer={game?.currentTurnPlayerId || ''}
                stakedChips={game?.stakedChips || 0}
                isLoading={false}//isPIRLoading}
            />
            {game?.state === GameState.IN_PROGRESS && !isMyPlayerLoading && myPlayer && <PlayerActions actions={myPlayer.actions} currentPlayerId={game.currentTurnPlayerId} />}
            <div>{JSON.stringify(stream)}</div>
        </Container>
    );
};

export default Game;
