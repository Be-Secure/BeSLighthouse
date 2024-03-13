import chroma from "chroma-js";

function hexToRgb(color: string | number | chroma.Color) {
  return chroma(color).rgb().join(", ");
}

export default hexToRgb;
