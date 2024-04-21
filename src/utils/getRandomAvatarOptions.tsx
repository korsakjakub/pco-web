
const randomizeValue = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const getRandomAvatarOptions = () => {
  return {
    avatarStyle: 'Circle',
    topType: randomizeValue(['NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'LongHairBigHair', 'ShortHairShortFlat']),
    accessoriesType: randomizeValue(['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers']),
    hairColor: randomizeValue(['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray']),
    facialHairType: randomizeValue(['BeardMedium', 'BeardLight', 'BeardMagestic', 'MoustacheFancy', 'MoustacheMagnum']),
    clotheType: randomizeValue(['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck']),
    clotheColor: randomizeValue(['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange']),
    eyeType: randomizeValue(['Close', 'Default', 'Cry', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky']),
    eyebrowType: randomizeValue(['Angry', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural']),
    mouthType: randomizeValue(['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit']),
    skinColor: randomizeValue(['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']),
  };
}

export default getRandomAvatarOptions
