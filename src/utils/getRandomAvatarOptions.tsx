import { avataaars } from '@dicebear/collection';

const randomizeValue = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const properties = avataaars.schema.properties;

const getRandomAvatarOptions = () => {
  if (!properties) {
    return [];
  }
  let enumProps: any = {}
  
  for (var key in properties){
    if ("items" in properties[key]) {
      if ("enum" in properties[key]["items"]) {
          enumProps[key] = randomizeValue(properties[key]["items"]["enum"]);
      }
    }
    if (key.includes("Color")) {
      enumProps[key] = randomizeValue(properties[key]["default"])
    }
    if (key.includes("Probability")) {
      enumProps[key] = Math.random() >= 0.5 ? 100 : 0;
    }
  }
  return enumProps;
}

export default getRandomAvatarOptions

export interface AvatarOptions {
    accessories: string;
    accessoriesColor: string;
    accessoriesProbability: number;
    backgroundColor: string;
    clothing: string;
    clothesColor: string;
    clothingGraphic: string;
    eyebrows: string;
    eyes: string;
    hairColor: string;
    facialHairColor: string;
    facialHair: string;
    mouth: string;
    nose: string;
    hatColor: string;
    skinColor: string;
    top: string;
};
