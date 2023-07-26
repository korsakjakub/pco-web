import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import Queue from "./components/Queue";
import { useEffect } from "react";
import getContext from "./utils/getContext";
import JoinQueue from "./components/JoinQueue";

const App = () => {
  const hostUrl : string = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const frontUrl : string =  import.meta.env.VITE_FRONT_URL || "http://localhost:80";
  window.sessionStorage.setItem("hostUrl", hostUrl);
  window.sessionStorage.setItem("frontUrl", frontUrl);

  const onReturn = (r: GameState) => {
    window.sessionStorage.setItem(
      "ctx",
      JSON.stringify({
        playerId: r.player.id,
        playerToken: r.player.token,
        roomId: r.room.id,
        queueId: r.room.queueId,
        roomToken: r.room.token ? r.room.token : null,
      })
    );
  };
  useEffect(() => {
    console.log(getContext())
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onReturnFromHome={onReturn} />} />
        <Route path={"/join/:queueId"} element={<JoinQueue onReturnFromJoin={onReturn} />} />
        <Route path={"/game/:roomId"} element={<Game />} />
        <Route path={"/queue/:queueId"} element={<Queue />} />
      </Routes>
    </>
  );
};

export default App;
