import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const StartGame = async (): Promise<boolean> => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/game/start?roomId=" + ctx.roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + ctx.roomToken,
      },
    }
  );
  return r.ok;
};

export default StartGame;
