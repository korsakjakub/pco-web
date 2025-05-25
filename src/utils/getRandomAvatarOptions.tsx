import { avataaars } from "@dicebear/collection";
import { BASIC_SKIN_COLORS, HAIR_COMBINATIONS } from "./getAvatarPropertyOptions";

const randomizeValue = (array: string[]) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const properties = avataaars.schema.properties;

const REMOVED_PROPS = ["vomit", "eyepatch", "cry", "xDizzy"];

const getRandomAvatarOptions = () => {
  if (!properties) {
    return [];
  }
  let enumProps: any = {};

  // Select a random hair combination first
  const randomHairCombo = HAIR_COMBINATIONS[Math.floor(Math.random() * HAIR_COMBINATIONS.length)];
  enumProps["top"] = randomHairCombo.style;
  enumProps["hairColor"] = randomHairCombo.color;
  enumProps["topProbability"] = 100; // Always show hair

  // Set fixed basic outfit
  enumProps["clothing"] = "shirtCrewNeck";
  enumProps["clothesColor"] = "e6e6e6"; // Light gray color

  // Randomize only controllable properties
  const controllableProperties = ["eyes", "eyebrows", "mouth"];
  
  for (const key of controllableProperties) {
    const property = properties[key];
    
    if (
      typeof property === "object" &&
      property !== null &&
      "items" in property
    ) {
      const items = property.items;

      if (typeof items === "object" && items !== null && "enum" in items) {
        const enumArray = items.enum;

        if (
          Array.isArray(enumArray) &&
          enumArray.every((item) => typeof item === "string")
        ) {
          const restrictedProps = (enumArray as string[]).filter(
            (o) => !REMOVED_PROPS.includes(o),
          );
          enumProps[key] = randomizeValue(restrictedProps);
        }
      }
    }
  }

  // Set skin color
  enumProps["skinColor"] = randomizeValue(BASIC_SKIN_COLORS);

  // Set other fixed values for consistent appearance
  enumProps["accessories"] = "";
  enumProps["accessoriesProbability"] = 0;
  enumProps["facialHair"] = "";
  enumProps["facialHairProbability"] = 0;

  return enumProps;
};

export default getRandomAvatarOptions;

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
}
