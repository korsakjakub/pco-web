import { useEffect, useState } from "react";
import getContext from "../utils/getContext";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";

interface Props {
  roomId: string;
}

const PlayersList = ({ roomId }: Props) => {
  const ctx = getContext();
  const [players, setPlayers] = useState<Players>({
    players: [],
  });
  const fetchPlayers = async () => {
    try {
      const playersData = await GetPlayersInRoom(roomId);
      if (playersData === null) return;
      setPlayers(playersData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <p>players:</p>
      <ul className="list-group">
        {players.players.length === 0 && (
          <li className="list-group-item">No players in room</li>
        )}
        {players.players.map((player) => (
          <li className="list-group-item" key={player.id}>
            <p>Name: {player.name}</p>
            <p>Id: {player.id}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PlayersList;
