import Player from "./Player";
import Room from "./Room";

interface GameState {
  player: Player;
  room: Room;
}

export default GameState;