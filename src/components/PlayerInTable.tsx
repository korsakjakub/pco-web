import { useCallback, useEffect, useRef, useState } from "react";
import AnimateChips from "../animations/AnimateChips";
import { GameStage } from "../enums/GameStage";
import { GameState } from "../enums/GameState";
import { PlayerState } from "../enums/PlayerState";
import Player from "../interfaces/Player";
import Rules from "../interfaces/Rules";
import KickPlayerFromRoom from "../requests/KickPlayerFromRoom";
import ResetChips from "../requests/ResetChips";
import getContext from "../utils/getContext";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";
import ConfirmationModal from "./ConfirmationModal";

type Props = {
  player: Player;
  active: boolean;
  isLoading: boolean;
  isDealer: boolean;
  onPickWinner: (playerId: string) => void;
  getCoords: (radius: number) => any;
  gameStage: GameStage;
  gameState: GameState;
  rules: Rules;
};

const PlayerInTable = ({
  player,
  active,
  isLoading,
  isDealer,
  gameStage,
  gameState,
  rules,
  getCoords,
  onPickWinner,
}: Props) => {
  const ctx = getContext();
  const isAdmin = () => ctx.roomToken !== "" && ctx.roomToken !== null;

  const [isPlayerSettingsVisible, setIsPlayerSettingsVisible] = useState(false);
  const playerSettingsRef = useRef<HTMLDivElement>(null);
  const [confirmationData, setConfirmationData] = useState({
    openModal: false,
    id: "confirmation",
    message: "",
    onConfirmed: () => console.log("confirmed"),
  });

  useEffect(() => {
    const handleClickOutsideDropdown = (e: any) => {
      if (
        isPlayerSettingsVisible &&
        !playerSettingsRef.current?.contains(e.target as Node)
      ) {
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
    setConfirmationData({ ...confirmationData, openModal: false });
  }, [player.id, confirmationData]);

  const handleResetChips = useCallback(() => {
    ResetChips(player.id, rules.startingChips);
    setConfirmationData({ ...confirmationData, openModal: false });
  }, [player.id, confirmationData]);

  const playerFrameCls = (isActive: boolean, gameStage: GameStage) => {
    const playerFrameClsInactive = "player-frame";
    const playerFrameClsActive = "player-frame frame-active";

    if (gameStage === GameStage.SHOWDOWN) {
      return playerFrameClsInactive;
    }
    return isActive ? playerFrameClsActive : playerFrameClsInactive;
  };

  const getAvatarImgSource = (avatar: AvatarOptions) => {
    let params = "";

    if (avatar === null) {
      return "https://api.dicebear.com/8.x/avataaars/jpg";
    }

    for (const [key, value] of Object.entries(avatar)) {
      if (value === null || value === undefined) {
        continue;
      }
      params += `&${key}=${value}`;
    }
    return `https://api.dicebear.com/8.x/avataaars/jpg?${params}`;
  };

  const getDealerButtonCoords = (radius: number) => {
    // Get the base coordinates and apply a direct offset to position anticlockwise
    const baseCoords = getCoords(radius);
    const leftValue = parseFloat(baseCoords.left.replace('%', ''));
    const topValue = parseFloat(baseCoords.top.replace('%', ''));
    
    // Simple offset: move left and slightly up for anticlockwise positioning
    return {
      left: (leftValue - 8) + "%",
      top: (topValue - 4) + "%",
    };
  };

  return (
    <div key={player.id} ref={playerSettingsRef}>
      <div
        onMouseDown={() => setIsPlayerSettingsVisible(!isPlayerSettingsVisible)}
      >
        <div
          className={playerFrameCls(active, gameStage)}
          style={getCoords(40)}
        >
          <img
            src={getAvatarImgSource(player.avatar)}
            className="player-avatar"
          />
          <div aria-busy={isLoading} className="player-frame-chips">
            {AnimateChips(0, player.chips)}
          </div>
        </div>
        <div
          className="player-name"
          style={getCoords(48)}
        >
          {player.name}
        </div>
        <div
          aria-busy={isLoading}
          className="player-chips"
          style={getCoords(30)}
        >
          <div ref={stakeRef}>{AnimateChips(0, player.stakedChips)}</div>
        </div>
        {isDealer && (
          <div
            className="dealer-button"
            style={getDealerButtonCoords(30)}
          >
            <div className="dealer-button-inner">
              <span className="dealer-button-text">D</span>
            </div>
          </div>
        )}
      </div>
      {isPlayerSettingsVisible && isAdmin() && (
        <div className="player-settings" style={getCoords(1)}>
          {player.state !== PlayerState.FOLDED && (
            <button
              aria-disabled={gameStage !== GameStage.SHOWDOWN}
              onMouseDown={() => onPickWinner(player.id)}
            >
              Pick winner
            </button>
          )}

          <button
            aria-disabled={gameState !== GameState.WAITING}
            className="button-danger"
            onMouseDown={() =>
              setConfirmationData({
                openModal: true,
                id: "confirm-player-reset",
                message:
                  "Do you really wish to reset " + player.name + "'s chips?",
                onConfirmed: () => handleResetChips(),
              })
            }
          >
            Reset Chips
          </button>

          <button
            className="button-danger"
            onMouseDown={() =>
              setConfirmationData({
                openModal: true,
                id: "confirm-player-kick",
                message: "Do you really wish to kick " + player.name + "?",
                onConfirmed: () => handleKickPlayer(),
              })
            }
          >
            Kick out
          </button>
        </div>
      )}
      <ConfirmationModal
        open={confirmationData.openModal}
        id={confirmationData.id}
        message={confirmationData.message}
        onCancelled={() =>
          setConfirmationData({ ...confirmationData, openModal: false })
        }
        onConfirmed={confirmationData.onConfirmed}
      />
    </div>
  );
};

export default PlayerInTable;
