import Spinner from "./Spinner";

interface Props {
  name: string;
  button: string;
  isLoading: boolean;
  onSubmit: (event: any) => void;
}

function NameNameForm({ name, button, isLoading, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        name={name + "Name"}
        placeholder={name + " name"}
        aria-label={name + " name"}
        aria-describedby={"new-" + name + "-button"}
      />
      <button
        className="btn btn-outline-secondary"
        type="submit"
        id={"new-" + name + "-button"}
      >
        {isLoading && <Spinner />}
        {button}
      </button>
    </form>
  );
}

export default NameNameForm;
