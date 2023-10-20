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
import GetRules from "../requests/GetRules";
import StartGame from "../requests/StartGame";
import PlayerActions from "../components/PlayerActions";

const Game = () => {
  const ctx = getContext();

  const { data: playersInRoom, isLoading: isPIRLoading } = useQuery({
    queryFn: () => GetPlayersInRoom(ctx.roomId),
    queryKey: ["playersInRoom"],
  });

  const { data: game, isLoading } = useQuery({
    queryFn: () => GetGame(ctx.roomId),
    queryKey: ["game"],
  });

  const { data: rules, isLoading: isLoadingRules } = useQuery({
    queryFn: () => GetRules(ctx.roomId),
    queryKey: ["rules"],
  });

  const getMyPlayer = () =>
    playersInRoom?.find((p) => p.id === ctx.playerId) || null;

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const handleStartGame = () => StartGame(ctx.roomId, ctx.roomToken);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container>
      {game?.state === GameState.WAITING && (
        <>
          <Row>
            <PlayersList players={playersInRoom || []} />
          </Row>
          <Row>
            <QueueList isAdmin={isAdmin()} />
          </Row>
          <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
          {isAdmin() && (
            <Button variant="success" onClick={handleStartGame}>
              Start the game
            </Button>
          )}
        </>
      )}
      <PlayingTable
        players={playersInRoom || ([] as Player[])}
        currentPlayer={game?.currentTurnPlayerId || ""}
        stakedChips={game?.stakedChips || 0}
        isLoading={isPIRLoading}
      />
      {game?.state === GameState.IN_PROGRESS && (
        <PlayerActions
          tableChips={game?.stakedChips || 0}
          currentBetSize={game?.currentBetSize || 0}
          playerStakedChips={getMyPlayer()?.stakedChips || 0}
        />
      )}
    </Container>
  );
};

export default Game;
