
import hexToRgb from "../functions/hexToRgb";

function rgba(color: any, opacity: number) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
