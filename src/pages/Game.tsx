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

const Game = () => {
    const ctx = getContext();

    const { data: playersInRoom, isLoading: isPIRLoading, refetch: playersRefetch } = useQuery({
        queryFn: () => GetPlayersInRoom(ctx.roomId),
        queryKey: ["playersInRoom"],
    });

    const {data: game, isLoading } = useQuery({
        queryFn: () => GetGame(ctx.roomId),
        queryKey: ["game"],
    });

    const { data: playersInQueue, refetch: queueRefetch } = useQuery({
        queryFn: () => GetPlayersInQueue(),
        queryKey: ["playersInQueue"],
        refetchInterval: 2000,
        enabled: game?.state === GameState.WAITING,
    });

    const {data: myPlayer, isLoading: isMyPlayerLoading } = useQuery({
        queryFn: () => GetPlayer(),
        queryKey: ["myPlayer"],
    });

    return (
        <Container>
            {isLoading && 
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
                                playersRefetch(); 
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
                isLoading={isPIRLoading}
            />
            {game?.state === GameState.IN_PROGRESS && !isMyPlayerLoading && myPlayer && <PlayerActions actions={myPlayer.actions} />}
        </Container>
    );
};

export default Game;
