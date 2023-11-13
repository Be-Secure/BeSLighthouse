function pxToRem(number: number, baseNumber = 16) {
  return `${number / baseNumber}rem`;
}

export default pxToRem;
