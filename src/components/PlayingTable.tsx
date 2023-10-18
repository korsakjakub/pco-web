import { Spinner } from "react-bootstrap";
import Player from "../interfaces/Player";

type Props = {
  players: Player[];
  stakedChips: number;
  isLoading: boolean;
  currentPlayer: string;
};

const PlayingTable = ({ players, stakedChips, isLoading, currentPlayer }: Props) => {
  const phi = (2 * Math.PI) / players.length;

  const coords = (i: number, radius: number) => {
    return {
      left: 50 + radius * Math.sin(phi * i) + "%",
      top: 50 + radius * Math.cos(phi * i) + "%",
    };
  };

  const playerFrameCls = (player: Player) => {
    if (player.id === currentPlayer)
      return "player-frame frame-active";
    return "player-frame";
  }

  return (
    <div className="circular-table-wrapper">
      <div className="circular-table" />
      {isLoading && <Spinner />}
      {!isLoading &&
        players.length > 0 &&
        players.map((player, index) => {
          return (
            <div key={player.id}>
              <div className={playerFrameCls(player)} style={coords(index, 40)}>
                <p className="player-frame-name">{player.name}</p>
                <p className="player-frame-chips">${player.chips}</p>
              </div>
              <p className="player-chips" style={coords(index, 20)}>
                ${player.stakedChips}
              </p>
            </div>
          );
        })}
      <p className="staked-chips">Pot: ${stakedChips}</p>
    </div>
  );
};

export default PlayingTable;
