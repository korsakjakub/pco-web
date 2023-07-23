import { useEffect, useState } from "react";
import GetPlayersInQueue from "../requests/GetPlayersInQueue";
import getContext from "../utils/getContext";
import AcceptPlayerInQueue from "../requests/AcceptPlayerInQueue";

interface Props {
  queueId: string;
}

const QueueList = ({ queueId }: Props) => {
const ctx = getContext();
  const [players, setPlayers] = useState<Players>({
    players: [],
  });
  const fetchQueue = async () => {
    try {
      const queueData = await GetPlayersInQueue(queueId);
      if (queueData === null) return;
      setPlayers(queueData);
    } catch (error) {
      return error;
    }
  };

  const acceptPlayer = async (playerId: string) => {
    try {
      const playerData = await AcceptPlayerInQueue(ctx.roomId, playerId, ctx.roomToken);
      if (playerData === null) return;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchQueue();
    const intervalId = setInterval(fetchQueue, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddToRoom = (playerId: string) => {
    acceptPlayer(playerId);
  }

  return (
    <>
      <p>Queue:</p>
      <ul className="list-group">
        {players.players.length === 0 && (
          <li className="list-group-item">No players in queue</li>
        )}
        {players.players.map((player) => (
          <li className="list-group-item" key={player.id}>
            <p>Name: {player.name}</p>
            <p>Id: {player.id}</p>
            <button onClick={() => handleAddToRoom(player.id)} className="btn btn-primary">Add</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default QueueList;
