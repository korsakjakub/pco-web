interface Context {
  playerId: string;
  playerToken: string;
  roomId: string;
  roomName: string;
  roomToken: string | null;
  queueId: string | null;
  env: string | null;
}

export default Context;
