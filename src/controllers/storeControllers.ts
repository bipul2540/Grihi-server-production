import {
  createStoreByAdminId,
  deleteStoreById,
  getStoresByAdminId,
} from "../models/storeModal";
import { firestore } from "firebase-admin";

export const getStoreByAdmin = async (req: any, res: any) => {
  try {
    const { userId, roles } = req.user;
    if (!userId) {
      return res.status(400).json({ message: "Unauthorized error" });
    }

    if (!roles || roles[0] !== "admin") {
      return res.status(403).json({ message: "Only admin allowed" });
    }

    const store = await getStoresByAdminId(userId);
    return res.status(200).json(store);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Store can be created by admin...
export const createStoreByAdmin = async (req: any, res: any) => {
  const { name } = req.body;
  const { userId, roles } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }

  if (!roles || roles[0] !== "admin") {
    return res.status(403).json({ message: "Only admin allowed" });
  }

  try {
    const storeData = {
      name,
      userId,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };

    const storeId = await createStoreByAdminId(storeData);

    res.status(201).json({
      message: "Store created successfully",
      storeId,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteStoreByAdmin = async (req: any, res: any) => {
  const {storeId} = req.params;

  const { userId, roles } = req.user;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  try {
    await deleteStoreById(storeId);
    return res.status(200).json({ message: "Store deleted" });
  } catch (error) {
    res.status(500).json({ messaeg: "Internal server Error." });
  }
};
