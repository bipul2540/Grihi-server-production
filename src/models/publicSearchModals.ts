import { firestore } from "firebase-admin";
import db from "../config/firebase";
import { generateNgrams } from "../services/generateNgrams";

export const postSearchQuery = async (identifiers: string, query: string) => {
  try {
    const token = query.toLowerCase().split(" ");
    const ref = await db.collection("search_queries").add({
      identifiers: identifiers || "anonymus",
      query: query.toLowerCase(),
      token,
      insertedAt: firestore.FieldValue.serverTimestamp(),
    });

    // Update the document with its actual ID
    await ref.update({
      id: ref.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return ref.id;
  } catch (error) {
    throw error;
  }
};

export const getSearchHistory = async (query: string): Promise<string[]> => {
  try {
    const searchTerm = query.toLowerCase().split(" ");
    const ngrams = searchTerm.map((term:string) => generateNgrams(term)).flat();

    // Handle Firestore's array-contains-any limit by chunking ngrams
    const chunkSize = 10; // Firestore's limit for `array-contains-any`
    const queryPromises = [];
    for (let i = 0; i < ngrams.length; i += chunkSize) {
      const ngramChunk = ngrams.slice(i, i + chunkSize);
      const queryPromise = db
        .collection("search_queries")
        .where("token", "array-contains-any", ngramChunk)
        .get();
      queryPromises.push(queryPromise);
    }

    // Await all queries and consolidate results
    const snapshots = await Promise.all(queryPromises);
    const suggestions = snapshots.flatMap((snapshot:any) =>
      snapshot.docs.map((doc:any) => doc.data().query)
    );

    // Filter and deduplicate suggestions
    const uniqueSuggestions = [...new Set(suggestions)];
    return uniqueSuggestions;
  } catch (error) {
    throw new Error("Failed to retrieve search suggestions");
  }
};
