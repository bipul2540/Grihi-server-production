import db from "../../config/firebase";

export const postCartItemsDataModal = async (
  cartItems: any[],
  userId: string
) => {
  try {
    const cartCollectionRef = db
      .collection("user")
      .doc(userId)
      .collection("cart");
    const batch = db.batch();
    cartItems.forEach((item) => {
      const { productId, ...itemData } = item;
      const itemRef = cartCollectionRef.doc(productId); // Create a new document reference
      batch.set(itemRef, item); // Set the data for each document
    });

    await batch.commit();

    console.log(`Cart items successfully added for user: ${userId}`);
  } catch (error) {
    console.error("Error adding cart items: ", error);
    throw new Error("Failed to add cart items");
  }
};

export const getCartItemsDataModal = async (userId: string): Promise<any[]> => {
  try {
    // Reference to the user's cart subcollection
    const cartCollectionRef = db
      .collection("user")
      .doc(userId)
      .collection("cart");

    // Get all documents in the cart subcollection
    const snapshot = await cartCollectionRef.get();

    // Check if there are no documents
    if (snapshot.empty) {
      console.log(`No cart items found for user: ${userId}`);
      return [];
    }

    // Map over the documents and return the data
    const cartItems = snapshot.docs.map((doc: any) => doc.data());

    return cartItems;
  } catch (error) {
    console.error("Error retrieving cart items: ", error);
    throw new Error("Failed to retrieve cart items");
  }
};
