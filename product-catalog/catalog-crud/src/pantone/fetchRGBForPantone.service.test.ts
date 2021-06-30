/*
 * @group service
 */

import { fetchRGBForPantone } from "./fetchRGBForPantone";

test("Fetch RGB for Pantone 13-4304", async () => {
  expect(await fetchRGBForPantone(" 13-4304 ")).toStrictEqual({ r: 191, g: 207, b: 221 });
});
