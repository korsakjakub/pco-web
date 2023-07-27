import { useState, useEffect } from "react";
import ShareUrlAlert from "../components/ShareUrlAlert";
import { useParams } from "react-router-dom";
import GetPlayer from "../requests/GetPlayer";
import getContext from "../utils/getContext";
import getHostUrl from "../utils/getHostUrl";
import QueueList from "../components/QueueList";
import PlayersList from "../components/PlayersList";
import getFrontUrl from "../utils/getFrontUrl";
import Player from "../interfaces/Player";
import { Col, Container, Row } from "react-bootstrap";

const Game = () => {
  const [player, setPlayer] = useState<Player>({
    chips: 0,
    id: "",
    name: "",
    stakedChips: 0,
    token: "",
  });

  const ctx = getContext();

  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const onError = () => {
    return <h1>Error</h1>;
  };

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const playerData = await GetPlayer(
          getHostUrl(),
          ctx.roomId,
          ctx.playerId,
          ctx.playerToken
        );
        if (playerData === null) return;
        setPlayer(playerData);
      } catch (error) {
        return onError();
      }
    };
    fetchPlayer();
  });

  const { roomId } = useParams();

  return (
    <Container>
      <Row>
        <h1>Room {roomId}</h1>
        <p>Game State: {JSON.stringify(player)}</p>
        <p>Context: {JSON.stringify(ctx)}</p>
        <p>{JSON.stringify({ isAdmin: isAdmin() })}</p>
      </Row>
      <Row>
        <Col md>
          <Row>
            <PlayersList roomId={ctx.roomId} />
          </Row>
          <Row>
            <QueueList isAdmin={isAdmin()} />
          </Row>
          <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
        </Col>
        <Col md>
          <h1>Game State</h1>
        </Col>
      </Row>
    </Container>
  );
};

export default Game;
