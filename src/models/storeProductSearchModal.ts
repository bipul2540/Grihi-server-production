import db from "../config/firebase";

export const productSearch = async (query: string) => {
  try {
    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 2)
      .map((term) => term.trim());
    if (queryTerms.length === 0) {
      throw new Error(
        "Query must contain at least one search term longer than 2 characters."
      );
    }
    const productsRef = db.collection("products");

    const queries = queryTerms.map((term) =>
      productsRef
        // .where("title", ">=", term)
        .where("title", "<=", term + "\uf8ff")
        .where("keywords", "array-contains", term)
    );

    const querySnapshots = await Promise.all(queries.map((q) => q.get()));

    const products = new Map<string, any>();
    querySnapshots.forEach((snapshot) => {
      snapshot.docs.forEach((doc:any) => {
        products.set(doc.id, doc.data());
      });
    });

    return Array.from(products.values());
  } catch (error) {
    throw new Error("search error not found");
  }
};
