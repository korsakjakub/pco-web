import { avataaars } from "@dicebear/collection";

const REMOVED_PROPS = ["vomit", "eyepatch", "cry", "xDizzy"];

export const getAvatarPropertyOptions = () => {
  const properties = avataaars.schema.properties;
  if (!properties) {
    return {};
  }

  const propertyOptions: Record<string, string[]> = {};

  for (const key in properties) {
    const property = properties[key];

    // Handle enum properties
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
          propertyOptions[key] = restrictedProps;
        }
      }
    }

    // Handle color properties
    if (
      key.includes("Color") &&
      typeof property === "object" &&
      property !== null
    ) {
      if (
        "default" in property &&
        Array.isArray(property.default) &&
        property.default.every((item) => typeof item === "string")
      ) {
        propertyOptions[key] = property.default as string[];
      }
    }
  }

  // Add hair combinations as a virtual property
  propertyOptions["hairCombination"] = HAIR_COMBINATIONS.map((_, index) => index.toString());

  return propertyOptions;
};

export const HAIR_COMBINATIONS = [
  { style: "bob", color: "a55728" }, // Brown
  { style: "bun", color: "2c1b18" }, // Black
  { style: "curly", color: "d6b370" }, // Blonde
  { style: "curvy", color: "c93305" }, // Ginger
  { style: "dreads", color: "2c1b18" }, // Black
  { style: "frida", color: "724133" }, // Dark brown
  { style: "fro", color: "2c1b18" }, // Black
  { style: "froBand", color: "a55728" }, // Brown
  { style: "longButNotTooLong", color: "c93305" }, // Ginger
  { style: "miaWallace", color: "2c1b18" }, // Black
  { style: "shavedSides", color: "724133" }, // Dark brown
  { style: "straight01", color: "d6b370" }, // Blonde
  { style: "straight02", color: "a55728" }, // Brown
  { style: "straightAndStrand", color: "724133" }, // Dark brown
  { style: "dreads01", color: "2c1b18" }, // Black
  { style: "frizzle", color: "d6b370" }, // Blonde
  { style: "shaggy", color: "a55728" }, // Brown
  { style: "shaggyMullet", color: "724133" }, // Dark brown
  { style: "shortCurly", color: "2c1b18" }, // Black
  { style: "shortFlat", color: "a55728" }, // Brown
  { style: "shortRound", color: "d6b370" }, // Blonde
  { style: "shortWaved", color: "c93305" }, // Ginger
  { style: "sides", color: "724133" }, // Dark brown
  { style: "theCaesar", color: "a55728" }, // Brown
  { style: "theCaesarAndSidePart", color: "2c1b18" }, // Black
  { style: "bigHair", color: "d6b370" } // Blonde
];

export const AVATAR_CATEGORIES = {
  "Hair": ["hairCombination"],
  "Eyes & Eyebrows": ["eyes", "eyebrows"],
  "Mouth": ["mouth"],
  "Skin Color": ["skinColor"]
};

export const BASIC_SKIN_COLORS = ["ffdbb4", "f8d25c", "d08b5b", "614335"];

export const getNextValue = (currentValue: string, options: string[]): string => {
  const currentIndex = options.indexOf(currentValue);
  return options[(currentIndex + 1) % options.length];
};

export const getPreviousValue = (currentValue: string, options: string[]): string => {
  const currentIndex = options.indexOf(currentValue);
  return options[(currentIndex - 1 + options.length) % options.length];
};