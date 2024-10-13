import { useState } from "react";
import NameForm from "../components/NameForm";
import CreatePlayer from "../requests/CreatePlayer";
import GetRoomIdInQueue from "../requests/GetRoomIdInQueue";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../interfaces/Context";
import getRandomAvatarOptions, {
  AvatarOptions,
} from "../utils/getRandomAvatarOptions";
import CreateAvatar from "../components/CreateAvatar";

interface Props {
  onReturnFromJoin: (r: Context) => void;
}

const JoinQueue = ({ onReturnFromJoin }: Props) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { queueId } = useParams();
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);

  const joinGame = async (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const playerNameData = formData.get("playerName");
      if (playerNameData === null) {
        throw new Error("playerName is null");
      }
      const playerName = playerNameData.toString();

      if (queueId === undefined) {
        throw new Error("queueId is undefined");
      }

      const player = await CreatePlayer(queueId, playerName, avatar);
      const roomId = await GetRoomIdInQueue(queueId);

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
      alert("Could not join game: " + error);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Join Room</h1>
      </header>
      <CreateAvatar onAvatarChanged={setAvatar} />
      <NameForm
        button="Join"
        isLoading={isLoading}
        name={"player"}
        onSubmit={joinGame}
      />
    </main>
  );
};

export default JoinQueue;
