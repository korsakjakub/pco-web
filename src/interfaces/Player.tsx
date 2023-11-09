import { Action } from "../enums/Action";

interface Player {
  name: string;
  id: string;
  chips: number;
  stakedChips: number;
  token: string;
  actions: Array<Action>;
}

export default Player;
