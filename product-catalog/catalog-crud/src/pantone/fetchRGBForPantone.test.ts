import { extractRGBFromScriptText, fetchRGBForPantone } from "./fetchRGBForPantone";

test("Extracts RGB values from script when values are 3-digit numbers", () => {
  const script = `window.pageDataJson = {"color":{"name":"Ballad Blue","code":"13-4304 TPX","hex":{"HTML":"BFCFDD"},"rgb":{"Red":191,"Green":207,"Blue":221},"cmyk":{"Cyan":0,"Magenta":0,"Yellow":0,"Key":0},"ogv":{"ogvO":-1,"ogvG":-1,"ogvV":-1}},"result_code":200,"skus":["13-4304TPG","FHIP110A","FHIP110COY20","FHIP210A","FHIP230A","FHIPRP-2.056A","PQ-13-4304TCX","RM200+BPT01","RM200-PT01","RM200QC"],"total_count":10,"page_info":{"13-4304TPG":"13-4304TPG","FHIP110A":"2.056","FHIP110COY20":"2.056","FHIP210A":"2.056","FHIP230A":"2.056","FHIPRP-2.056A":"2.056A","PQ-13-4304TCX":"PQ-13-4304TCX","RM200+BPT01":"","RM200-PT01":"","RM200QC":""}};`;
  const res = extractRGBFromScriptText(script);
  expect(res).toStrictEqual({ r: 191, g: 207, b: 221 });
});

test("Fetch RGB for Pantone 13-4304", async () => {
  expect(await fetchRGBForPantone(" 13-4304 ")).toStrictEqual({ r: 191, g: 207, b: 221 });
});
