import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import Player from "../interfaces/Player";

interface Props {
  players: Player[];
}

const PlayersList = ({ players }: Props) => {

  return (
    <>
      <ListGroup>
        {players.length === 0 && (
          <ListGroupItem>No players in room</ListGroupItem>
        )}
        {players.length  + " / 9"}
        {players.map((player) => (
          <ListGroupItem key={player.id}>
            <Container>
              <Row>
                <Col>Name: {player.name}</Col>
                <Col>Id: {player.id}</Col>
              </Row>
            </Container>
          </ListGroupItem>
        ))}
      </ListGroup>
    </>
  );
};

export default PlayersList;
