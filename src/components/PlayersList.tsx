import { useEffect, useState } from "react";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import Player from "../interfaces/Player";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";

interface Props {
  roomId: string;
}

const PlayersList = ({ roomId }: Props) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const fetchPlayers = async () => {
    try {
      const playersData = await GetPlayersInRoom(roomId);
      if (playersData === null) return;
      setPlayers(playersData);
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    fetchPlayers();
    const intervalId = setInterval(fetchPlayers, 2000);

    return () => clearInterval(intervalId);
  }, []);

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
