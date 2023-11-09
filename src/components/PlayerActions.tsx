import { Button } from "react-bootstrap";
import { Action } from "../enums/Action";

type Props = {
  actions: Action[];
};

const PlayerActions = ({ actions }: Props) => {
  return (
    <>
      {
        actions.map((a, index) => (
          <Button key={index}>{a}</Button>
        ))
      }
    </>
  );
};

export default PlayerActions;

