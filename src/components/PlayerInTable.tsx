import { useCallback, useEffect, useRef, useState } from 'react';
import { PlayerState } from '../enums/PlayerState';
import Player from '../interfaces/Player';
import KickPlayerFromRoom from '../requests/KickPlayerFromRoom';
import getContext from '../utils/getContext';
import ConfirmationModal from './ConfirmationModal';
import AnimateChips from '../animations/AnimateChips';
import { GameStage } from '../enums/GameStage';

type Props = {
	player: Player;
	active: boolean;
	isLoading: boolean;
	isDealer: boolean;
	onPickWinner: (playerId: string) => void;
	getCoords: (radius: number) => any;
	gameStage: GameStage;	
}

const PlayerInTable = ({player, active, isLoading, isDealer, gameStage, getCoords, onPickWinner}: Props) => {
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

	useEffect(() => {
		const handleClickOutsideDropdown = (e: any) => {
			if (isPlayerSettingsVisible && !playerSettingsRef.current?.contains(e.target as Node)) {
				setIsPlayerSettingsVisible(false);
			}
		};
		window.addEventListener("click", handleClickOutsideDropdown);
		return () => {
			window.removeEventListener("click", handleClickOutsideDropdown);
		};
	}, [isPlayerSettingsVisible]);

	const stakeRef = useRef<HTMLDivElement>(null);

	const handleKickPlayer = useCallback(() => {
		KickPlayerFromRoom(player.id);
		setConfirmationData({...confirmationData, openModal: false});
	}, [player.id, confirmationData]);


	const playerFrameCls = (isActive: boolean) => {
		return isActive ? "player-frame frame-active" : "player-frame";
	};

	return (
		<div key={player.id} ref={playerSettingsRef}>
			<div onClick={() => setIsPlayerSettingsVisible(!isPlayerSettingsVisible)}>
				<div className={playerFrameCls(active)} style={getCoords(40)}>
					<p className="player-frame-name">{player.name}</p>
					<p aria-busy={isLoading} className="player-frame-chips">${AnimateChips(0, player.chips)}</p>
				</div>
				<div aria-busy={isLoading} className="player-chips" style={getCoords(20)}>
					<div ref={stakeRef}>
            ${AnimateChips(0, player.stakedChips)}
					</div>
					{isDealer && <div>D</div>}
				</div>
			</div>
			{ isPlayerSettingsVisible && isAdmin() && 
				<div className='player-settings' style={getCoords(1)}>
          { player.state !== PlayerState.FOLDED &&
					<button 
						aria-disabled={gameStage !== GameStage.SHOWDOWN} 
						onClick={() => onPickWinner(player.id)}>Pick winner</button>
          }

					<button 
						aria-disabled={gameStage !== GameStage.SHOWDOWN} 
						className="button-danger" 
						onClick={() => setConfirmationData({
							openModal: true,
							id: "confirm-player-reset",
							message: "Do you really wish to reset " + player.name + "'s chips?",
							onConfirmed: () => console.log("reset")
						})}>Reset Chips</button>

					<button 
						className="button-danger" 
						onClick={() => setConfirmationData({
							openModal: true,
							id: "confirm-player-kick",
							message: "Do you really wish to kick " + player.name + "?",
							onConfirmed: () => handleKickPlayer
						})}>Kick out</button>
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
