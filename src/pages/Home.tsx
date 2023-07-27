import { useNavigate } from "react-router-dom";
import NewGame from "../components/NewGame";
import Join from "../components/Join";
import GameState from "../interfaces/GameState";
import { Col, Container, Row } from "react-bootstrap";

interface Props {
  onReturnFromHome: (r: GameState) => void;
}

const Home = ({ onReturnFromHome }: Props) => {
  const navigate = useNavigate();

  const handleError = (responseBody: string) => {
    throw new Error(responseBody);
  };

  const handleNewGameSuccess = (gameState: GameState) => {
    onReturnFromHome(gameState);
    navigate("game/" + gameState.room.id);
  };

  const handleJoinSuccess = (gameState: GameState) => {
    onReturnFromHome(gameState);
    navigate("queue/" + gameState.room.queueId);
  };

  return (
    <Container>
      <h1>pco</h1>
      <Row>
        <Col md>
          <h2>create a new room</h2>
          <NewGame onError={handleError} onSuccess={handleNewGameSuccess} />
        </Col>
        <Col md>
          <h2>or join an existing room</h2>
          <Join onError={handleError} onSuccess={handleJoinSuccess} />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
