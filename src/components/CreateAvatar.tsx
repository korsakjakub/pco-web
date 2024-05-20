import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { AvatarOptions } from '../utils/getRandomAvatarOptions';

interface Props {
  avatarOptions: AvatarOptions;
  onRandom: () => void;
}

const CreateAvatar = ({avatarOptions, onRandom}: Props) => {

  const avatar = createAvatar(avataaars, { 
    size: 128, 
    radius: 50,
    style: ["circle"],
    accessories: [avatarOptions.accessories as any],
    accessoriesColor: [avatarOptions.accessoriesColor as any],
    accessoriesProbability: avatarOptions.accessoriesProbability,
    backgroundColor: ["ffdfbf"],
    clothesColor: [avatarOptions.clothesColor],
    clothing: [avatarOptions.clothing as any],
    clothingGraphic: [avatarOptions.clothingGraphic as any],
    eyebrows: [avatarOptions.eyebrows as any],
    eyes: [avatarOptions.eyes as any],
    facialHair: [avatarOptions.facialHair as any],
    facialHairColor: [avatarOptions.facialHairColor],
    facialHairProbability: avatarOptions.facialHairProbability,
    hairColor: [avatarOptions.hairColor],
    hatColor: [avatarOptions.hatColor],
    mouth: [avatarOptions.mouth as any],
    skinColor: [avatarOptions.skinColor],
    top: [avatarOptions.top as any],
    topProbability: avatarOptions.topProbability
  }).toDataUriSync();

  return (
    <div onClick={() => onRandom()} data-tooltip="Click me!">
      <img src={avatar} />
    </div>
  )
}

export default CreateAvatar
