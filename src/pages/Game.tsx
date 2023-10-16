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
import PlayingTable from "../components/PlayingTable";

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
    console.log("fetching player")
  }, []);

  const { roomId } = useParams();

  const players: Player[] = [
    {name: "Jakub", chips: 1000, id: "1", stakedChips: 100, token: "token"},
    {name: "Ola", chips: 3890, id: "2", stakedChips: 50, token: "token"},
    {name: "Eleonorka", chips: 1200, id: "3", stakedChips: 0, token: "token"},
    {name: "Ryszard", chips: 1200, id: "4", stakedChips: 0, token: "token"},
    {name: "Franek", chips: 50, id: "5", stakedChips: 0, token: "token"},
  ]

  return (
    <Container>
      {/* <Row>
        <h1>Room {roomId}</h1>
        <p>Game State: {JSON.stringify(player)}</p>
        <p>Context: {JSON.stringify(ctx)}</p>
        <p>{JSON.stringify({ isAdmin: isAdmin() })}</p>
      </Row> */}
        <Col>
          <Row>
            <PlayersList roomId={ctx.roomId} />
          </Row>
          <Row>
            <QueueList isAdmin={isAdmin()} />
          </Row>
          <ShareUrlAlert url={getFrontUrl()} queueId={ctx.queueId} />
        </Col>
        <Col>
          <PlayingTable players={players} />
        </Col>
    </Container>
  );
};

export default Game;
