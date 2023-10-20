import getContext from "../../utils/getContext";
import getHostUrl from "../../utils/getHostUrl";

const Check = async () => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/game/check?roomId=" + ctx.roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.playerToken,
      },
        body: JSON.stringify({ id: ctx.playerId }),
    }
  );
  if (!r.ok) {
    throw new Error("could not check for player: " + ctx.playerId);
  }
};

export default Check;
