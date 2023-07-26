import getHostUrl from "../utils/getHostUrl";

const GetPlayersInRoom = async (roomId: string): Promise<Players> => {
  const r = await fetch(getHostUrl() + "/api/v1/room/" + roomId + "/players", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (r.ok) {
    const rb = await r.json();
    return rb as Players;
  } else {
    throw new Error("could not fetch queue." + JSON.stringify(r));
  }
};

export default GetPlayersInRoom;
