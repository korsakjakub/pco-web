import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const ToggleSittingOut = async () => {
  const ctx = getContext();

  const r = await fetch(
    getHostUrl() +
      "/api/v1/player/sit-out?roomId=" +
      ctx.roomId +
      "?playerId=" +
      ctx.playerId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.playerToken,
      },
    },
  );

  if (r.ok) {
    return true;
  } else {
    throw new Error("could not toggle sitting out." + JSON.stringify(r));
  }
};

export default ToggleSittingOut;
