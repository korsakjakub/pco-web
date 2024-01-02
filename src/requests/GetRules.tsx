import Rules from "../interfaces/Rules";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const GetRules = async (): Promise<Rules> => {
  const ctx = getContext();
  const r = await fetch(getHostUrl() + "/api/v1/game/rules?roomId=" + ctx.roomId, {
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
