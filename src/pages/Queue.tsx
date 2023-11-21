import QueueList from "../components/QueueList";
import getContext from "../utils/getContext";
import { useNavigate } from "react-router-dom";
import useStream from "../hooks/useStream";
import getHostUrl from "../utils/getHostUrl";
import Player from "../interfaces/Player";

const Queue = () => {
  const ctx = getContext();
  const navigate = useNavigate();

  const stream = useStream(`${getHostUrl()}/api/v1/queue/stream?queueId=${ctx.queueId}`) as {players: Player[]} | null;

  useStream(`${getHostUrl()}/api/v1/player/stream?roomId=${ctx.roomId}`, (data) => {
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
    <div>
      <h1>You are waiting in the queue {ctx.queueId}</h1>
      <QueueList players={stream?.players || []}/>
    </div>
  );
}

export default Queue;
