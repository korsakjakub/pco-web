import { useState } from "react";
import { PlayerState } from "../enums/PlayerState";
import ToggleSittingOut from "../requests/ToggleSittingOut";

interface Props {
  playerState: PlayerState;
}

const SittingOutSwitch = ({ playerState }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleSittingOut = () => {
    setIsLoading(true);
    ToggleSittingOut();
  };
  return (
    <>
      <label className="sitting-out-switch" aria-busy={isLoading}>
        <input
          name="sitting-out"
          type="checkbox"
          role="switch"
          checked={playerState === PlayerState.SITTING_OUT}
          onChange={() => {
            toggleSittingOut();
          }}
        />
        Sitting out
      </label>
    </>
  );
};

export default SittingOutSwitch;
