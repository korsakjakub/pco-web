import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import getRandomAvatarOptions, {
  AvatarOptions,
} from "../utils/getRandomAvatarOptions";
import AvatarImage from "./AvatarImage";

interface Props {
  onAvatarChanged: (avatarOptions: AvatarOptions) => void;
}

const CreateAvatar = ({ onAvatarChanged }: Props) => {
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);
  const [previousAvatars, setPreviousAvatars] = useState<AvatarOptions[]>([]);
  const [revertedAvatars, setRevertedAvatars] = useState<AvatarOptions[]>([]);

  // Notify parent component of initial avatar
  useEffect(() => {
    onAvatarChanged(initialAvatar);
  }, []);

  const setAvatarAndStorePrevious = (newAvatarOptions: AvatarOptions) => {
    setAvatar(newAvatarOptions);
    onAvatarChanged(newAvatarOptions);
    setPreviousAvatars((prevAvatars) => {
      const updatedAvatars = [...prevAvatars, avatar];
      return updatedAvatars.slice(-10);
    });
  };

  const setAvatarToPrevious = () => {
    const lastAvatar = previousAvatars[previousAvatars.length - 1];
    setRevertedAvatars((revAvatars) => {
      const updatedAvatars = [...revAvatars, avatar];
      return updatedAvatars.slice(-10);
    });
    setAvatar(lastAvatar);
    onAvatarChanged(lastAvatar);
    setPreviousAvatars((prevAvatars) => {
      if (prevAvatars.length === 0) {
        return prevAvatars;
      }
      return prevAvatars.slice(0, -1);
    });
  };

  const getNextAvatarOptions = () => {
    if (revertedAvatars.length == 0) {
      return getRandomAvatarOptions();
    }
    const nextAvatar = revertedAvatars[0];
    setRevertedAvatars((prevAvatars) => {
      return prevAvatars.slice(1);
    });
    return nextAvatar;
  };
  return (
    <>
      <div
        onMouseDown={() => setAvatarAndStorePrevious(getNextAvatarOptions())}
        data-tooltip="Click me!"
      >
        <AvatarImage avatarOptions={avatar} />
      </div>
      <button
        onMouseDown={() => setAvatarToPrevious()}
        disabled={previousAvatars.length === 0}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
    </>
  );
};

export default CreateAvatar;
