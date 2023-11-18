import { useState } from "react";
import getContext from "../utils/getContext";
import AcceptPlayerInQueue from "../requests/AcceptPlayerInQueue";
import Player from "../interfaces/Player";
import { Button, Col, ListGroup, ListGroupItem, Spinner } from "react-bootstrap";

interface Props {
  players: Player[];
  onPlayerModified?: () => void;
}

const QueueList = ({ players, onPlayerModified }: Props) => {
  const ctx = getContext();
  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;
  const [isLoading, setIsLoading] = useState(false);
  const [buttonIndexLoading, setButtonIndexLoading] = useState("");

  const acceptPlayer = async (playerId: string) => {
    try {
      const playerData = await AcceptPlayerInQueue(
        ctx.roomId,
        playerId,
        ctx.roomToken
      );
      if (playerData === null) return;

      onPlayerModified?.();
    } catch (error) {
      return error;
    }
  };

  const handleAddToRoom = (playerId: string) => {
    setIsLoading(true);
    setButtonIndexLoading(playerId);
    acceptPlayer(playerId);
  };

  return (
    <>
      <ListGroup>
        {players.length === 0 && (
          <ListGroupItem>No players in queue</ListGroupItem>
        )}
        {players.map((player) => (
          <ListGroupItem key={player.id}>
              <Col>Name: {player.name}</Col>
              <Col>Id: {player.id}</Col>
            {isAdmin() && (
              <Col>
                <Button variant="outline-success" onClick={() => handleAddToRoom(player.id)}>
                  {isLoading && buttonIndexLoading === player.id && <Spinner />}
                  Add
                </Button>
                <Button variant="outline-danger">Kick out</Button>
              </Col>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </>
  );
};

export default QueueList;
