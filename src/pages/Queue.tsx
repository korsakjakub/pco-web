import QueueList from "../components/QueueList";
import getContext from "../utils/getContext";
import { useNavigate } from "react-router-dom";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { Container, Row } from "react-bootstrap";
import GetPlayersInQueue from "../requests/GetPlayersInQueue";
import { useQuery } from "@tanstack/react-query";

const Queue = () => {
  const ctx = getContext();
  const navigate = useNavigate();

  const { data: playersInQueue } = useQuery({
    queryFn: () => GetPlayersInQueue(),
    queryKey: ["playersInQueue"],
    refetchInterval: 2000,
    onSuccess: (data) => {
      const removedFromQueue = data.filter(player => player.id === ctx.playerId).length === 0;
      if (removedFromQueue) {
        navigate("/404");
      }
    },

  });

  useQuery({
    queryFn: () => GetPlayersInRoom(ctx.roomId),
    queryKey: ["playersInRoom"],
    refetchInterval: 2000,
    onSuccess: (data) => {
      const addedToRoom = data.filter(player => player.id === ctx.playerId).length > 0;
      if (addedToRoom) {
        navigate("/game/" + ctx.roomId);
      }
    },
  });

  return (
    <Container>
      <Row>
        <h1>You are waiting in the queue {ctx.queueId}</h1>
      </Row>
      <Row>
        <QueueList players={playersInQueue || []}/>
      </Row>
    </Container>
  );
}

export default Queue;
