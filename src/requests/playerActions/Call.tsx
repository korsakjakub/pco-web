import getContext from "../../utils/getContext";
import getHostUrl from "../../utils/getHostUrl";

const Call = async () => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/game/call?roomId=" + ctx.roomId,
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
    throw new Error("could not call for player: " + ctx.playerId);
  }
};

export default Call;
