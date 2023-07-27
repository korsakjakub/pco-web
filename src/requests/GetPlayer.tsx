import Player from "../interfaces/Player";

const GetPlayer = async (
  hostUrl: string,
  roomId: string,
  playerId: string,
  playerToken: string
): Promise<Player> => {
  const r = await fetch(
    hostUrl + "/api/v1/player/" + playerId + "?roomId=" + roomId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + playerToken,
      },
    }
  );

  if (r.ok) {
    const rb = await r.json();
    return rb as Player;
  } else {
    throw new Error("could not fetch player." + JSON.stringify(r));
  }
};

export default GetPlayer;
