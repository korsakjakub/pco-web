import Spinner from "./Spinner";

interface Props {
  nameFirst: string;
  nameSecond: string;
  button: string;
  isLoading: boolean;
  onSubmit: (event: any) => void;
}

function NameNameForm({ nameFirst, nameSecond, button, isLoading, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        name={nameFirst + "Name"}
        placeholder={nameFirst + " name"}
        aria-label={nameFirst + " name"}
        aria-describedby={"new-" + nameFirst + "-button"}
      />
      <input
        type="text"
        className="form-control"
        name={nameSecond + "Name"}
        placeholder={nameSecond + " name"}
        aria-label={nameSecond + " name"}
        aria-describedby={"new-" + nameSecond + "-button"}
      />
      <button
        className="btn btn-outline-secondary"
        type="submit"
        id={"new-" + nameFirst + "-button"}
      >
        {isLoading && <Spinner />}
        {button}
      </button>
    </form>
  );
}

export default NameNameForm;
