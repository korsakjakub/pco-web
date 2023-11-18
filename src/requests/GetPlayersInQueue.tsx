import Player from "../interfaces/Player";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const GetPlayersInQueue = async (): Promise<Player[]> => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/queue/" + ctx.queueId + "/players",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb.players as Player[];
  } else {
    throw new Error("could not fetch queue." + JSON.stringify(r));
  }
};

export default GetPlayersInQueue;
