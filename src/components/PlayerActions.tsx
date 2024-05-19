import { useState } from "react";
import { Action } from "../enums/Action";
import { GameStage } from "../enums/GameStage";
import PerformAction from "../requests/PerformAction";
import getContext from "../utils/getContext";

type Props = {
  actions: Action[];
  currentPlayerId: String;
  currentPlayerStakedChips: number;
  gameStage: GameStage;
  currentBetSize: number;
  minBetSize: number;
  maxBetSize: number;
  validBetSize: (action: Action, betSize: number) => boolean;
};

const PlayerActions = ({ actions, currentPlayerId, currentPlayerStakedChips, gameStage, minBetSize, maxBetSize, validBetSize }: Props) => {
  const ctx = getContext();

  const [betSize, setBetSize] = useState("");
  const [isBetSizeValid, setIsBetSizeValid] = useState(true);

  const performAction = (action: Action, event: any) => {
    event.preventDefault();
    if (betSize === '' && [Action.RAISE, Action.BET].includes(action)) {
      setIsBetSizeValid(false);
    } else if (!validBetSize(action, +betSize)) {
      setIsBetSizeValid(false);
    } else {
      PerformAction(action, +betSize);
      setIsBetSizeValid(true);
    }
  };

  const areActionsDisabled = () => currentPlayerId !== ctx.playerId || gameStage === GameStage.SHOWDOWN;

  return (
    <div className="player-actions">
      {actions.length > 0 && 
        actions.map((a, index) => (
          <button className="player-action" disabled={areActionsDisabled()}
            onClick={(event) => performAction(a, event)} key={index}>{a}</button>
        ))
      }
      <form>
        <input 
          type="number" 
          onChange={(e) => setBetSize(e.target.value)} 
          value={betSize} 
          placeholder={currentPlayerStakedChips.toString()}
          aria-label="Amount (to the nearest dollar)"
          aria-invalid={!isBetSizeValid}
          />
          <input type="range" min={minBetSize} max={maxBetSize} value={betSize} onChange={(e) => setBetSize(e.target.value)}/>
      </form>
    </div>
  );
};

export default PlayerActions;

