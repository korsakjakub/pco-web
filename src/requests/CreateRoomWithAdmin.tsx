import CreateRoomWithAdminData from "../interfaces/CreateRoomWithAdminData";
import Rules from "../interfaces/Rules";
import getHostUrl from "../utils/getHostUrl";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";
import ResetChips from "./ResetChips";
import SetRules from "./SetRules";

const CreateRoomWithAdmin = async (
  data: CreateRoomWithAdminData,
  avatar: AvatarOptions,
) => {
  const hostUrl = getHostUrl();
  console.log('Creating room with host URL:', hostUrl);
  
  const roomResponse = await fetch(hostUrl + "/api/v1/room/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  
  if (!roomResponse.ok) {
    const errorText = await roomResponse.text();
    console.error('Room creation failed:', roomResponse.status, errorText);
    throw new Error(`Could not create a room: ${roomResponse.status} ${errorText}`);
  }

  const roomResponseBody = await roomResponse.json();

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
    throw Error("Error while setting rules: " + JSON.stringify(error));
  });

  await ResetChips(
    playerResponseBody.id,
    data.startingChips,
    roomResponseBody.id,
    roomResponseBody.token,
  ).catch((error) => {
    throw Error("Error while resetting chips: " + JSON.stringify(error));
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
