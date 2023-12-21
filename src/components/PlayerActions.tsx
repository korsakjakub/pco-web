import { useState } from "react";
import { Action } from "../enums/Action";
import PerformAction from "../requests/PerformAction";
import getContext from "../utils/getContext";

type Props = {
  actions: Action[];
  currentPlayerId: String;
  onActionPerformed: () => void;
};

const PlayerActions = ({ actions, currentPlayerId, onActionPerformed }: Props) => {
  const ctx = getContext();

  const [betSize, setBetSize] = useState("");

  const performAction = (action: Action) => {
    onActionPerformed();
    PerformAction(action, betSize);
  };

  const isNotMyTurn = () => currentPlayerId !== ctx.playerId;

  return (
    <>
      {
        actions.map((a, index) => (
          <button disabled={isNotMyTurn()} onClick={() => performAction(a)} key={index}>{a}</button>
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

