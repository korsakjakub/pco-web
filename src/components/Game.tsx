import { useState, useEffect } from "react";
import ShareUrlAlert from "./ShareUrlAlert";
import { useParams } from "react-router-dom";
import GetPlayer from "../requests/GetPlayer";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";
import QueueList from "./QueueList";
import PlayersList from "./PlayersList";
import getFrontUrl from "../utils/getFrontUrl";

const Game = () => {
  const [player, setPlayer] = useState<Player>({
    chips: 0,
    id: "",
    name: "",
    stakedChips: 0,
    token: "",
  });

  const ctx = getContext();

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const onError = () => {
    return <h1>Error</h1>;
  };

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerData = await GetPlayer(
          getHostUrl(),
          ctx.roomId,
          ctx.playerId,
          ctx.playerToken
        );
        if (playerData === null) return;
        setPlayer(playerData);
      } catch (error) {
        return onError();
      }
    };
    fetchPlayer();
  });

  const { roomId } = useParams();

  return (
    <>
      <h1>Room {roomId}</h1>
      <p>Game State: {JSON.stringify(player)}</p>
      <p>Context: {JSON.stringify(ctx)}</p>
      <PlayersList roomId={ctx.roomId} />
      <p>{JSON.stringify({isAdmin: isAdmin()})}</p>
      <QueueList isAdmin={isAdmin()}/>
      <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
    </>
  );
};

export default Game;