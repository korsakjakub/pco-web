import getHostUrl from "../utils/getHostUrl";

const StartGame = async (roomId: string, roomToken: string) => {
  const r = await fetch(
    getHostUrl() + "/api/v1/game/start?roomId=" + roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + roomToken,
      },
    }
  );
  if (!r.ok) {
    throw new Error("could not start game for room: " + roomId);
  }
};

export default StartGame;
