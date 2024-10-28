import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const ToggleSittingOut = async (): Promise<boolean> => {
  const ctx = getContext();

  const r = await fetch(
    getHostUrl() +
      "/api/v1/player/" +
      ctx.playerId +
      "/sit-out?roomId=" +
      ctx.roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.roomToken,
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
