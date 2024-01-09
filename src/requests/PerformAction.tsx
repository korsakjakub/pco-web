import { Action } from '../enums/Action';
import getContext from '../utils/getContext';
import getHostUrl from '../utils/getHostUrl';

const PerformAction = async (action: Action, chips?: number): Promise<boolean> => {
  const ctx = getContext();

  const opts: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ctx.playerToken,
    },
  }

  if (chips !== undefined) {
    opts.body = JSON.stringify({ chips: chips });
  }

  const r = await fetch(getHostUrl() + "/api/v1/game/" + action.toLowerCase() + "?roomId=" + ctx.roomId, opts);
  return r.ok;
};

export default PerformAction;
