import { Button } from "react-bootstrap";
import Check from "../requests/playerActions/Check";
import Call from "../requests/playerActions/Call";
import { useState } from "react";

type Props = {
  tableChips: number;
  playerStakedChips: number;
  currentBetSize: number;
};

const PlayerActions = ({
  tableChips,
  playerStakedChips,
  currentBetSize,
}: Props) => {
  const [isLoading, setIsLoading] = useState<number>(-1);

  const checkOrCall = () =>
    currentBetSize <= playerStakedChips ? "Check" : "Call";

  const betOrRaise = () => (tableChips === 0 ? "Bet" : "Raise");

  const handleFold = () => {
    setIsLoading(0)
    setTimeout(() => {}, 2000)
    setIsLoading(-1);
  };

  const handleCheckOrCall = () => {
    setIsLoading(1);
    console.log(checkOrCall());
    switch (checkOrCall()) {
      case "Check":
        Check();
        console.log("check");
        break;
      case "Call":
        console.log("call");
        Call();
        break;
      default:
        setIsLoading(-1);
        break;
    }
  };
  const handleBetOrRaise = () => {
    setIsLoading(2);
    console.log(betOrRaise());
    setTimeout(() => {}, 1000)
    setIsLoading(-1);
  };

  return (
    <>
      <Button onClick={handleFold} disabled={isLoading > -1}>
        Fold
      </Button>
      <Button onClick={handleCheckOrCall} disabled={isLoading > -1}>
        {checkOrCall()}
      </Button>
      <Button onClick={handleBetOrRaise} disabled={isLoading > -1}>
        {betOrRaise()}
      </Button>
    </>
  );
};

export default PlayerActions;
