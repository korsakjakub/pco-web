import QueueList from "../components/QueueList";
import getContext from "../utils/getContext";
import { useNavigate } from "react-router-dom";
import GetPlayersInRoom from "../requests/GetPlayersInRoom";
import { Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";

const Queue = () => {
  const [catFact, setCatFact] = useState("");
  const ctx = getContext();
  const navigate = useNavigate();

  const onPlayerModified = async () => {
    try {
      const playersData = await GetPlayersInRoom(ctx.roomId);
      if (playersData === null) {
        throw new Error("players data is null")
      }
      const addedToRoom = playersData.filter(player => player.id === ctx.playerId).length > 0;
      if (addedToRoom ) {
        navigate("/game/" + ctx.roomId);
      } else {
        navigate("/404");
      }
    } catch (error) {
      throw new Error("idk what to do c: " + JSON.stringify(error))
    }
  };

  const getCatFact = async () => {
    // "https://catfact.ninja/fact"
    const r = await fetch(
      "https://catfact.ninja/fact", {
        method: "GET",
      }
    );
    if (!r.ok) {
      throw new Error("could not fetch cat fact." + JSON.stringify(r));
    }
    const rb = await r.json();
    setCatFact(rb.fact);
  }

  useEffect(() => {
    getCatFact();
  }, []);

  return (
    <Container>
      <Row>
        <h1>You are waiting in the queue {ctx.queueId}</h1>
      </Row>
      <Row>
        <p>Here's a random cat fact: {catFact ? catFact : <Spinner/>}</p>
      </Row>
      <Row>
        <QueueList onPlayerModified={onPlayerModified} isAdmin={false}/>
      </Row>
      <p>thanks, catfact.ninja❤</p>
    </Container>
  );
}

export default Queue;
