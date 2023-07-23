import getHostUrl from "../utils/getHostUrl";

const GetPlayersInQueue = async (queueId: string) => {
  const r = await fetch(
    getHostUrl() + "/api/v1/queue/" + queueId + "/players",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb;
  } else {
    throw new Error("could not fetch queue." + JSON.stringify(r));
  }
};

export default GetPlayersInQueue;
