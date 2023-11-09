import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
import { Container, Row, Spinner } from "react-bootstrap";
import PlayingTable from "../components/PlayingTable";
import { useQuery } from "@tanstack/react-query";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { GameState } from "../enums/GameState";
import GetGame from "../requests/GetGame";
import GetPlayer from "../requests/GetPlayer";
import GetRules from "../requests/GetRules";
import PlayerActions from "../components/PlayerActions";

const Game = () => {
    const ctx = getContext();

    const { data: playersInRoom, isLoading: isPIRLoading } = useQuery({
        queryFn: () => GetPlayersInRoom(ctx.roomId),
        queryKey: ["playersInRoom"],
    });

    const {data: game, isLoading } = useQuery({
        queryFn: () => GetGame(ctx.roomId),
        queryKey: ["game"],
    });

    const {data: myPlayer, isLoading: isMyPlayerLoading } = useQuery({
        queryFn: () => GetPlayer(),
        queryKey: ["myPlayer"],
    });

    const {data: rules, isLoading: isLoadingRules } = useQuery({
        queryFn: () => GetRules(ctx.roomId),
        queryKey: ["rules"],
    });

    const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;


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
                        <QueueList isAdmin={isAdmin()} />
                    </Row>
                    <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
                </>
            }
            <PlayingTable
                players={playersInRoom || ([] as Player[])}
                currentPlayer={game?.currentTurnPlayerId || ''}
                stakedChips={game?.stakedChips || 0}
                isLoading={isPIRLoading}
            />
            {!isMyPlayerLoading && myPlayer && <PlayerActions actions={myPlayer.actions} />}
        </Container>
    );
};

export default Game;
