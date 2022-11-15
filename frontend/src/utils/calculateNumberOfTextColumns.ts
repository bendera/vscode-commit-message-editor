/**
 * Calculates how many columns are occupied by a text that may contain tabs
 */
export default function calculateNumberOfTextColumns(
  text: string,
  tabSize = 4
): number {
  let i = 0;
  const l = text.length;
  let tabPos = -1;
  let foundTabs = 0;
  let widthOfAllTabs = 0;
  let shift = 0;

  while (i < l) {
    tabPos = text.indexOf('\t', i);

    if (tabPos > -1) {
      foundTabs += 1;

      const shiftedTabPos = tabPos + shift;
      const padSpace =
        Math.ceil(shiftedTabPos / tabSize) * tabSize - shiftedTabPos;
      const widthOfTab = padSpace === 0 ? tabSize : padSpace;

      shift += widthOfTab - 1;
      widthOfAllTabs += widthOfTab;
      i = tabPos + 1;
    } else {
      i = l;
    }
  }

  return widthOfAllTabs - foundTabs + l;
}
