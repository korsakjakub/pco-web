import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Queue from "./pages/Queue";
import JoinQueue from "./pages/JoinQueue";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./assets/index.css";
import Context from "./interfaces/Context";
import PlayerInTable from "./components/PlayerInTable";
import { Action } from "./enums/Action";

const queryClient = new QueryClient();

const App = () => {
    const env = "local";
    const hostUrl = env === "prod" ? "https://pco.korsak.xyz" : "http://127.0.0.1:8080";
    const frontUrl = env === "prod" ? "https://poker.korsak.xyz" : "http://127.0.0.1:8000";
    window.sessionStorage.setItem("hostUrl", hostUrl);
    window.sessionStorage.setItem("frontUrl", frontUrl);

    const onReturn = (r: Context) => {
        window.sessionStorage.setItem(
            "ctx",
            JSON.stringify({
                playerId: r.playerId,
                playerToken: r.playerToken,
                roomId: r.roomId,
                queueId: r.queueId,
                roomToken: r.roomToken || null,
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
                <Route path={"/test"} element={
                    <PlayerInTable 
                        player={{name: "jk", id: "test", chips: 10, stakedChips: 5, token: "token", actions: [Action.BET]}}
                        active={true}
                        isLoading={false}
                        getCoords={(r: number) => {
                            return {
                                left: 50 + r * Math.sin(Math.PI) + "%",
                                top: 50 + r * Math.cos(Math.PI) + "%",
                            }
                        }}
                        onPickWinner={(playerId: string) => console.log(playerId)}
                    />
                } />
            </Routes>
        </QueryClientProvider>
    );
};

export default App;
