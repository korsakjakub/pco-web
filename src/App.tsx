import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Queue from "./pages/Queue";
import JoinQueue from "./pages/JoinQueue";
import GameState from "./interfaces/GameState";
import Config from "../config/config.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./assets/index.css";

const queryClient = new QueryClient();

const App = () => {
  const hostUrl : string = Config.API_URL !== "$API_URL" ? Config.API_URL : "http://localhost:8080";
  const frontUrl : string =  Config.FRONT_URL !== "$FRONT_URL" ? Config.FRONT_URL : "http://localhost";
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

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Home onReturnFromHome={onReturn} />} />
        <Route path={"/join/:queueId"} element={<JoinQueue onReturnFromJoin={onReturn} />} />
        <Route path={"/game/:roomId"} element={<Game />} />
        <Route path={"/queue/:queueId"} element={<Queue />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
