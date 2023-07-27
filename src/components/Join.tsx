import { useState } from "react";
import GetRoomIdInQueue from "../requests/GetRoomIdInQueue";
import CreatePlayer from "../requests/CreatePlayer";
import GameState from "../interfaces/GameState";
import TwoInputForm from "./TwoInputForm";

interface Props {
  onSuccess: (gameState: GameState) => void;
  onError: (response: string) => void;
}

const Join = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

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
      const queueIdData = formData.get("queueId");
      const queueId = queueIdData !== null ? queueIdData.toString() : "";
      const playerNameData = formData.get("playerName");
      const playerName =
        playerNameData !== null ? playerNameData.toString() : "";

      const player = await CreatePlayer(queueId, playerName);
      const roomId = await GetRoomIdInQueue(queueId);

      gameStateResponse.player = player;
      gameStateResponse.room = {
        queueId: queueId,
        id: roomId,
        name: "",
        token: "",
      };
    } catch (error) {
      onError("Could not join the queue" + error);
    } finally {
      setIsLoading(false);
    }
    onSuccess(gameStateResponse);
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
