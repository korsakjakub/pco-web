import { Action } from "../enums/Action";
import { PlayerState } from "../enums/PlayerState";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";

interface Player {
  name: string;
  id: string;
  chips: number;
  stakedChips: number;
  token: string;
  actions: Array<Action>;
  state: PlayerState;
  avatar: AvatarOptions;
}

export default Player;
