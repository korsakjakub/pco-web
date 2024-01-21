import QueueList from "../components/QueueList";
import getContext from "../utils/getContext";
import { useNavigate } from "react-router-dom";
import useStream from "../hooks/useStream";
import getHostUrl from "../utils/getHostUrl";
import Player from "../interfaces/Player";
import PlayersList from "../components/PlayersList";

const Queue = () => {
  const ctx = getContext();
  const navigate = useNavigate();

  const stream = useStream(`${getHostUrl()}/api/v1/queue/stream?queueId=${ctx.queueId}`) as {players: Player[]} | null;

  const playersStream = useStream(`${getHostUrl()}/api/v1/player/stream?roomId=${ctx.roomId}`, (data) => {
    if (data == null) {
      return;
    }
    const { players } = data;

    if (!Array.isArray(players)) {
      return;
    }
    const addedToRoom = players.filter(player => player.id === ctx.playerId).length > 0;
    if (addedToRoom) {
      navigate("/game/" + ctx.roomId);
    }
  }) as {players: Player[]} | null;

  return (
    <main className="container">
      <h1>You are waiting in the queue {ctx.queueId}</h1>
      <QueueList players={stream?.players || []}/>
      <PlayersList players={playersStream?.players || []}/>
    </main>
  );
}

export default Queue;
