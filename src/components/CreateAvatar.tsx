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
    accessories: [avatarOptions.accessories as any],
    accessoriesColor: [avatarOptions.accessoriesColor as any],
    accessoriesProbability: avatarOptions.accessoriesProbability,
    backgroundColor: [avatarOptions.backgroundColor],
    clothing: [avatarOptions.clothing as any],
    clothesColor: [avatarOptions.clothesColor],
    clothingGraphic: [avatarOptions.clothingGraphic as any],
    eyebrows: [avatarOptions.eyebrows as any],
    eyes: [avatarOptions.eyes as any],
    facialHairColor: [avatarOptions.facialHairColor],
    facialHair: [avatarOptions.facialHair as any],
    hairColor: [avatarOptions.hairColor],
    mouth: [avatarOptions.mouth as any],
    nose: [avatarOptions.nose as any],
    style: ["circle"],
    hatColor: [avatarOptions.hatColor],
    skinColor: [avatarOptions.skinColor],
    top: [avatarOptions.top as any]
  }).toDataUriSync();

  return (
    <div onClick={() => onRandom()} data-tooltip="Click me!">
      <img src={avatar} />
    </div>
  )
}

export default CreateAvatar
