import { useState } from "react";
import getContext from "../utils/getContext";
import AcceptPlayerInQueue from "../requests/AcceptPlayerInQueue";
import Player from "../interfaces/Player";
import KickPlayerFromQueue from "../requests/KickPlayerFromQueue";

interface Props {
  players: Player[];
  onPlayerModified?: () => void;
}

const QueueList = ({ players, onPlayerModified }: Props) => {
  const ctx = getContext();
  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;
  const [isLoading, setIsLoading] = useState(false);
  const [buttonIndexLoading, setButtonIndexLoading] = useState("");

  const acceptPlayer = async (playerId: string) => {
    try {
      const playerData = await AcceptPlayerInQueue(
        ctx.roomId,
        playerId,
        ctx.roomToken
      );
      if (playerData === null) return;

      onPlayerModified?.();
    } catch (error) {
      return error;
    }
  };

  const handleAddToRoom = (playerId: string) => {
    setIsLoading(true);
    setButtonIndexLoading(playerId);
    acceptPlayer(playerId);
  };

  const handleKickFromQueue = (playerId: string) => {
    setIsLoading(true);
    setButtonIndexLoading(playerId);
    KickPlayerFromQueue(playerId);
  }

  return (
    <table>
      <thead>
        <tr>
          <th>
          Queue
          </th>
        </tr>
      </thead>
      <tbody>
        {players.length === 0 && (
          <tr><td>No players in queue</td></tr>
        )}
        {players.map((player) => (
          <tr key={player.id}>
            <td>Name: {player.name}</td>
            <td>Id: {player.id}</td>
            {isAdmin() && (
              <td>
                <button aria-busy={isLoading && buttonIndexLoading === player.id} onClick={() => handleAddToRoom(player.id)}>
                  Add
                </button>
                <button onClick={() => handleKickFromQueue(player.id)}>Kick out</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default QueueList;
