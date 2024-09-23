import db from "../../config/firebase";
import { AddresssDataType } from "../../types/types-db";
export const getAddressByuserId = async (userId: string) => {
  try {
    // Reference to the user's address subcollection
    const addressesRef = db.collection(`user/${userId}/address`);

    // Fetch the addresses
    const snapshot = await addressesRef.get();

    // Check if any addresses exist
    if (snapshot.empty) {
      return [];
    }

    // Map the results to an array of address objects
    const addresses = snapshot.docs.map((doc:any) => ({
      ...doc.data(),
    }));

    return addresses;
  } catch (error) {
    throw new Error("Failed to fetch addresses");
  }
};

export const addAddressByUserId = async (
  data: AddresssDataType,
  userId: string
) => {
  try {
    const addressCollectionRef = db.collection(`user/${userId}/address`);
    const docRef = await addressCollectionRef.add(data);
    await docRef.update({ id: docRef.id });
    return docRef.id;
  } catch (error) {
    throw new Error("Failed to add address");
  }
};

export const updateAddress = async (data: AddresssDataType, userId: string) => {
  try {
    const { id, ...addressData } = data;

    if (!id) {
      throw new Error("Document ID is required for updating.");
    }
    const addressRef = db.doc(`user/${userId}/address/${id}`);
    await addressRef.set(addressData, { merge: true });
    return { success: true };
  } catch (error) {
    throw new Error("erro updting afddress")
  }
};
