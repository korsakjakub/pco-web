import Rules from "../interfaces/Rules";
import getHostUrl from "../utils/getHostUrl";

const GetRules = async (
  roomId: string,
): Promise<Rules> => {
  const r = await fetch(getHostUrl() + "/api/v1/game/rules?roomId=" + roomId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (r.ok) {
    const rb = await r.json();
    return rb as Rules;
  } else {
    throw Error("could not fetch game.")
  }
};

export default GetRules;
