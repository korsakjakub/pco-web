import { useState } from "react";
import { gameMode, GameMode } from "../enums/GameMode";
import Context from "../interfaces/Context";
import CreateRoomWithAdminData from "../interfaces/CreateRoomWithAdminData";
import CreateRoomWithAdmin from "../requests/CreateRoomWithAdmin";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";
import EnhancedAvatarBuilder from "./EnhancedAvatarBuilder";
import { GAME_DEFAULTS } from "../constants/gameDefaults";

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
  const [avatar, setAvatar] = useState<AvatarOptions>({} as AvatarOptions);
  const [data, setData] = useState<NewGameFormData>({
    playerName: "",
    gameMode: GameMode.CASH,
    startingChips: GAME_DEFAULTS.STARTING_CHIPS,
    smallBlind: GAME_DEFAULTS.SMALL_BLIND,
    bigBlind: GAME_DEFAULTS.BIG_BLIND,
    ante: GAME_DEFAULTS.ANTE,
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const toggleAdvanced = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowAdvanced((prev) => !prev);
  };

  const handleChange = (fieldName: keyof NewGameFormData, value: any) => {
    setData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const newGame = async (event: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <>
      <EnhancedAvatarBuilder onAvatarChanged={setAvatar} />
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
          disabled={isLoading || data.playerName.length < GAME_DEFAULTS.MIN_PLAYER_NAME_LENGTH}
        >
          New game
        </button>
      </form>
    </>
  );
};

export default NewGame;
