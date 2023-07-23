import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Game from "./components/Game";

const App = () => {
  // const hostUrl = "http://20.66.216.167";
  const hostUrl = "http://localhost:8080";
  window.sessionStorage.setItem('hostUrl', hostUrl);

  const onReturnFromHome = (r: GameState) => {
    window.sessionStorage.setItem('ctx', JSON.stringify({
      playerId: r.player.id,
      playerToken: r.player.token,
      roomId: r.room.id,
      roomName: r.room.name,
      roomToken: r.room.token ? r.room.token: null,
      queueId: r.room.queueId ? r.room.queueId: null,
    }));
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<Home hostUrl={hostUrl} onReturnFromHome={onReturnFromHome} />}
        />
        {/*<Route
          path="/join"
          element={<Join hostUrl={hostUrl} onCreateNewPlayer={onCreateNewGame} />}
  />*/}
        <Route path={"/game/:roomId"} element={<Game/>} />
      </Routes>
    </>
  );
};

export default App;
