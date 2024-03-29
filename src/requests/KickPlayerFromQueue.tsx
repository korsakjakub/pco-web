import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const KickPlayerFromQueue = async (
  playerId: string,
) => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/queue/" + ctx.queueId + "/players/" + playerId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.roomToken,
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb;
  } else {
    throw new Error("could not delete player." + JSON.stringify(r));
  }
};

export default KickPlayerFromQueue;
