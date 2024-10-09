import Rules from "../interfaces/Rules";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const SetRules = async (
  rules: Rules,
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
    getHostUrl() + "/api/v1/game/rules?roomId=" + usedRoomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + usedRoomToken,
      },
      body: JSON.stringify(rules),
    },
  );

  if (r.ok) {
    return true;
  } else {
    throw new Error("could not set rules." + JSON.stringify(r));
  }
};

export default SetRules;
