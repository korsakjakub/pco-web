import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const KickPlayerFromRoom = async (
  playerId: string,
) => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/room/" + ctx.roomId + "/players/" + playerId,
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
    throw new Error("could not kick player from room." + JSON.stringify(r));
  }
};

export default KickPlayerFromRoom
