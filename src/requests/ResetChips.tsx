import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const ResetChips = async (
  playerId: string,
  chips: number,
  roomId: string = "",
  roomToken: string = "",
) => {
  const getUsedRoomInfo = () => {
    try {
      const ctx = getContext();
      return ctx
        ? { roomId: ctx.roomId, roomToken: ctx.roomToken }
        : { roomId, roomToken };
    } catch (error) {
      return { roomId, roomToken };
    }
  };
  const { roomId: usedRoomId, roomToken: usedRoomToken } = getUsedRoomInfo();
  const r = await fetch(
    getHostUrl() + "/api/v1/player/" + playerId + "/chips?roomId=" + usedRoomId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + usedRoomToken,
      },
      body: JSON.stringify({ chips: chips }),
    },
  );

  if (r.ok) {
    return true;
  } else {
    throw new Error("could not reset chips." + JSON.stringify(r));
  }
};

export default ResetChips;
