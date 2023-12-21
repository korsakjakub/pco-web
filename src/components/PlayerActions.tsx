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

  const performAction = (action: Action) => {
    onActionPerformed();
    PerformAction(action, betSize);
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
          aria-label="Amount (to the nearest dollar)" />
      </form>
    </>
  );
};

export default PlayerActions;

