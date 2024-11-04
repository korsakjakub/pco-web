import { useEffect, useState } from "react";
import { PlayerState } from "../enums/PlayerState";
import ToggleSittingOut from "../requests/ToggleSittingOut";

interface Props {
  playerState: PlayerState;
  onClicked: () => void;
}

const SittingOutSwitch = ({ playerState, onClicked }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const toggleSittingOut = () => {
    setIsLoading(true);
    ToggleSittingOut()
      .then(() => {
        setIsLoading(false);
        onClicked();
      })
      .catch((reason: any) => {
        console.error("Failed to toggle sitting out", reason);
        setIsLoading(true);
      });
  };

  return (
    <>
      <label className="sitting-out-switch">
        <input
          name="sitting-out"
          type="checkbox"
          role="switch"
          checked={playerState === PlayerState.SITTING_OUT}
          onChange={toggleSittingOut}
          aria-busy={isLoading}
        />
        Sitting out
      </label>
    </>
  );
};

export default SittingOutSwitch;
