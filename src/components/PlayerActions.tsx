import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Action } from "../enums/Action";
import PerformAction from "../requests/PerformAction";
import GetCurrentPlayer from "../requests/GetCurrentPlayer";
import getContext from "../utils/getContext";

type Props = {
  actions: Action[];
};

const PlayerActions = ({ actions }: Props) => {
  const ctx = getContext();

  const {data: currentPlayer } = useQuery({
    queryFn: () => GetCurrentPlayer(ctx.roomId),
    queryKey: ["currentPlayer"],
  });

  const [betSize, setBetSize] = useState("");

  const performAction = (action: Action) => PerformAction(action, betSize);

  const isNotMyTurn = () => currentPlayer?.id !== ctx.playerId;

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

