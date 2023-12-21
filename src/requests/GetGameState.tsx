import getHostUrl from "../utils/getHostUrl";

const GetCurrentPlayer = async (roomId: string): Promise<string> => {
  const r = await fetch(
    getHostUrl() + "/api/v1/game/state?roomId=" + roomId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb as string;
  } else {
    throw new Error("could not fetch current game state. " + JSON.stringify(r));
  }
};

export default GetCurrentPlayer;
