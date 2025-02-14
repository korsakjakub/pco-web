import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { GameMode } from "../enums/GameMode";
import Player from "../interfaces/Player";
import Rules from "../interfaces/Rules";
import SetRules from "../requests/SetRules";
import PlayersList from "./PlayersList";
import QueueList from "./QueueList";

type Props = {
  playersInRoom: Player[];
  playersInQueue: Player[];
  rules: Rules;
  readOnly: boolean;
};
const AdminPanel = ({
  playersInRoom,
  playersInQueue,
  rules,
  readOnly,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveButtonInvalid, setSaveButtonInvalid] = useState(false);
  const [formRules, setFormRules] = useState<Rules>(rules);
  const saveRules = (r: Rules) => {
    setIsLoading(true);

    // validation
    if (r.smallBlind >= r.bigBlind) {
      setSaveButtonInvalid(true);
      setIsLoading(false);
      return;
    }
    if (
      r.startingChips < r.bigBlind ||
      r.startingChips < r.smallBlind ||
      r.startingChips < r.ante
    ) {
      setSaveButtonInvalid(true);
      setIsLoading(false);
      return;
    }
    // end validation

    SetRules(r).then(() => {
      setFormRules(r);
      setSaveButtonInvalid(false);
      setIsLoading(false);
    });
  };

  const handleInputChange = (fieldName: keyof Rules, value: number) => {
    if (!value) {
      value = 0;
    }

    setFormRules((prevRules) => ({
      ...prevRules,
      [fieldName]: Math.abs(value),
    }));
  };

  return (
    <details>
      <summary>
        Admin Panel{" "}
        {playersInQueue.length > 0 && (
          <span data-tooltip="some players are waiting in the queue">
            <FontAwesomeIcon icon={faExclamationCircle} />{" "}
            {playersInQueue.length}
          </span>
        )}
      </summary>
      <section>
        <PlayersList players={playersInRoom || []} />
        <QueueList players={playersInQueue || []} />
      </section>
      <section>
        <form>
          <fieldset className="grid">
            <label htmlFor="startingChips">
              <span>Starting Chips</span>
              <input
                id="startingChips"
                type="number"
                placeholder={JSON.stringify(rules.startingChips)}
                value={formRules.startingChips}
                onChange={(e) =>
                  handleInputChange("startingChips", e.target.valueAsNumber)
                }
                readOnly={readOnly}
              />
            </label>
            {rules.gameMode === GameMode.TOURNAMENT && (
              <>
                <label htmlFor="ante">
                  <span>Ante</span>
                  <input
                    id="ante"
                    type="number"
                    placeholder={JSON.stringify(rules.ante)}
                    value={formRules.ante}
                    onChange={(e) =>
                      handleInputChange("ante", e.target.valueAsNumber)
                    }
                    readOnly={readOnly}
                  />
                </label>
              </>
            )}
            <label htmlFor="smallBlind">
              <span>Small Blind</span>
              <input
                type="number"
                id="smallBlind"
                placeholder={JSON.stringify(rules.smallBlind)}
                value={formRules.smallBlind}
                onChange={(e) =>
                  handleInputChange("smallBlind", e.target.valueAsNumber)
                }
                readOnly={readOnly}
              />
            </label>
            <label htmlFor="bigBlind">
              <span>Big Blind</span>
              <input
                type="number"
                id="bigBlind"
                placeholder={JSON.stringify(rules.bigBlind)}
                value={formRules.bigBlind}
                onChange={(e) =>
                  handleInputChange("bigBlind", e.target.valueAsNumber)
                }
                readOnly={readOnly}
              />
            </label>
            <button
              aria-busy={isLoading}
              onMouseDown={() => saveRules(formRules)}
              type="button"
              aria-invalid={saveButtonInvalid}
            >
              Save rules
            </button>
          </fieldset>
        </form>
      </section>
    </details>
  );
};

export default AdminPanel;
