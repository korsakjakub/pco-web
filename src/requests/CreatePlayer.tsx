import Player from "../interfaces/Player";
import getHostUrl from "../utils/getHostUrl";

const CreatePlayer = async (queueId: string, playerName: string) => {
  const r = await fetch(
    getHostUrl() + "/api/v1/player/create?queueId=" + queueId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playerName }),
    }
  );
  if (!r.ok) {
    throw new Error("could not create player with queueId: " + queueId + " and playerName: " + playerName);
  }
  const rb = await r.json();
  return rb as Player;
};

export default CreatePlayer;
