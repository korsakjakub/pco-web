import { useState } from "react";
import getHostUrl from "../utils/getHostUrl";
import NameForm from "./NameForm";
import Context from "../interfaces/Context";
import CreateAvatar from "./CreateAvatar";
import getRandomAvatarOptions, { AvatarOptions } from "../utils/getRandomAvatarOptions";

interface Props {
  onSuccess: (response: Context) => void;
  onError: (response: string) => void;
}

const NewGame = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);

  const newGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const roomResponse = await fetch(getHostUrl() + "/api/v1/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.get("roomName")}),
      });
      const roomResponseBody = await roomResponse.json();

      if (!roomResponse.ok) {
        onError(JSON.stringify(roomResponse));
      }

      const playerResponse = await fetch(
        getHostUrl() + "/api/v1/room/" + roomResponseBody.id + "/players",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + roomResponseBody.token,
          },
          body: JSON.stringify({ name: formData.get("playerName"), avatar: avatar }),
        },
      );
      const playerResponseBody = await playerResponse.json();

      if (!playerResponse.ok) {
        onError(JSON.stringify(playerResponse));
      }

      onSuccess({
        playerId: playerResponseBody.id,
        playerToken: playerResponseBody.token,
        queueId: roomResponseBody.queueId,
        roomId: roomResponseBody.id,
        roomName: roomResponseBody.name,
        roomToken: roomResponseBody.token,
      } as Context);
    } catch (error) {
      onError("Could not create a new game");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="new-game-wrapper">
      <CreateAvatar 
        avatarOptions={avatar}
        onRandom={() => setAvatar(getRandomAvatarOptions())}
      />
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
