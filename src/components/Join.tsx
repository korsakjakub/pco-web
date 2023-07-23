import { useNavigate } from "react-router-dom";
import PlayerCreateResponse from "../interfaces/PlayerCreateResponse";
import NewPlayer from "./NewPlayer";

interface Props {
  hostUrl: string;
  onCreateNewPlayer: (r: PlayerCreateResponse) => void;
}

const Join = ({ hostUrl, onCreateNewPlayer }: Props) => {
  const navigate = useNavigate();

  const handleError = (responseBody: string) => {
    throw new Error(responseBody);
  };

  const handleSuccess = (responseBody: string) => {
    const data = JSON.parse(responseBody);
    onCreateNewPlayer({
      name: data.name,
      chips: 0,
      id: "",
      stakedChips: 0,
      token: "",
    });
    navigate("game");
  };

  return (
    <>
      <h1>Join</h1>
      <NewPlayer
        url={hostUrl + "api/v1/player/create"}
        onError={handleError}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Join;
