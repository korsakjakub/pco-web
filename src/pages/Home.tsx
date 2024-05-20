import { useNavigate } from "react-router-dom";
import NewGame from "../components/NewGame";
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

  return (
    <main className="container" >
      <header>
        <h1>jetons</h1>
      </header>
      <div className="game">
        <h2>create a new room</h2>
        <NewGame onError={handleError} onSuccess={handleNewGameSuccess} />
      </div>
      <footer>
        <nav>
          <ul>
            <li><a href="/terms-of-service">Terms of Service</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/assets">Assets</a></li>
          </ul>
        </nav>
      </footer>
    </main>
  );
};

export default Home;
