import db from "../../config/firebase";

const required = [
  "id",
  "title",
  "description",
  "price",
  "category.category",
  "discountPrice",
  "images",
  "tags",
];
export const getSearchProdcutModal = async (searchTerm: string) => {
  const productsRef = db.collection("products");

  // Split the search term into individual words
  const searchTerms = searchTerm.toLowerCase().split(/\s+/); // Splits by spaces

  const results: any[] = [];

  try {
    // Loop through each individual term and perform queries
    for (const term of searchTerms) {
      // Query 1: Search in the title field
      const titleSnapshot = await productsRef
        .where("title", ">=", term)
        .where("title", "<=", term + "\uf8ff")
        .select(...required) // Select only the specified fields
        .get();
      titleSnapshot.forEach((doc: any) =>
        results.push({ id: doc.id, ...doc.data() })
      );

      // Query 2: Search in the description field
      const descriptionSnapshot = await productsRef
        .where("description", ">=", term)
        .where("description", "<=", term + "\uf8ff")
        .select(...required) // Select only the specified fields
        .get();
      descriptionSnapshot.forEach((doc: any) =>
        results.push({ id: doc.id, ...doc.data() })
      );

      // Query 3: Search in the tags array (array-contains-any)
      const tagsSnapshot = await productsRef
        .where("tags", "array-contains", term)
        .select(...required) // Select only the specified fields
        .get();
      tagsSnapshot.forEach((doc: any): any =>
        results.push({ id: doc.id, ...doc.data() })
      );

      // Query 4: Search in the keywords array (array-contains-any)
      const keywordsSnapshot = await productsRef
        .where("keywords", "array-contains", term)
        .select(...required) // Select only the specified fields
        .get();
      keywordsSnapshot.forEach((doc: any) =>
        results.push({ id: doc.id, ...doc.data() })
      );
    }

    return { length: results.length, results }; // Return the filtered results
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

export const getSearchProductModalByPage = async (
  searchTerm: string,
  page: number,
  limit: number,
  lastDoc: any = null
) => {
  const productsRef = db.collection("products");
  const offset = (page - 1) * limit;

  const searchTerms = searchTerm.toLowerCase().split(/\s+/);

  let results: any[] = [];
  let lastVisible: any = null;

  try {
    for (const term of searchTerms) {
      let queries = [
        productsRef
          .where("title", ">=", term)
          .where("title", "<=", term + "\uf8ff"),
        productsRef.where("tags", "array-contains", term),
        productsRef.where("keywords", "array-contains", term),
      ];

      for (let query of queries) {
        query = query.select(...required).limit(limit);

        if (lastDoc) {
          query = query.startAfter(lastDoc);
        }

        const snapshot = await query.get();

        snapshot.forEach((doc: any) => {
          const data = doc.data();

          results.push({ id: doc.id, ...data });
        });

        if (!lastDoc && !snapshot.empty) {
          lastDoc = snapshot.docs[snapshot.docs.length - 1];
        }
      }
    }

    results = Array.from(
      new Map(results.map((item) => [item.id, item])).values()
    );

    lastVisible = results.length > 0 ? results[results.length - 1] : null;

    return { results, lastVisible };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
