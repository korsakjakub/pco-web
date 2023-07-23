import { useNavigate } from "react-router-dom";
import NewGame from "./NewGame";

interface Props {
  hostUrl: string;
  onReturnFromHome: (r: GameState) => void;
}

const Home = ({ hostUrl, onReturnFromHome }: Props) => {
  const navigate = useNavigate();

  const handleError = (responseBody: string) => {
    throw new Error(responseBody);
  };

  const handleSuccess = (gameState: GameState) => {
    onReturnFromHome(gameState);
    navigate("game/" + gameState.room.id);
  };

  return (
    <>
      <h1>pco</h1>
      <h2>create a new room</h2>
      <NewGame
        hostUrl={hostUrl}
        onError={handleError}
        onSuccess={handleSuccess}
      />
      {/*
      <h2>or join an existing room</h2>
      <NewPlayer
        url={hostUrl + '/api/v1/player/create'}
        onError={handleError}
        onSuccess={handleSuccess}
        />
  */}
    </>
  );
};

export default Home;
