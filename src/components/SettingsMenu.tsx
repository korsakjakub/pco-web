import { useState } from 'react';
import getFrontUrl from '../utils/getFrontUrl';

const SettingsMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="settings">
      <button className="pure-button">
        <img src={getFrontUrl() + '/settings-gear.svg'} alt="Settings" onClick={() => setMenuOpen(!menuOpen)} className="settings-icon"/>Settings
      </button>

      {menuOpen && (
        <div className="settings-dropdown">
          {/* Add your menu items here */}
          <p>Menu Item 1</p>
          <p>Menu Item 2</p>
          <p>Menu Item 3</p>
        </div>
      )}
    </div>
  );
};

export default SettingsMenu;

