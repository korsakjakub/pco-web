import { useState } from "react";
import NameForm from "../components/NameForm";
import CreatePlayer from "../requests/CreatePlayer";
import GetRoomIdInQueue from "../requests/GetRoomIdInQueue";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../interfaces/Context";

interface Props {
  onReturnFromJoin: (r: Context) => void;
}

const JoinQueue = ({ onReturnFromJoin }: Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { queueId } = useParams();

  const joinGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const playerNameData = formData.get("playerName");
      const playerName =
        playerNameData !== null ? playerNameData.toString() : "";

      const player = await CreatePlayer(queueId || '', playerName);
      const roomId = await GetRoomIdInQueue(queueId || '');

      onReturnFromJoin({
        playerId: player.id,
        playerToken: player.token,
        queueId: queueId,
        roomId: roomId,
        roomName: "",
        roomToken: "",
      } as Context);
      navigate("/queue/" + queueId);
    } catch (error) {
      throw new Error(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <h1>pco</h1>
      <h1>Join Room</h1>
      <NameForm
        button="Join"
        isLoading={isLoading}
        name={"player"}
        onSubmit={joinGame}
      />
    </>
  );
}

export default JoinQueue;
