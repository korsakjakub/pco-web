import QueueList from "../components/QueueList";
import getContext from "../utils/getContext";
import { useNavigate } from "react-router-dom";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";

const Queue = () => {
  const ctx = getContext();
  const navigate = useNavigate();

  const onPlayerModified = async () => {
    try {
      const playersData = await GetPlayersInRoom(ctx.roomId);
      if (playersData === null) {
        console.log("players data is null")
      }
      const addedToRoom = playersData.filter(player => player.id === ctx.playerId).length > 0;
      if (addedToRoom ) {
        navigate("/game/" + ctx.roomId);
      } else {
        navigate("/404");
      }
    } catch (error) {
      return error;
    }
  };

  return (
    <>
      <QueueList onPlayerModified={onPlayerModified} isAdmin={false}/>
    </>
  );
}

export default Queue;
