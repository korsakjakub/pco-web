import { useNavigate } from "react-router-dom";
import NewGame from "./NewGame";
import RoomCreateResponse from "./RoomCreateResponse";

interface Props {
  onCreateNewRoom: (r: RoomCreateResponse) => void;
}

const Home = ({ onCreateNewRoom }: Props) => {
  const navigate = useNavigate();

  function handleError(responseBody: string): void {
    throw new Error(responseBody);
  }

  function handleSuccess(responseBody: string): void {
    const data = JSON.parse(responseBody);
    onCreateNewRoom({
      token: data.token,
      queueId: data.queueId,
      id: data.id,
      name: data.name,
    });
    navigate("game");
  }

  return (
    <>
      <h1>pco</h1>
      <h2>create a new room</h2>
      <NewGame
        url="http://localhost:8080/api/v1/room/create"
        onError={handleError}
        onSuccess={handleSuccess}
      />
      <h2>or join an existing room</h2>
    </>
  );
};

export default Home;
