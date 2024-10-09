import { expect, test } from "vitest";
import getRandomAvatarOptions from "./getRandomAvatarOptions";

test("generate different options each time", () => {
  for (let i = 0; i < 100; i++) {
    expect(getRandomAvatarOptions()).not.toBe(getRandomAvatarOptions());
  }
});
