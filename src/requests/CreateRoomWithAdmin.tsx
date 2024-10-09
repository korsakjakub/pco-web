import CreateRoomWithAdminData from "../interfaces/CreateRoomWithAdminData";
import Rules from "../interfaces/Rules";
import getHostUrl from "../utils/getHostUrl";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";
import SetRules from "./SetRules";

const CreateRoomWithAdmin = async (
  data: CreateRoomWithAdminData,
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
        name: data.playerName,
        avatar: avatar,
      }),
    },
  );
  const playerResponseBody = await playerResponse.json();

  if (!playerResponse.ok) {
    throw Error(JSON.stringify(playerResponse));
  }

  await SetRules(
    {
      startingChips: data.startingChips,
      ante: data.ante,
      smallBlind: data.smallBlind,
      bigBlind: data.bigBlind,
      gameMode: data.gameMode,
    } as Rules,
    roomResponseBody.id,
    roomResponseBody.token,
  ).catch((error) => {
    throw Error(JSON.stringify(error));
  });

  return [
    playerResponseBody.id,
    playerResponseBody.token,
    roomResponseBody.queueId,
    roomResponseBody.id,
    roomResponseBody.token,
  ];
};

export default CreateRoomWithAdmin;
