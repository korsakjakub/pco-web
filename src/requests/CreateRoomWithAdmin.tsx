import getHostUrl from "../utils/getHostUrl";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";

const CreateRoomWithAdmin = async (
  playerName: string,
  avatar: AvatarOptions,
) => {
  const roomResponse = await fetch(getHostUrl() + "/api/v1/room/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const roomResponseBody = await roomResponse.json();

  if (!roomResponse.ok) {
    throw Error("Could not create a room");
  }

  const playerResponse = await fetch(
    getHostUrl() + "/api/v1/room/" + roomResponseBody.id + "/players",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + roomResponseBody.token,
      },
      body: JSON.stringify({
        name: playerName,
        avatar: avatar,
      }),
    },
  );
  const playerResponseBody = await playerResponse.json();

  if (!playerResponse.ok) {
    throw Error(JSON.stringify(playerResponse));
  }

  return [
    playerResponseBody.id,
    playerResponseBody.token,
    roomResponseBody.queueId,
    roomResponseBody.id,
    roomResponseBody.token,
  ];
};

export default CreateRoomWithAdmin;
