import { useEffect, useRef, useState } from "react";
import GetPlayersInQueue from "../requests/GetPlayersInQueue";
import getContext from "../utils/getContext";
import AcceptPlayerInQueue from "../requests/AcceptPlayerInQueue";
import Spinner from "./Spinner";

interface Props {
  onPlayerModified?: () => void;
  isAdmin: boolean;
}

const QueueList = ({ onPlayerModified, isAdmin }: Props) => {
  const ctx = getContext();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonIndexLoading, setButtonIndexLoading] = useState("");
  const [players, setPlayers] = useState<Players>({
    players: [],
  });
  const prevPlayersLengthRef = useRef<number>(0);

  const fetchQueue = async () => {
    try {
      const queueData = await GetPlayersInQueue(ctx.queueId);
      if (queueData === null) return;
      if (
        !isAdmin &&
        queueData.players.length < prevPlayersLengthRef.current &&
        players.players.filter((player) => player.id === ctx.playerId)
          .length === 0
      ) {
        onPlayerModified?.();
      }

      setPlayers(queueData);
      prevPlayersLengthRef.current = queueData.players.length;
    } catch (error) {
      return error;
    }
  };

  const acceptPlayer = async (playerId: string) => {
    try {
      const playerData = await AcceptPlayerInQueue(
        ctx.roomId,
        playerId,
        ctx.roomToken
      );
      if (playerData === null) return;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setButtonIndexLoading("");
  }, [players]);

  useEffect(() => {
    fetchQueue();
    const intervalId = setInterval(fetchQueue, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddToRoom = (playerId: string) => {
    setIsLoading(true);
    setButtonIndexLoading(playerId);
    acceptPlayer(playerId);
  };

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
            {isAdmin && (
              <button
                onClick={() => handleAddToRoom(player.id)}
                className="btn btn-primary"
              >
                {isLoading && buttonIndexLoading === player.id && <Spinner />}
                Add
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default QueueList;