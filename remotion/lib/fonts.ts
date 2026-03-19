import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";

export const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
});

export const { fontFamily: jakartaFamily } = loadPlusJakartaSans("normal", {
  weights: ["700", "800"],
});
