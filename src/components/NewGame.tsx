
interface Props {
  url: string;
  onSuccess: (responseBody: string) => void;
  onError: (responseBody: string) => void;
}

function NewGame({ url, onSuccess, onError }: Props) {
  const requestNewRoom = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: formData.get("roomName") }),
      };
      const response = await fetch(url, requestOptions);
      const responseBody = await response.json();

      if (response.ok) {
        onSuccess(JSON.stringify(responseBody));
      } else {
        onError(responseBody);
      }
    } catch (error) {
      onError && onError("Could not create a new room.");
    } finally {
    }
  };

  return (
    <form onSubmit={requestNewRoom} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        name="roomName"
        placeholder="Room name"
        aria-label="Room name"
        aria-describedby="new-room-button"
      />
      <button
        className="btn btn-outline-secondary"
        type="submit"
        id="new-room-button"
      >
        Open new room
      </button>
    </form>
  );
}

export default NewGame;
