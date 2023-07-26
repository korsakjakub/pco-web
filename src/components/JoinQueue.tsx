import { useState } from "react";
import NameForm from "./NameForm";
import CreatePlayer from "../requests/CreatePlayer";
import GetRoomIdInQueue from "../requests/GetRoomIdInQueue";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
  onReturnFromJoin: (r: GameState) => void;
}

function JoinQueue({ onReturnFromJoin }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { queueId } = useParams();

  const qId = queueId ?? '';

  const joinGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    let gameStateResponse: GameState = {
      player: {
        chips: 0,
        id: "",
        name: "",
        stakedChips: 0,
        token: "",
      },
      room: {
        id: "",
        name: "",
        queueId: "",
        token: "",
      },
    };
    const formData = new FormData(event.target);

    try {
      const playerNameData = formData.get("playerName");
      const playerName =
        playerNameData !== null ? playerNameData.toString() : "";

      const player = await CreatePlayer(qId, playerName);
      const roomId = await GetRoomIdInQueue(qId);

      console.log(player)
      console.log(roomId)
      gameStateResponse.player = player;
      gameStateResponse.room = {
        queueId: qId,
        id: roomId,
        name: "",
        token: "",
      };
    } catch (error) {
        throw new Error(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
    onReturnFromJoin(gameStateResponse);
    navigate("/queue/" + qId);
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
