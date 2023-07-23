import Spinner from "./Spinner";

interface Props {
  name: string;
  isLoading: boolean;
  onSubmit: (event: any) => void;
}

function NameForm({ name, isLoading, onSubmit }: Props) {
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
        New {name}
      </button>
    </form>
  );
}

export default NameForm;
