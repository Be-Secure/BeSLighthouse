import chroma from "chroma-js";

function hexToRgb(color: any) {
  return chroma(color).rgb().join(", ");
}

export default hexToRgb;
