const GetPlayer = async (
  hostUrl: string,
  roomId: string,
  playerId: string,
  playerToken: string
) => {
  const playerResponse = await fetch(
    hostUrl + "/api/v1/player/" + playerId + "?roomId=" + roomId,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + playerToken,
      },
    }
  );

  if (playerResponse.ok) {
    const playerResponseBody = await playerResponse.json();
    return playerResponseBody;
  } else {
    throw new Error("could not fetch player." + JSON.stringify(playerResponse));
  }
};

export default GetPlayer;
