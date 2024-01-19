import { useRef, useState } from 'react';
import Player from '../interfaces/Player';
import KickPlayerFromRoom from '../requests/KickPlayerFromRoom';
import getContext from '../utils/getContext';
import ConfirmationModal from './ConfirmationModal';

type Props = {
  player: Player;
  active: boolean;
  isLoading: boolean;
  isDealer: boolean;
  onPickWinner: (playerId: string) => void;
  getCoords: (radius: number) => any;
}

const PlayerInTable = ({player, active, isLoading, isDealer, getCoords, onPickWinner}: Props) => {
  const ctx = getContext();
  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const [isPlayerSettingsVisible, setIsPlayerSettingsVisible] = useState(false);
  const playerSettingsRef = useRef<HTMLDivElement>(null);
  const [confirmationData, setConfirmationData] = useState({
    openModal: false,
    id: "confirmation",
    message: "",
    onConfirmed: () => console.log("confirmed")
  });

  const handleClickOutsideDropdown =(e:any)=>{
      if(isPlayerSettingsVisible && !playerSettingsRef.current?.contains(e.target as Node)){
          setIsPlayerSettingsVisible(false);
      }
  }
  window.addEventListener("click",handleClickOutsideDropdown)


  const playerFrameCls = (isActive: boolean) => {
    return isActive ? "player-frame frame-active" : "player-frame";
  };

  return (
    <div key={player.id} ref={playerSettingsRef}>
      <div onClick={() => setIsPlayerSettingsVisible(!isPlayerSettingsVisible)}>
        <div className={playerFrameCls(active)} style={getCoords(40)}>
          <p className="player-frame-name">{player.name}</p>
          <p aria-busy={isLoading} className="player-frame-chips">${player.chips}</p>
        </div>
        <div aria-busy={isLoading} className="player-chips" style={getCoords(20)}>
          ${player.stakedChips}
          {isDealer && <div>D</div>}
        </div>
      </div>
      { isPlayerSettingsVisible && isAdmin() && 
        <div className='player-settings' style={getCoords(1)}>
          <button onClick={() => onPickWinner(player.id)}>Pick winner</button>
          <button onClick={() => setConfirmationData({
            openModal: true,
            id: "confirm-player-kick",
            message: "Do you really wish to kick " + player.name + "?",
            onConfirmed: () => {
              KickPlayerFromRoom(player.id);
              setConfirmationData({...confirmationData, openModal: false});
            }
          })}>Kick out</button>
          <button onClick={() => setConfirmationData({
            openModal: true,
            id: "confirm-player-reset",
            message: "Do you really wish to reset " + player.name + "'s chips?",
            onConfirmed: () => console.log("reset")
          })}>Reset Chips</button>
        </div>
      }
      <ConfirmationModal 
        open={confirmationData.openModal} 
        id={confirmationData.id} 
        message={confirmationData.message} 
        onCancelled={() => setConfirmationData({...confirmationData, openModal: false})} 
        onConfirmed={confirmationData.onConfirmed}/>
    </div>
  )
}

export default PlayerInTable
