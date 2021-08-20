import axios from "axios";
import { parse } from "node-html-parser";

const TIMEOUT_SECONDS = 5;

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Converts a string containing Pantone TPX color into RGB color by scraping the official Pantone Website
 */
export const fetchRGBForPantone = async (pantone: string): Promise<RGBColor> => {
  const result = await axios.get(`https://www.pantone.com/color-finder/${pantone.trim()}-TPX`, { timeout: TIMEOUT_SECONDS * 1000 });
  const html = parse(result.data);
  const scriptText = html.querySelector("body").querySelector("script").innerText;
  return extractRGBFromScriptText(scriptText);
};

export const extractRGBFromScriptText = (script: string): RGBColor => {
  const rgbInd = script.indexOf(`"rgb":`) + 5;
  const scriptStartingWithRgB = script.slice(rgbInd);
  const closingBracketInd = scriptStartingWithRgB.indexOf("}");
  const rgbJson = scriptStartingWithRgB.slice(1, closingBracketInd + 1);
  const rgbObj = JSON.parse(rgbJson);
  return {
    r: rgbObj.Red,
    g: rgbObj.Green,
    b: rgbObj.Blue,
  };
};
