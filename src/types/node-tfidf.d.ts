declare module "node-tfidf" {
  class TfIdf {
    addDocument(doc: string): void;
    listTerms(docIndex: number): { term: string; tfidf: number }[];
  }
  export default TfIdf;
}
