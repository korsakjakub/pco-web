import getHostUrl from "../utils/getHostUrl";

const KickPlayerFromQueue = async (
  roomId: string,
  playerId: string,
  roomToken: string
) => {
  const r = await fetch(
    getHostUrl() + "/api/v1/room/" + roomId + "/players/" + playerId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + roomToken,
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
