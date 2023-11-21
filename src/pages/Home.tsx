import { useNavigate } from "react-router-dom";
import NewGame from "../components/NewGame";
import Join from "../components/Join";
import Context from "../interfaces/Context";

interface Props {
  onReturnFromHome: (r: Context) => void;
}

const Home = ({ onReturnFromHome }: Props) => {
  const navigate = useNavigate();

  const handleError = (responseBody: string) => {
    throw new Error(responseBody);
  };

  const handleNewGameSuccess = (context: Context) => {
    onReturnFromHome(context);
    navigate("game/" + context.roomId);
  };

  const handleJoinSuccess = (context: Context) => {
    onReturnFromHome(context);
    navigate("queue/" + context.queueId);
  };

  return (
    <div>
      <h1>pco</h1>
      <div>
        <h2>create a new room</h2>
        <NewGame onError={handleError} onSuccess={handleNewGameSuccess} />
      </div>
      <div>
        <h2>or join an existing room</h2>
        <Join onError={handleError} onSuccess={handleJoinSuccess} />
      </div>
    </div>
  );
};

export default Home;
