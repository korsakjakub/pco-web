import { GameStage } from "../enums/GameStage";
import Player from "../interfaces/Player";
import DecideWinner from "../requests/DecideWinner";
import getContext from "../utils/getContext";
import getFrontUrl from "../utils/getFrontUrl";
import PlayerInTable from "../components/PlayerInTable";
import AnimateChips from "../animations/AnimateChips";
import Rules from "../interfaces/Rules";
import { GameState } from "../enums/GameState";

type Props = {
  players: Player[];
  stakedChips: number;
  gameStage: GameStage;
  gameState: GameState;
  isLoading: boolean;
  currentPlayer: string;
  dealerId: string;
  rules: Rules;
};

const PlayingTable = ({ players, stakedChips, gameStage, gameState, isLoading, currentPlayer, dealerId, rules }: Props) => {
  const ctx = getContext();

  const shiftPlayers = (players: Player[]): Player[] => {
    const length = players.length;
    const positionsToShift = players.findIndex(player => player.id === ctx.playerId);
    const shift = (length - positionsToShift) % length;

    return players.map((_, index, array) => array[(index - shift + length) % length]);
  }

  const shiftedPlayers = shiftPlayers(players);
  

  const phi = (2 * Math.PI) / players.length;

  const coords = (i: number, radius: number) => {
    return {
      left: 50 - radius * Math.sin(phi * i) + "%",
      top: 50 + radius * Math.cos(phi * i) + "%",
    };
  };


  const decideWinner = async (playerId: string) => {
    if (gameStage !== GameStage.SHOWDOWN || ctx.roomToken === "" || ctx.roomToken === null) {
      return;
    }
    await DecideWinner(playerId);

  };

  const showGameStage = (stage: GameStage) => {
    const singleCard = <img src="/card-back.svg" alt="Playing card" />;
    const cardsOnTable = stage === GameStage.FLOP ? 3 : stage === GameStage.TURN ? 4 : [GameStage.RIVER, GameStage.SHOWDOWN].includes(stage) ? 5 : 0;

    return Array(cardsOnTable).fill(singleCard).map((card, index) => (
      <div className="table-card" key={index}>{card}</div>
    ));
  };

  return (
    <div className="circular-table-wrapper">
      <div className="circular-table" />
      {players.length > 0 &&
        shiftedPlayers.map((player, index) => (
          <PlayerInTable
            key={player.id}  // Add a unique key prop
            player={player} 
            active={player.id === currentPlayer} 
            getCoords={(r: number) => coords(index, r)} 
            isLoading={isLoading} 
            onPickWinner={decideWinner}
            isDealer={dealerId === player.id}
						gameStage={gameStage}
						gameState={gameState}
            rules={rules}
          />
        ))
      }
      <div className="game-info">
        <div className="staked-chips">Pot: {AnimateChips(0, stakedChips)}</div>
        <div className="game-stage">{showGameStage(gameStage)}</div>
      </div>
    </div>
  );
};

export default PlayingTable;
