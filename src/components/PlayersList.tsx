import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

interface Props {
  roomId: string;
}

const PlayersList = ({ roomId }: Props) => {
  const { data: players, isLoading } = useQuery({
    queryFn: () => GetPlayersInRoom(roomId),
    queryKey: ["players"],
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      <ListGroup>
        {players?.length === 0 && (
          <ListGroupItem>No players in room</ListGroupItem>
        )}
        {players?.length  + " / 9"}
        {players?.map((player) => (
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
