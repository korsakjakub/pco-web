import Player from "../interfaces/Player";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const GetPlayer = async (): Promise<Player> => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/player/" + ctx.playerId + "?roomId=" + ctx.roomId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.playerToken,
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb as Player;
  } else {
    throw new Error("could not fetch player." + JSON.stringify(r));
  }
};

export default GetPlayer;
