import QueueList from "./QueueList";
import getContext from "../utils/getContext";

function Queue() {
  const ctx = getContext();
  return (
    <>
      <div>Queue</div>
      <QueueList isAdmin={false} queueId={ctx.queueId} />
    </>
  );
}

export default Queue;
