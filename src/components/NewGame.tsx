import { useState } from "react";
import NameForm from "./NameForm";
import Context from "../interfaces/Context";
import CreateAvatar from "./CreateAvatar";
import getRandomAvatarOptions, {
  AvatarOptions,
} from "../utils/getRandomAvatarOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CreateRoomWithAdmin from "../requests/CreateRoomWithAdmin";

interface Props {
  onSuccess: (response: Context) => void;
  onError: (response: string) => void;
}

const NewGame = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);
  const [previousAvatars, setPreviousAvatars] = useState<AvatarOptions[]>([]);

  const newGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    const playerNameEntry = formData.get("playerName");
    let playerName;
    if (playerNameEntry) {
      playerName = playerNameEntry.toString();
    } else {
      onError("Player name is required.");
      return;
    }

    CreateRoomWithAdmin(playerName, avatar)
      .then(([playerId, playerToken, queueId, roomId, roomToken]) => {
        onSuccess({
          playerId: playerId,
          playerToken: playerToken,
          queueId: queueId,
          roomId: roomId,
          roomToken: roomToken,
        } as Context);
      })
      .catch((error) => {
        onError("Could not create a new game");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const setAvatarAndStorePrevious = (newAvatarOptions: AvatarOptions) => {
    setAvatar(newAvatarOptions);
    setPreviousAvatars((prevAvatars) => {
      const updatedAvatars = [...prevAvatars, avatar];
      return updatedAvatars.slice(-10);
    });
  };

  const setAvatarToPrevious = () => {
    const lastAvatar = previousAvatars[previousAvatars.length - 1];
    setAvatar(lastAvatar);
    setPreviousAvatars((prevAvatars) => {
      if (prevAvatars.length === 0) {
        return prevAvatars;
      }
      return prevAvatars.slice(0, -1);
    });
  };

  return (
    <div className="new-game-wrapper">
      <div>
        <div
          onMouseDown={() =>
            setAvatarAndStorePrevious(getRandomAvatarOptions())
          }
          data-tooltip="Click me!"
        >
          <CreateAvatar avatarOptions={avatar} />
        </div>
        <button
          onMouseDown={() => setAvatarToPrevious()}
          disabled={previousAvatars.length === 0}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <NameForm
        button="New game"
        isLoading={isLoading}
        name="player"
        onSubmit={newGame}
        className="new-game-form"
      />
    </div>
  );
};

export default NewGame;
