import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Rules from '../interfaces/Rules';
import SetRules from '../requests/SetRules';

type Props = {
  rules: Rules;
  readOnly: boolean;
};

const GameSettingsMenu = ({ rules, readOnly }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formRules, setFormRules] = useState<Rules>(rules);
  const [isLoading, setIsLoading] = useState(false);
  const [saveButtonInvalid, setSaveButtonInvalid] = useState(false);

  const saveRules = (r: Rules) => {
    setIsLoading(true);

    // validation
    if (r.smallBlind >= r.bigBlind) {
      setSaveButtonInvalid(true);
      setIsLoading(false);
      return;
    }
    if (r.startingChips < r.bigBlind || r.startingChips < r.smallBlind || r.startingChips < r.ante) {
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
  }

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
    <div className="settings">
      <button className="settings-button" onClick={() => setMenuOpen(!menuOpen)}>
        <FontAwesomeIcon icon={faGear} /> Settings
      </button>

      {menuOpen && (
        <div className="settings-dropdown">
          <form>
            <fieldset>
              <label htmlFor="starting-chips">Starting chips</label>
              <input
                id="starting-chips"
                type="number"
                placeholder={JSON.stringify(rules.startingChips)}
                value={formRules.startingChips}
                onChange={(e) => handleInputChange('startingChips', e.target.valueAsNumber)}
                readOnly={readOnly}
              />
              <label htmlFor="ante">Ante</label>
              <input
                id="ante"
                type="number"
                placeholder={JSON.stringify(rules.ante)}
                value={formRules.ante}
                onChange={(e) => handleInputChange('ante', e.target.valueAsNumber)}
                readOnly={readOnly}
              />
              <label htmlFor="small-blind">Small blind</label>
              <input
                id="small-blind"
                type="number"
                placeholder={JSON.stringify(rules.smallBlind)}
                value={formRules.smallBlind}
                onChange={(e) => handleInputChange('smallBlind', e.target.valueAsNumber)}
                readOnly={readOnly}
              />
              <label htmlFor="big-blind">Big blind</label>
              <input
                id="big-blind"
                type="number"
                placeholder={JSON.stringify(rules.bigBlind)}
                value={formRules.bigBlind}
                onChange={(e) => handleInputChange('bigBlind', e.target.valueAsNumber)}
                readOnly={readOnly}
              />
              <button aria-busy={isLoading} onClick={() => saveRules(formRules)} type="button" aria-invalid={saveButtonInvalid}>
                Save
              </button>
            </fieldset>
          </form>
        </div>
      )}
    </div>
  );
};

export default GameSettingsMenu;

