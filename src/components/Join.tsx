import { useState } from "react";
import GetRoomIdInQueue from "../requests/GetRoomIdInQueue";
import CreatePlayer from "../requests/CreatePlayer";
import TwoInputForm from "./TwoInputForm";
import Context from "../interfaces/Context";

interface Props {
  onSuccess: (response: Context) => void;
  onError: (response: string) => void;
}

const Join = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const joinGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const queueIdData = formData.get("queueId");
      const queueId = queueIdData !== null ? queueIdData.toString() : "";
      const playerNameData = formData.get("playerName");
      const playerName =
        playerNameData !== null ? playerNameData.toString() : "";

      const player = await CreatePlayer(queueId, playerName);
      const roomId = await GetRoomIdInQueue(queueId);

      onSuccess({
        playerId: player.id,
        playerToken: player.token,
        queueId: queueId,
        roomId: roomId,
        roomName: '',
        roomToken: '',
      } as Context);
    } catch (error) {
      onError("Could not join the queue" + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TwoInputForm
        first={{ value: "queueId", hint: "queue id", isId: true }}
        second={{ value: "playerName", hint: "player name", isId: false }}
        button={"Join"}
        isLoading={isLoading}
        onSubmit={joinGame}
      />
    </>
  );
};

export default Join;
