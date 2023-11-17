import getHostUrl from "../utils/getHostUrl";

const StartGame = async (roomId: string, roomToken: string): Promise<boolean> => {
  const r = await fetch(
    getHostUrl() + "/api/v1/game/start?roomId=" + roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + roomToken,
      },
    }
  );
  return r.ok;
};

export default StartGame;
