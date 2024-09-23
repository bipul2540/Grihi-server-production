import db from "../../config/firebase";

export const getProductByCategory = async (
  categoryName: string,
  page: number,
  limit: number
) => {
  try {
    const productsRef = db.collection("products");
    console.log("hello user");

    // Calculate the number of documents to skip
    const offset = (page - 1) * limit;

    const countSnapshot = await productsRef
      .where("category.category", "==", categoryName)
      .get();

    const totalProducts = countSnapshot.size;

    // Query the products collection with pagination
    let query = productsRef
      .where("category.category", "==", categoryName)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .select(
        "id",
        "title",
        "description",
        "price",
        "category.category",
        "discountPrice",
        "images",
        "createdAt"
      );

    // Apply the offset using startAfter if necessary
    if (offset > 0) {
      const lastVisibleDoc = await productsRef
        .where("category.category", "==", categoryName)
        .orderBy("createdAt", "desc")
        .limit(offset)
        .get();

      if (!lastVisibleDoc.empty) {
        const lastVisible = lastVisibleDoc.docs[lastVisibleDoc.docs.length - 1];
        query = query.startAfter(lastVisible);
      }
    }

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return [];
    }

    const products = querySnapshot.docs.map((doc:any) => ({
      id: doc.id, // Assuming you want to include the document ID
      ...doc.data(),
    }));

    return { products, totalProducts };
  } catch (error) {
    throw new Error("Failed to fetch products by category.");
  }
};

export const getProductById = async (productId: string) => {
  try {
    // Reference to the product document in Firestore
    const productRef = db.collection("products").doc(productId);

    // Fetch the product document
    const productDoc = await productRef.get();

    // Check if the document exists
    if (productDoc.exists) {
      // Return the product data
      const productData = productDoc.data();
      if (productData) {
        const {
          title,
          price,
          discountPrice,
          images,
          description,
          category,
          metadata,
          tags,
          certifications,
          dimensions,
        } = productData;
        return {
          title,
          price,
          discountPrice,
          images,
          description,
          category,
          metadata,
          tags,
          certifications,
          dimensions,
        };
      }
    } else {
      // If the product does not exist, return null or handle it as needed
      return null;
    }
  } catch (error) {
    // Handle any errors that occur during the fetch
    throw error;
  }
};
