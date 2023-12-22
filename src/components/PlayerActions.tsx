import { useState } from "react";
import { Action } from "../enums/Action";
import { GameStage } from "../enums/GameStage";
import PerformAction from "../requests/PerformAction";
import getContext from "../utils/getContext";

type Props = {
  actions: Action[];
  currentPlayerId: String;
  gameStage: GameStage;
  onActionPerformed: () => void;
};

const PlayerActions = ({ actions, currentPlayerId, gameStage, onActionPerformed }: Props) => {
  const ctx = getContext();

  const [betSize, setBetSize] = useState("");
  const [isBetSizeValid, setIsBetSizeValid] = useState(true);

  const performAction = (action: Action) => {
    if (betSize === '' && [Action.RAISE, Action.BET].includes(action)) {
      console.log('betsize is invalid');
      setIsBetSizeValid(false);
      return;
    }
    onActionPerformed();
    PerformAction(action, betSize);
    setIsBetSizeValid(true);
  };

  const areActionsDisabled = () => currentPlayerId !== ctx.playerId || gameStage === GameStage.SHOWDOWN;

  return (
    <>
      {
        actions.map((a, index) => (
          <button disabled={areActionsDisabled()} onClick={() => performAction(a)} key={index}>{a}</button>
        ))
      }
      <form className="mb-3">
        <input 
          type="number" 
          onChange={(e) => setBetSize(e.target.value)} 
          value={betSize} 
          placeholder="Bet size" 
          aria-label="Amount (to the nearest dollar)"
          className={isBetSizeValid ? '' : 'invalid'}
          />
      </form>
    </>
  );
};

export default PlayerActions;

