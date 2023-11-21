import Player from "../interfaces/Player";
import getContext from "../utils/getContext";

type Props = {
  players: Player[];
  stakedChips: number;
  isLoading: boolean;
  currentPlayer: string;
};

const PlayingTable = ({ players, stakedChips, isLoading, currentPlayer }: Props) => {
  const ctx = getContext();

  const shiftPlayers = (players: Player[]): Player[] => {
    const length = players.length;
    const positionsToShift = players.findIndex(player => player.id === ctx.playerId);
    const shift = (length + positionsToShift) % length;

    return players.map((_, index, array) => array[(index - shift + length) % length]);
  }

  const shiftedPlayers = shiftPlayers(players);

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

  if (isLoading) {
    return (<div aria-busy="true" className="circular-table-wrapper">
      Loading...
    </div>);
  }

  return (
    <div className="circular-table-wrapper">
      <div className="circular-table" />
      {players.length > 0 &&
        shiftedPlayers.map((player, index) => {
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
