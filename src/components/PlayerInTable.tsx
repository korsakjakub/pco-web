import Player from '../interfaces/Player';

type Props = {
  player: Player;
  active: boolean;
  isLoading: boolean;
  onClick: (playerId: string) => void;
  getCoords: (radius: number) => any;
}

const PlayerInTable = ({player, active, isLoading, getCoords, onClick}: Props) => {

  const playerFrameCls = (isActive: boolean) => {
    return isActive ? "player-frame frame-active" : "player-frame";
  };

  return (
    <div key={player.id} onClick={() => onClick(player.id)}>
      <div className={playerFrameCls(active)} style={getCoords(40)}>
        <p className="player-frame-name">{player.name}</p>
        <p aria-busy={isLoading} className="player-frame-chips">${player.chips}</p>
      </div>
      <p aria-busy={isLoading} className="player-chips" style={getCoords(20)}>
        ${player.stakedChips}
      </p>
    </div>
  )
}

export default PlayerInTable
