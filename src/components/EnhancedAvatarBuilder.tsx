import { faChevronLeft, faChevronRight, faDice } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { AvatarOptions } from "../utils/getRandomAvatarOptions";
import getRandomAvatarOptions from "../utils/getRandomAvatarOptions";
import { getAvatarPropertyOptions, AVATAR_CATEGORIES, BASIC_SKIN_COLORS, HAIR_COMBINATIONS, getNextValue, getPreviousValue } from "../utils/getAvatarPropertyOptions";
import AvatarImage from "./AvatarImage";

interface Props {
  onAvatarChanged: (avatarOptions: AvatarOptions) => void;
}

const EnhancedAvatarBuilder = ({ onAvatarChanged }: Props) => {
  const initialAvatar = getRandomAvatarOptions();
  const [avatar, setAvatar] = useState<AvatarOptions>(initialAvatar);
  const [propertyOptions] = useState(() => getAvatarPropertyOptions());
  const [activeCategory, setActiveCategory] = useState<string>("Hair");
  const [currentHairIndex, setCurrentHairIndex] = useState<number>(0);

  useEffect(() => {
    // Set initial hair combination
    const initialHairIndex = Math.floor(Math.random() * HAIR_COMBINATIONS.length);
    const hairCombo = HAIR_COMBINATIONS[initialHairIndex];
    const updatedAvatar = {
      ...initialAvatar,
      top: hairCombo.style,
      hairColor: hairCombo.color,
      topProbability: 100
    };
    setCurrentHairIndex(initialHairIndex);
    setAvatar(updatedAvatar);
    onAvatarChanged(updatedAvatar);
  }, []);

  const updateAvatarProperty = (property: string, value: string) => {
    let updatedAvatar = { ...avatar };
    
    if (property === "hairCombination") {
      const hairIndex = parseInt(value);
      const hairCombo = HAIR_COMBINATIONS[hairIndex];
      if (hairCombo) {
        updatedAvatar.top = hairCombo.style;
        updatedAvatar.hairColor = hairCombo.color;
        updatedAvatar.topProbability = 100; // Ensure hair is visible
        setCurrentHairIndex(hairIndex);
      }
    } else {
      updatedAvatar = { ...avatar, [property]: value };
    }
    
    setAvatar(updatedAvatar);
    onAvatarChanged(updatedAvatar);
  };

  const getOptionsForProperty = (property: string): string[] => {
    if (property === "skinColor") {
      return BASIC_SKIN_COLORS;
    }
    if (property === "hairCombination") {
      return HAIR_COMBINATIONS.map((_, index) => index.toString());
    }
    return propertyOptions[property] || [];
  };

  const randomizeAvatar = () => {
    // Only randomize controllable properties
    const randomHairIndex = Math.floor(Math.random() * HAIR_COMBINATIONS.length);
    const hairCombo = HAIR_COMBINATIONS[randomHairIndex];
    
    // Get random values for other controllable properties
    const eyesOptions = propertyOptions["eyes"] || [];
    const eyebrowsOptions = propertyOptions["eyebrows"] || [];
    const mouthOptions = propertyOptions["mouth"] || [];
    
    const finalAvatar = {
      ...avatar, // Keep existing properties
      // Randomize hair
      top: hairCombo.style,
      hairColor: hairCombo.color,
      topProbability: 100,
      // Randomize other controllable properties
      eyes: eyesOptions[Math.floor(Math.random() * eyesOptions.length)] || avatar.eyes,
      eyebrows: eyebrowsOptions[Math.floor(Math.random() * eyebrowsOptions.length)] || avatar.eyebrows,
      mouth: mouthOptions[Math.floor(Math.random() * mouthOptions.length)] || avatar.mouth,
      skinColor: BASIC_SKIN_COLORS[Math.floor(Math.random() * BASIC_SKIN_COLORS.length)]
    };
    
    setCurrentHairIndex(randomHairIndex);
    setAvatar(finalAvatar);
    onAvatarChanged(finalAvatar);
  };

  const getCurrentValueForProperty = (property: string): string => {
    if (property === "hairCombination") {
      return currentHairIndex.toString();
    }
    return avatar[property as keyof AvatarOptions] as string;
  };

  const handleNext = (property: string) => {
    const options = getOptionsForProperty(property);
    if (options && options.length > 0) {
      const currentValue = getCurrentValueForProperty(property);
      const nextValue = getNextValue(currentValue, options);
      updateAvatarProperty(property, nextValue);
    }
  };

  const handlePrevious = (property: string) => {
    const options = getOptionsForProperty(property);
    if (options && options.length > 0) {
      const currentValue = getCurrentValueForProperty(property);
      const previousValue = getPreviousValue(currentValue, options);
      updateAvatarProperty(property, previousValue);
    }
  };

  const getCurrentCategoryProperty = () => {
    const properties = AVATAR_CATEGORIES[activeCategory as keyof typeof AVATAR_CATEGORIES];
    return properties ? properties[0] : null;
  };

  const handlePreviousCategory = () => {
    const property = getCurrentCategoryProperty();
    if (property) {
      handlePrevious(property);
    }
  };

  const handleNextCategory = () => {
    const property = getCurrentCategoryProperty();
    if (property) {
      handleNext(property);
    }
  };

  return (
    <div className="enhanced-avatar-builder">
      <div className="avatar-with-controls">
        <button
          type="button"
          onClick={handlePreviousCategory}
          className="side-control-button left"
          aria-label="Previous option"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        
        <div className="avatar-center">
          <AvatarImage avatarOptions={avatar} />
          <div className="category-selector">
            {Object.keys(AVATAR_CATEGORIES).map((categoryName) => (
              <button
                key={categoryName}
                type="button"
                onClick={() => setActiveCategory(categoryName)}
                className={`category-dot ${activeCategory === categoryName ? 'active' : ''}`}
                aria-label={`Select ${categoryName}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={randomizeAvatar}
            className="randomize-button"
            title="Randomize all"
          >
            <FontAwesomeIcon icon={faDice} />
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleNextCategory}
          className="side-control-button right"
          aria-label="Next option"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default EnhancedAvatarBuilder;