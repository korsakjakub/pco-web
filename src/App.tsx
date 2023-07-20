import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Room from "./components/Room";
import RoomCreateResponse from "./components/RoomCreateResponse";
import { useState } from "react";

const App = () => {
  const [roomState, setRoomState] = useState<RoomCreateResponse>({
    token: "",
    name: "",
    id: "",
    queueId: "",
  });

  const onCreateNewRoom = (r: RoomCreateResponse) => {
    setRoomState(r);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home onCreateNewRoom={onCreateNewRoom} />} />
        <Route path="/game" element={<Room name={roomState.name} />} />
      </Routes>
    </>
  );
};
//<NewGame url="http://20.67.214.167/api/v1/room/create" onError={handleError} onSuccess={handleSuccess} />

export default App;
