import { useState } from "react";
import ShareUrlAlert from "./ShareUrlAlert";

interface Props {
  name: string;
}

const Room = ({ name }: Props) => {
  const [showAlert, setShowAlert] = useState(false);

  const onShareClick = () => {
    setShowAlert(true);
    navigator.clipboard.writeText(name)
  }

  return (
    <>
      {showAlert && (
        <ShareUrlAlert url='dupa'/>
      )}
      <h1>Room</h1>
      <button type="button" className="btn btn-primary" onClick={onShareClick}>Share</button>
      <p>Name: {name}</p>
    </>
  );
};

export default Room;
