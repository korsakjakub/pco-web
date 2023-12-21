import getContext from '../utils/getContext';
import getHostUrl from '../utils/getHostUrl';

const DecideWinner = async (playerId: string): Promise<boolean> => {
  const ctx = getContext();

  const opts: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ctx.roomToken,
    },
    body: JSON.stringify({"id": playerId})
  }

  const r = await fetch(getHostUrl() + "/api/v1/game/decide-winner?roomId=" + ctx.roomId, opts);
  return r.ok;
};

export default DecideWinner;
