export const SOLFEGGIO_FREQUENCIES = [396, 417, 528, 639, 285, 174];

export const CHAKRA_COLORS = [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#00FF00',
  '#00BFFF',
  '#EE82EE',
];

export function mapBinaryToLines(binary) {
  const text = String(binary || '');
  if (!/^[01]{6}$/.test(text)) return [];
  return text.split('').map((char, index) => {
    const isYang = char === '1';
    return {
      line: index + 1,
      frequency: SOLFEGGIO_FREQUENCIES[index],
      isYang,
      volume: isYang ? -12 : -24,
      duration: isYang ? 2 : 1,
      octaveShift: isYang ? 1 : 0,
    };
  });
}

export function asBinary(value) {
  const text = String(value || '');
  return /^[01]{6}$/.test(text) ? text : '';
}
