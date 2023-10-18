import ShareUrlAlert from "../components/ShareUrlAlert";
import getContext from "../utils/getContext";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
import { Container, Row, Spinner } from "react-bootstrap";
import PlayingTable from "../components/PlayingTable";
import PlayerActions from "../components/PlayerActions";
import { useQuery } from "@tanstack/react-query";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { GameState } from "../enums/GameState";
import GetGame from "../requests/GetGame";
import GetRules from "../requests/GetRules";

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

  const {data: rules, isLoading: isLoadingRules } = useQuery({
    queryFn: () => GetRules(ctx.roomId),
    queryKey: ["rules"],
  });

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;


  if (isLoading) {
    return <Spinner/>
  }

  return (
    <Container>
      {game?.state === GameState.WAITING && 
      <>
          <Row>
            <PlayersList roomId={ctx.roomId} />
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
    </Container>
  );
};

export default Game;
