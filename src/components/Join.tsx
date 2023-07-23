import { useState } from "react";
import NameNameForm from "./NameNameForm";
import getHostUrl from "../utils/getHostUrl";

interface Props {
  onSuccess: (gameState: GameState) => void;
  onError: (response: string) => void;
}

const Join = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const joinGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    var gameStateResponse: GameState = {
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
      const queueIdData = formData.get("queueName");
      const queueId = queueIdData !== null ? queueIdData.toString() : "";

      const playerResponse = await fetch(
        getHostUrl() + "/api/v1/player/create?queueId=" + queueId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: formData.get("playerName") }),
        }
      );
      const playerResponseBody = await playerResponse.json();

      if (playerResponse.ok) {
        gameStateResponse.player = playerResponseBody;
        gameStateResponse.room = {
          queueId: queueId,
          id: "",
          name: "",
          token: "",
        };
      } else {
        onError(JSON.stringify(playerResponse));
      }
    } catch (error) {
      onError && onError("Could not join the queue" + error);
    } finally {
      setIsLoading(false);
    }
    onSuccess(gameStateResponse);
  };

  return (
    <>
      <NameNameForm
        nameFirst={"queue"}
        nameSecond={"player"}
        button={"Join"}
        isLoading={isLoading}
        onSubmit={joinGame}
      />
    </>
  );
};

export default Join;
