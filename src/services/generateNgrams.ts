export const generateNgrams = (
  str: string,
  minGram: number = 2,
  maxGram: number = 3
): string[] => {
  const ngrams: string[] = [];
  const length = str.length;
  for (let size = minGram; size <= maxGram; size++) {
    for (let i = 0; i <= length - size; i++) {
      ngrams.push(str.substring(i, i + size));
    }
  }

  ngrams.push(str);
  return ngrams;
};
