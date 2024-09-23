import natural from 'natural';

// Initialize tokenizer, stemmer, and wordnet
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const wordnet = new natural.WordNet();

// Initialize TF-IDF
const tfidf = new natural.TfIdf();

// Stop words list
const stopWords = new Set([
  'a', 'an', 'and', 'the', 'of', 'in', 'to', 'with', 'for', 'on', 'at', 'by', 'is', 'it', 'this', 'that', 'as', 'or', 'are', 'was', 'were', 'where', 'what'
]);

export const keywordGenerator = async (
  title: string,
  description: string,
  category: string,
  tags: string[] = [],
  productType?: string
) => {
  // Combine all text fields
  const allText = `${title} ${description} ${tags.join(" ")} ${category} ${productType}`;
  const cleanText = allText.replace(/[_-]/g, " ");

  // Tokenize and preprocess text
  const words = tokenizer.tokenize(cleanText);
  const filteredWords = words
    .filter((word:string) => word.length > 2 && !stopWords.has(word.toLowerCase())) // Remove stop words
    .map((word:string) => word.toLowerCase())
    .map((word:string) => stemmer.stem(word));

  const uniqueKeywords = new Set(filteredWords);
  const bigrams = generateNgrams(filteredWords, 2);
  const trigrams = generateNgrams(filteredWords, 3);

  bigrams.forEach((bigram) => uniqueKeywords.add(bigram));
  trigrams.forEach((trigram) => uniqueKeywords.add(trigram));

  // Add document to TF-IDF and retrieve keywords
  tfidf.addDocument(allText);
  const tfidfKeywords = tfidf
    .listTerms(0)
    .filter((term:any) => term.tfidf > 0.1 && !uniqueKeywords.has(term.term)) // Adjust threshold as needed
    .map((term:any) => term.term);

  tfidfKeywords.forEach((keyword:string) => uniqueKeywords.add(keyword));

  // Fetch synonyms for each word
  const synonymPromises = filteredWords.map((word:string) => getSynonyms(word));
  const synonymResults = await Promise.all(synonymPromises);

  synonymResults.flat()
    .filter(
      (synonym:string) => synonym.length > 2 && /^[a-zA-Z]+$/.test(synonym) // Only include alphabetic synonyms
    )
    .map((synonym:string) => synonym.toLowerCase()) // Consistent casing
    .forEach((synonym:string) => uniqueKeywords.add(synonym));

  // Include title-specific keywords
  const titleKeywords = tokenizer.tokenize(title)
    .filter((word:string) => word.length > 2 && !stopWords.has(word.toLowerCase())) // Remove stop words
    .map((word:string) => word.toLowerCase())
    .map((word:string) => stemmer.stem(word));

  titleKeywords.forEach((keyword:any) => uniqueKeywords.add(keyword));

  return Array.from(uniqueKeywords).slice(0, 100); // Limit to 100 keywords
};

function generateNgrams(words: string[], n: number): string[] {
  const ngrams = [];
  for (let i = 0; i <= words.length - n; i++) {
    ngrams.push(words.slice(i, i + n).join(" "));
  }
  return ngrams;
}

async function getSynonyms(word: string): Promise<string[]> {
  return new Promise((resolve) => {
    wordnet.lookup(word, (results:any) => {
      if (!results.length) {
        return resolve([]);
      }

      const synonyms:any = new Set<string>();

      results.forEach((result:any) => {
        result.synonyms.forEach((synonym:any) => {
          if (synonym.length > 2 && /^[a-zA-Z]+$/.test(synonym)) {
            synonyms.add(synonym.toLowerCase());
          }
        });
      });

      resolve(Array.from(synonyms));
    });
  });
}
