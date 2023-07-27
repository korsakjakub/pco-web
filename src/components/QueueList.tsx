import { useEffect, useRef, useState } from "react";
import GetPlayersInQueue from "../requests/GetPlayersInQueue";
import getContext from "../utils/getContext";
import AcceptPlayerInQueue from "../requests/AcceptPlayerInQueue";
import Player from "../interfaces/Player";
import { Button, Col, ListGroup, ListGroupItem, Row, Spinner } from "react-bootstrap";

interface Props {
  onPlayerModified?: () => void;
  isAdmin: boolean;
}

const QueueList = ({ onPlayerModified, isAdmin }: Props) => {
  const ctx = getContext();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonIndexLoading, setButtonIndexLoading] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const prevPlayersLengthRef = useRef<number>(0);

  const fetchQueue = async () => {
    try {
      const queueData = await GetPlayersInQueue(ctx.queueId);
      if (queueData === null) return;
      if (
        !isAdmin &&
        queueData.length < prevPlayersLengthRef.current &&
        players.filter((player) => player.id === ctx.playerId).length === 0
      ) {
        onPlayerModified?.();
      }

      setPlayers(queueData);
      prevPlayersLengthRef.current = queueData.length;
    } catch (error) {
      throw new Error("could not fetch queue: " + JSON.stringify(error));
    }
  };

  const acceptPlayer = async (playerId: string) => {
    try {
      const playerData = await AcceptPlayerInQueue(
        ctx.roomId,
        playerId,
        ctx.roomToken
      );
      if (playerData === null) return;
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setButtonIndexLoading("");
  }, [players]);

  useEffect(() => {
    fetchQueue();
    const intervalId = setInterval(fetchQueue, 2000);

    return () => clearInterval(intervalId);
  }, []);

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
            <Row>
              <Col>Name: {player.name}</Col>
              <Col>Id: {player.id}</Col>
            {isAdmin && (
              <Col>
                <Button variant="outline-success" onClick={() => handleAddToRoom(player.id)}>
                  {isLoading && buttonIndexLoading === player.id && <Spinner />}
                  Add
                </Button>
                <Button variant="outline-danger">Kick out</Button>
              </Col>
            )}
            </Row>
          </ListGroupItem>
        ))}
      </ListGroup>
    </>
  );
};

export default QueueList;
