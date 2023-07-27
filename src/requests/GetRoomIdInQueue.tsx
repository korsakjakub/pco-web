import getHostUrl from "../utils/getHostUrl";

const GetRoomIdInQueue = async (queueId: string): Promise<string> => {
  const r = await fetch(
    getHostUrl() + "/api/v1/queue/" + queueId + "/roomid",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!r.ok) {
    throw new Error("could not fetch roomId with queueId: " + queueId);
  }
  const rb = await r.json();
  return rb.id as string;
};

export default GetRoomIdInQueue;
