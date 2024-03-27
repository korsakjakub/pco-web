import { Action } from "../enums/Action";
import { PlayerState } from "../enums/PlayerState";

interface Player {
  name: string;
  id: string;
  chips: number;
  stakedChips: number;
  token: string;
  actions: Array<Action>;
  state: PlayerState;
}

export default Player;
