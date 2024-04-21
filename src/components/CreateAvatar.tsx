import AvatarComponent from 'avataaars'

interface Props {
  avatarStyle: string;
  topType: string;
  accessoriesType: string;
  hairColor: string;
  facialHairType: string;
  clotheType: string;
  clotheColor: string;
  eyeType: string;
  eyebrowType: string;
  mouthType: string;
  skinColor: string;
  onRandom: () => void;
}

const CreateAvatar = (avatar: Props) => {

  return (
    <div onClick={avatar.onRandom} data-tooltip="Click me!">
      <AvatarComponent 
        style={{width: '100px', height: '100px'}}
        avatarStyle={avatar.avatarStyle}
        topType={avatar.topType}
        accessoriesType={avatar.accessoriesType}
        hairColor={avatar.hairColor}
        facialHairType={avatar.facialHairType}
        clotheType={avatar.clotheType}
        clotheColor={avatar.clotheColor}
        eyeType={avatar.eyeType}
        eyebrowType={avatar.eyebrowType}
        mouthType={avatar.mouthType}
        skinColor={avatar.skinColor}
      />
    </div>
  )
}

export default CreateAvatar
