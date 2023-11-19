import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Action } from "../enums/Action";
import PerformAction from "../requests/PerformAction";
import getContext from "../utils/getContext";

type Props = {
  actions: Action[];
  currentPlayerId: String;
};

const PlayerActions = ({ actions, currentPlayerId }: Props) => {
  const ctx = getContext();

  const [betSize, setBetSize] = useState("");

  const performAction = (action: Action) => PerformAction(action, betSize);

  const isNotMyTurn = () => currentPlayerId !== ctx.playerId;

  return (
    <>
      {
        actions.map((a, index) => (
          <Button disabled={isNotMyTurn()} onClick={() => performAction(a)} key={index}>{a}</Button>
        ))
      }
      <InputGroup className="mb-3">
        <InputGroup.Text>$</InputGroup.Text>
        <Form.Control 
          type="number" 
          onChange={(e) => setBetSize(e.target.value)} 
          value={betSize} 
          placeholder="Bet size" 
          aria-label="Amount (to the nearest dollar)" />
      </InputGroup>
    </>
  );
};

export default PlayerActions;

