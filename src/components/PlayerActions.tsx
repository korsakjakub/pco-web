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
  validBetSize: (action: Action, betSize: number) => boolean;
};

const PlayerActions = ({ actions, currentPlayerId, currentPlayerStakedChips, gameStage, validBetSize }: Props) => {
  const ctx = getContext();

  const [betSize, setBetSize] = useState("");
  const [isBetSizeValid, setIsBetSizeValid] = useState(true);

  const performAction = (action: Action, event: any) => {
    event.preventDefault();
    if (betSize === '' && [Action.RAISE, Action.BET].includes(action)) {
      console.log("r1")
      setIsBetSizeValid(false);
    } else if (!validBetSize(action, +betSize)) {
      console.log("r2")
      setIsBetSizeValid(false);
    } else {
      console.log("r3")
      PerformAction(action, +betSize);
      setIsBetSizeValid(true);
    }
  };

  const areActionsDisabled = () => currentPlayerId !== ctx.playerId || gameStage === GameStage.SHOWDOWN;

  return (
    <div className="player-actions">
      {
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
      </form>
    </div>
  );
};

export default PlayerActions;

