import { firestore } from "firebase-admin";
import db from "../config/firebase"; // Ensure this imports your initialized Firestore instance

export const getProductsByStoreId = async (
  storeId: string,
  userId: string,
  limit: number | undefined,
  startAfterDocId: string | undefined
) => {
  try {
    let query = db
      .collection("products")
      .where("storeId", "==", storeId)
      .where("userId", "==", userId)
      .limit(limit || 7);

    if (startAfterDocId) {
      const startAfterDoc = await db
        .collection("products")
        .doc(startAfterDocId)
        .get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      } else {
        throw new Error("Invalid startAfterDocId");
      }
    }

    const querySnapshot = await query.get();

    if (querySnapshot.empty) {
      return [];
    }
    const products = querySnapshot.docs.map((doc:any) => doc.data());
    return products;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const createProductByStoreId = async (data: any) => {
  try {
    const productRef = db.collection("products").doc(); // Get a reference to a new document

    const productData = {
      ...data,
      id: productRef.id,
      keywords: [...(data.keywords || []), productRef.id.toLowerCase()],
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await productRef.set(productData);

    return productRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSingleStoreProductById = async (
  storeId: string,
  productId: string
) => {
  try {
    const querySnapshot = await db
      .collection("products")
      .where("storeId", "==", storeId)
      .where("id", "==", productId)
      .get();

    if (querySnapshot.empty) {
      throw new Error("Product not found");
    }
    const productDoc = querySnapshot.docs[0];
    const productData = productDoc.data();

    return productData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateProductById = async (
  data: any,
  storeId: string,
  productId: string
) => {
  try {
    const querySnapshot = await db
      .collection("products")
      .where("storeId", "==", storeId)
      .where("id", "==", productId)
      .get();

    if (querySnapshot.empty) {
      throw new Error("Product not found");
    }
    const productDoc = querySnapshot.docs[0];
    const productRef = productDoc.ref;
    await productRef.update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return { message: "Product updated successfully" };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const uploadBulk = async (data: any) => {
  try {
    const productRef = db.collection("products").doc();

    const keywords = data.keywords || [];
    keywords.push(productRef.id.toLowerCase());

    const productData = {
      ...data,
      id: productRef.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await productRef.set(productData);

    return productRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteProductById = async (productId: string, storeId: string) => {
  try {
    await db.collection("products").doc(productId).delete();
    return { message: "successfully deleted" };
  } catch (error) {
    throw error;
  }
};
