import { firestore } from "firebase-admin";
import db from "../config/firebase";

export const getStoresByAdminId = async (userId: string) => {
  try {
    const storesCollection = db.collection("stores");
    const querySnapshot = await storesCollection
      .where("userId", "==", userId)
      .get();

    if (querySnapshot.empty) {
      throw new Error("No stores found for the given userId");
    }

    const stores = querySnapshot.docs.map((doc:any) => doc.data());
    return stores;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

interface StoreType {
  name: string;
  userId: string;
  createdAt: firestore.Timestamp | firestore.FieldValue;
}
export const createStoreByAdminId = async (storeData: StoreType) => {
  try {
    const storeRef = await db.collection("stores").add({
      ...storeData,
    });

    // Update the document with its actual ID
    await storeRef.update({
      id: storeRef.id,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });

    return storeRef.id;
  } catch (error) {
    throw error;
  }
};

export const deleteStoreById = async (storeId: string) => {
  try {
    await db.collection("stores").doc(storeId).delete();
  } catch (error) {
    throw error;
  }
};

export const updateStoreById = async (storeId: string) => {};
