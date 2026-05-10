import { globalFontFace } from "@vanilla-extract/css";

const PPNeueMontreal = "PPNeueMontreal";
globalFontFace(PPNeueMontreal, {
  src: 'url(/fonts/PPNeueMontreal-Variable.woff2) format("woff2")',
  fontDisplay: "swap",
});

const TTAlientzGrotesk = "TTAlientzGrotesk";
globalFontFace(TTAlientzGrotesk, {
  src: 'url(/fonts/TT_Alientz_Grotesque.woff2) format("woff2")',
  fontDisplay: "swap",
});

const MabeoVintage = "MabeoVintage";
globalFontFace(MabeoVintage, {
  src: 'url(/fonts/MabeoVintage-Regular.woff2) format("woff2")',
  fontDisplay: "swap",
});
