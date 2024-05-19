import Player from "../interfaces/Player";
import getHostUrl from "../utils/getHostUrl";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";

const CreatePlayer = async (queueId: string, playerName: string, avatar: AvatarOptions) => {
  const r = await fetch(
    getHostUrl() + "/api/v1/player/create?queueId=" + queueId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playerName, avatar: avatar }),
    }
  );
  if (!r.ok) {
    throw new Error("could not create player with queueId: " + queueId + " and playerName: " + playerName);
  }
  const rb = await r.json();
  return rb as Player;
};

export default CreatePlayer;
