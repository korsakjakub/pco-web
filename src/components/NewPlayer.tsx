import NewWithName from "./NewWithName";

interface Props {
  url: string;
  onSuccess: (responseBody: string) => void;
  onError: (responseBody: string) => void;
}

const NewPlayer = ({ url, onSuccess, onError }: Props) => {
  return (
    <>
      <NewWithName
        objName="player"
        reqName="playerName"
        url={url}
        onSuccess={onSuccess}
        onError={onError}
      />
    </>
  );
};

export default NewPlayer;
