import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";
import Join from "./components/Join";
import Queue from "./components/Queue";

const App = () => {
  // const hostUrl = "http://20.66.216.167";
  const hostUrl = "http://localhost:8080";
  window.sessionStorage.setItem("hostUrl", hostUrl);

  const onReturn = (r: GameState) => {
    window.sessionStorage.setItem(
      "ctx",
      JSON.stringify({
        playerId: r.player.id,
        playerToken: r.player.token,
        roomId: r.room.id,
        roomName: r.room.name,
        roomToken: r.room.token ? r.room.token : null,
        queueId: r.room.queueId ? r.room.queueId : null,
      })
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onReturnFromHome={onReturn} />} />
        {/* 
        <Route
          path="/join"
          element={<Join onReturnFromJoin={onReturn} />}
        />
        */}
        <Route path={"/game/:roomId"} element={<Game />} />
        <Route path={"/queue/:queueId"} element={<Queue />} />
      </Routes>
    </>
  );
};

export default App;
