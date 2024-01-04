import { useState } from 'react';
import Player from '../interfaces/Player';
import KickPlayerFromRoom from '../requests/KickPlayerFromRoom';
import getContext from '../utils/getContext';
import ConfirmationModal from './ConfirmationModal';

type Props = {
  player: Player;
  active: boolean;
  isLoading: boolean;
  onPickWinner: (playerId: string) => void;
  getCoords: (radius: number) => any;
}

const PlayerInTable = ({player, active, isLoading, getCoords, onPickWinner}: Props) => {
  const ctx = getContext();
  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const [isPlayerSettingsVisible, setIsPlayerSettingsVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    open: false,
    id: "confirmation",
    message: "",
    onConfirmed: () => console.log("confirmed")
  });

  const playerFrameCls = (isActive: boolean) => {
    return isActive ? "player-frame frame-active" : "player-frame";
  };

  return (
    <>
      <div key={player.id} onClick={() => setIsPlayerSettingsVisible(!isPlayerSettingsVisible)}>
        <div className={playerFrameCls(active)} style={getCoords(40)}>
          <p className="player-frame-name">{player.name}</p>
          <p aria-busy={isLoading} className="player-frame-chips">${player.chips}</p>
        </div>
        <p aria-busy={isLoading} className="player-chips" style={getCoords(20)}>
          ${player.stakedChips}
        </p>
      </div>
      { isPlayerSettingsVisible && isAdmin() && 
        <div className='player-settings' style={getCoords(20)}>
          <button onClick={() => onPickWinner(player.id)}>Pick winner</button>
          <button onClick={() => setConfirmationData({
            open: true,
            id: "confirm-player-kick",
            message: "Do you really wish to kick " + player.name + "?",
            onConfirmed: () => {
              KickPlayerFromRoom(player.id);
              setConfirmationData({...confirmationData, open: false});
            }
          })}>Kick out</button>
          <button onClick={() => setConfirmationData({
            open: true,
            id: "confirm-player-reset",
            message: "Do you really wish to reset " + player.name + "'s chips?",
            onConfirmed: () => console.log("reset")
          })}>Reset Chips</button>
        </div>
      }
      <ConfirmationModal 
        open={confirmationData.open} 
        id={confirmationData.id} 
        message={confirmationData.message} 
        onCancelled={() => setConfirmationData({...confirmationData, open: false})} 
        onConfirmed={confirmationData.onConfirmed}/>
    </>
  )
}

export default PlayerInTable
