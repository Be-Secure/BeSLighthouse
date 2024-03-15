import hexToRgb from "../functions/hexToRgb";

function rgba(color: string | number, opacity: number) {
  return `rgba(${hexToRgb(color)}, ${opacity})`;
}

export default rgba;
