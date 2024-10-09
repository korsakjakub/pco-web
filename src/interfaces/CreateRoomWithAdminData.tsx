import { GameMode } from "../enums/GameMode";

interface CreateRoomWithAdminData {
  playerName: string;
  gameMode: GameMode;
  startingChips: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
}

export default CreateRoomWithAdminData;
