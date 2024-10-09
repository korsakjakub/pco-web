import { useState } from "react";
import Context from "../interfaces/Context";
import CreateAvatar from "./CreateAvatar";
import getRandomAvatarOptions, {
  AvatarOptions,
} from "../utils/getRandomAvatarOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CreateRoomWithAdmin from "../requests/CreateRoomWithAdmin";
import { gameMode, GameMode } from "../enums/GameMode";
import SetRules from "../requests/SetRules";
import Rules from "../interfaces/Rules";
import CreateRoomWithAdminData from "../interfaces/CreateRoomWithAdminData";

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
  const toggleAdvanced = (event: any) => {
    event.preventDefault();
    setShowAdvanced((prev) => !prev);
  };

  const handleChange = (fieldName: keyof NewGameFormData, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const newGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const dataToSubmit = {
      playerName: data.playerName,
      gameMode: data.gameMode,
      startingChips: data.startingChips,
      smallBlind: data.smallBlind,
      bigBlind: data.bigBlind,
      ante: data.ante,
    } as CreateRoomWithAdminData;

    await CreateRoomWithAdmin(dataToSubmit, avatar)
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
        onError("Could not create a new game. " + error);
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
          onChange={(e) => handleChange("playerName", e.target.value)}
          required
        />
        <label>
          <select
            name="gameMode"
            onChange={(e) => handleChange("gameMode", gameMode(e.target.value))}
            required
          >
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
                aria-label="starting chips"
                value={data.startingChips}
                onChange={(e) =>
                  handleChange("startingChips", e.target.valueAsNumber)
                }
              />
            </label>
            <label>
              Small blind
              <input
                type="number"
                name="smallBlind"
                aria-label="small blind"
                value={data.smallBlind}
                onChange={(e) =>
                  handleChange("smallBlind", e.target.valueAsNumber)
                }
              />
            </label>
            <label>
              Big blind
              <input
                type="number"
                name="bigBlind"
                aria-label="big blind"
                value={data.bigBlind}
                onChange={(e) =>
                  handleChange("bigBlind", e.target.valueAsNumber)
                }
              />
            </label>
            {data.gameMode === GameMode.TOURNAMENT && (
              <label>
                Ante
                <input
                  type="number"
                  name="ante"
                  aria-label="ante"
                  value={data.ante}
                  onChange={(e) => handleChange("ante", e.target.valueAsNumber)}
                />
              </label>
            )}
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
