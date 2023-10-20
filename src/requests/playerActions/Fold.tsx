import getHostUrl from "../../utils/getHostUrl";

const Fold = async (roomId: string, playerId: string, playerToken: string) => {
//   const r = await fetch(
//     getHostUrl() + "/api/v1/game/fold?roomId=" + roomId,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + playerToken,
//       },
//         body: JSON.stringify({ id: playerId }),
//     }
//   );
//   if (!r.ok) {
//     throw new Error("could not fold for player: " + playerId);
//   }
console.log("MOCK FOLD!!!");
};

export default Fold;
