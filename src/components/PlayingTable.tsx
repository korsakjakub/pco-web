import { GameStage } from "../enums/GameStage";
import Player from "../interfaces/Player";
import DecideWinner from "../requests/DecideWinner";
import getContext from "../utils/getContext";
import getFrontUrl from "../utils/getFrontUrl";

type Props = {
  players: Player[];
  stakedChips: number;
  gameStage: GameStage;
  isLoading: boolean;
  currentPlayer: string;
};

const PlayingTable = ({ players, stakedChips, gameStage, isLoading, currentPlayer }: Props) => {
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

  const decideWinner = async (playerId: string) => {
    if (gameStage !== GameStage.SHOWDOWN || ctx.roomToken === "" || ctx.roomToken === null) {
      return;
    }
    await DecideWinner(playerId);

  };

  const showGameStage = (stage: GameStage) => {
    if (stage === GameStage.PRE_FLOP)
    return "PREFLOP";

    const singleCard = <img src={getFrontUrl() + "/card-back.svg"}/>;
    const cardsOnTable = stage === GameStage.FLOP ? 3 : stage === GameStage.TURN ? 4 : [GameStage.RIVER, GameStage.SHOWDOWN].includes(stage) ? 5 : 0;

    return Array(cardsOnTable).fill(singleCard).map((card, index) => (
      <div className="table-card" key={index}>{card}</div>
    ));
  };

  return (
    <div className="circular-table-wrapper">
      <div className="circular-table" />
      {players.length > 0 &&
        shiftedPlayers.map((player, index) => {
          return (
            <div key={player.id} onClick={() => decideWinner(player.id)}>
              <div className={playerFrameCls(player)} style={coords(index, 40)}>
                <p className="player-frame-name">{player.name}</p>
                <p aria-busy={isLoading} className="player-frame-chips">${player.chips}</p>
              </div>
              <p aria-busy={isLoading} className="player-chips" style={coords(index, 20)}>
                ${player.stakedChips}
              </p>
            </div>
          );
        })}
      <div className="game-info">
        <div className="staked-chips">Pot: ${stakedChips}</div>
        <div className="game-stage">{showGameStage(gameStage)}</div>
      </div>
    </div>
  );
};

export default PlayingTable;
