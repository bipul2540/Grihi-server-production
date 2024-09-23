import algoliasearch from "algoliasearch";
import db from "./firebase";

// Initialize Algolia
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY) {
  throw new Error("Algolia environment variables are not defined.");
}

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex("products");

// Firestore listener function
export const syncFirestoreWithAlgolia = async () => {
  // Listen to Firestore document changes
  db.collection("products").onSnapshot((snapshot: any) => {
    snapshot.docChanges().forEach((change: any) => {
      const data = change.doc.data();
      const objectId = change.doc.id; // Firestore document ID

      if (change.type === "added" || change.type === "modified") {
        index
          .saveObject({
            objectID: objectId,
            ...data,
          })
          .then(() => {
            console.log(`Product ${change.type} in Algolia:`, objectId);
          })
          .catch((err:any) => console.error("Error syncing to Algolia:", err));
      }

      if (change.type === "removed") {
        index
          .deleteObject(objectId)
          .then(() => {
            console.log(`Product removed from Algolia:`, objectId);
          })
          .catch((err: any) =>
            console.error("Error deleting from Algolia:", err)
          );
      }
    });
  });
};
