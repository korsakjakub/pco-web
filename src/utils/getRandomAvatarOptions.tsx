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
  let enumProps: any = {};
  
  for (const key in properties) {
    const property = properties[key];

    if (typeof property === 'object' && property !== null && 'items' in property) {
      const items = property.items;
      
      if (typeof items === 'object' && items !== null && 'enum' in items) {
        const enumArray = items.enum;
        
        if (Array.isArray(enumArray) && enumArray.every(item => typeof item === 'string')) {
          enumProps[key] = randomizeValue(enumArray as string[]);
        }
      }
    }

    if (key.includes("Color") && typeof property === 'object' && property !== null) {
      if ('default' in property && Array.isArray(property.default) && property.default.every(item => typeof item === 'string')) {
        enumProps[key] = randomizeValue(property.default as string[]);
      }
    }

    if (key.includes("Probability")) {
      enumProps[key] = Math.random() >= 0.5 ? 100 : 0;
    }
  }

  return enumProps;
};

export default getRandomAvatarOptions

export interface AvatarOptions {
    accessories: string;
    accessoriesColor: string;
    accessoriesProbability: number;
    clothesColor: string;
    clothing: string;
    clothingGraphic: string;
    eyebrows: string;
    eyes: string;
    facialHair: string;
    facialHairColor: string;
    facialHairProbability: number;
    hairColor: string;
    hatColor: string;
    mouth: string;
    skinColor: string;
    top: string;
    topProbability: number;
};
