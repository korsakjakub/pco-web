import { useState } from "react";
import Context from "../interfaces/Context";
import CreateAvatar from "./CreateAvatar";
import getRandomAvatarOptions, {
  AvatarOptions,
} from "../utils/getRandomAvatarOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CreateRoomWithAdmin from "../requests/CreateRoomWithAdmin";
import { GameMode } from "../enums/GameMode";
import SetRules from "../requests/SetRules";
import Rules from "../interfaces/Rules";

interface NewGameFormData {
  playerName: string;
  gameMode: GameMode;
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
}

interface Props {
  onSuccess: (response: Context) => void;
  onError: (response: string) => void;
}

const NewGame = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);
  const [previousAvatars, setPreviousAvatars] = useState<AvatarOptions[]>([]);
  const [data, setData] = useState<NewGameFormData>({
    playerName: "",
    gameMode: GameMode.CASH,
    startingChips: 1000,
    smallBlind: 25,
    bigBlind: 50,
    ante: 0,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const toggleAdvanced = () => {
    setShowAdvanced((prev) => !prev);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const newGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    const dataToSubmit = {
      name: formData.get("playerName")?.toString() || data.playerName,
      gameMode: formData.get("gameMode")?.toString() || data.gameMode,
      startingChips:
        formData.get("startingChips")?.toString() || data.startingChips,
      smallBlind: formData.get("smallBlind")?.toString() || data.smallBlind,
      bigBlind: formData.get("bigBlind")?.toString() || data.bigBlind,
      ante: formData.get("ante")?.toString() || data.ante,
    };

    await CreateRoomWithAdmin(dataToSubmit.name, avatar)
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
    await SetRules({
      startingChips: dataToSubmit.startingChips,
      ante: dataToSubmit.ante,
      smallBlind: dataToSubmit.smallBlind,
      bigBlind: dataToSubmit.bigBlind,
    } as Rules);
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
    <>
      <div
        onMouseDown={() => setAvatarAndStorePrevious(getRandomAvatarOptions())}
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
      <form onSubmit={newGame}>
        <input
          type="text"
          name="playerName"
          placeholder="player name"
          aria-label="player name"
          aria-describedby="new-player-input"
          value={data.playerName}
          onChange={handleChange}
          required
        />
        <label>
          <select name="gameMode" onChange={() => handleChange} required>
            <option>Cash Game</option>
            <option>Tournament</option>
          </select>
        </label>
        <button onClick={toggleAdvanced}>
          {showAdvanced ? "Hide advanced" : "Show advanced"}
        </button>
        {showAdvanced && (
          <>
            <label>
              Starting chips
              <input
                type="number"
                name="startingChips"
                placeholder="1000"
                aria-label="starting chips"
                value={data.startingChips}
                onChange={handleChange}
              />
            </label>
            <label>
              Small blind
              <input
                type="number"
                name="smallBlind"
                aria-label="small blind"
                value={data.smallBlind}
                onChange={handleChange}
              />
            </label>
            <label>
              Big blind
              <input
                type="number"
                name="bigBlind"
                aria-label="big blind"
                value={data.bigBlind}
                onChange={handleChange}
              />
            </label>
            <label>
              Ante
              <input
                type="number"
                name="ante"
                aria-label="ante"
                value={data.ante}
                onChange={handleChange}
              />
            </label>
          </>
        )}
        <button
          aria-busy={isLoading}
          type="submit"
          id="new-game-button"
          disabled={isLoading || data.playerName.length < 2}
        >
          New game
        </button>
      </form>
    </>
  );
};

export default NewGame;
