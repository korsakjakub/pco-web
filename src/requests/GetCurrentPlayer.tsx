import Player from "../interfaces/Player";
import getHostUrl from "../utils/getHostUrl";

const GetCurrentPlayer = async (roomId: string): Promise<Player> => {
  const r = await fetch(
    getHostUrl() + "/api/v1/game/current-player?roomId=" + roomId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb as Player;
  } else {
    throw new Error("could not fetch current player. " + JSON.stringify(r));
  }
};

export default GetCurrentPlayer;
