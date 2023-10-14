import Player from '../interfaces/Player';

type Props = {
    players: Player[]
}

const PlayingTable = ({players} : Props) => {
    const numberOfPlayers = players.length;

    const angle = (2 * Math.PI) / numberOfPlayers;

    const calculateOffsets = (phi: number, i: number) => {
        return {
            left: 40 + 40*Math.sin(phi * i) + '%',
            top: 35 + 45*Math.cos(phi * i) + '%'
        }
    }
  
    return (
      <div className="circular-table">
        {players.map((player, index) => {
          const {left, top} = calculateOffsets(angle, index);
          return (
            <div key={player.id} className="player-frame" style={{ left, top }}>
                <div className="player-avatar">
                <img src={`/avatar.png`} alt={player.name} />
                </div>
                <div className="player-info">
                <p>{player.name}</p>
                <p>{player.chips}</p>
                </div>
            </div>
          );
        })}
      </div>
    );
}

export default PlayingTable