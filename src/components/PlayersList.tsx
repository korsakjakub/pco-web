import Player from "../interfaces/Player";

interface Props {
  players: Player[];
}

const PlayersList = ({ players }: Props) => {
  return (
    <table>
      <thead>
        <tr>
        <th>
          Players
        </th>
        </tr>
      </thead>
      <tbody>
        {players?.length === 0 && (
          <tr><td>No players in room</td></tr>
        )}
        {players?.map((player) => (
          <tr key={player.id}>
              <td>Name: {player.name}</td>
              <td>Id: {player.id}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayersList;
