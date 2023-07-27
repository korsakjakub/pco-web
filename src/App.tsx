import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Queue from "./pages/Queue";
import { useEffect } from "react";
import getContext from "./utils/getContext";
import JoinQueue from "./pages/JoinQueue";
import GameState from "./interfaces/GameState";

const App = () => {
  const hostUrl : string = import.meta.env.VITE_API_URL || "VITE_API_URL";
  const frontUrl : string =  import.meta.env.VITE_FRONT_URL || "VITE_FRONT_URL";
  window.sessionStorage.setItem("hostUrl", hostUrl);
  window.sessionStorage.setItem("frontUrl", frontUrl);
  console.log(hostUrl)
  console.log(frontUrl)

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
