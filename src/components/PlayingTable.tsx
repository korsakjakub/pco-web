import Player from "../interfaces/Player";

type Props = {
  players: Player[];
  stakedChips: number;
};

const PlayingTable = ({ players, stakedChips }: Props) => {
  const phi = (2 * Math.PI) / players.length;

  const coords = (i: number, radius: number) => {
    return {
      left: 50 + radius * Math.sin(phi * i) + "%",
      top: 50 + radius * Math.cos(phi * i) + "%",
    };
  };

  return (
    <div className="circular-table-wrapper">
      {" "}
      <div className="circular-table" />
      {players.map((player, index) => {
        return (
          <div key={player.id}>
            <div className="player-frame" style={coords(index, 40)}>
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
