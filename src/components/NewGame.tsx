import { useState } from "react";
import NameNameForm from "./NameNameForm";
import getHostUrl from "../utils/getHostUrl";

interface Props {
  onSuccess: (gameState: GameState) => void;
  onError: (response: string) => void;
}

const NewGame = ({ onSuccess, onError }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const newGame = async (event: any) => {
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
      const roomResponse = await fetch(getHostUrl() + "/api/v1/room/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.get("roomName") }),
      });
      const roomResponseBody = await roomResponse.json();

      if (roomResponse.ok) {
        gameStateResponse.room = {
          id: roomResponseBody.id,
          token: roomResponseBody.token,
          name: roomResponseBody.name,
          queueId: roomResponseBody.queueId,
        };
      } else {
        onError(JSON.stringify(roomResponse));
      }

      const playerResponse = await fetch(
        getHostUrl() + "/api/v1/room/" + roomResponseBody.id + "/players",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + roomResponseBody.token,
          },
          body: JSON.stringify({ name: formData.get("playerName") }),
        }
      );
      const playerResponseBody = await playerResponse.json();

      if (playerResponse.ok) {
        gameStateResponse.player = playerResponseBody;
      } else {
        onError(JSON.stringify(playerResponse));
      }
    } catch (error) {
      onError("Could not create a new game");
    } finally {
      setIsLoading(false);
    }
    onSuccess(gameStateResponse);
  };

  return (
    <>
      <NameNameForm
        isLoading={isLoading}
        nameFirst="room"
        nameSecond="player"
        button="New game"
        onSubmit={newGame}
      />
    </>
  );
};

export default NewGame;