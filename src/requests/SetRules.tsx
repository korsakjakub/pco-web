import Rules from "../interfaces/Rules";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const SetRules = async (
  rules: Rules
) => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/game/rules?roomId=" + ctx.roomId,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.roomToken,
      },
      body: JSON.stringify(rules),
    }
  );

  if (r.ok) {
    return true;
  } else {
    throw new Error("could not set rules." + JSON.stringify(r));
  }
}

export default SetRules
