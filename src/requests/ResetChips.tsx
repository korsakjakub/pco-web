import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";

const ResetChips = async(playerId: string, chips: number) => {
  const ctx = getContext();
  const r = await fetch(
    getHostUrl() + "/api/v1/player/" + playerId + "/chips?roomId=" + ctx.roomId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + ctx.roomToken,
      },
      body: JSON.stringify({ chips: chips }),
    },
  )
  console.log(r)

  if (r.ok) {
    return true;
  } else {
    throw new Error("could not reset chips." + JSON.stringify(r));
  }
};

export default ResetChips;
