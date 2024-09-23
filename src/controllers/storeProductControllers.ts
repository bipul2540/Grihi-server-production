import { firestore } from "firebase-admin";
import {
  createProductByStoreId,
  deleteProductById,
  getProductsByStoreId,
  getSingleStoreProductById,
  updateProductById,
  uploadBulk,
} from "../models/storeProductModal";
import { Product } from "../types/types-db";
import { keywordGenerator } from "../services/keywordGenerator";

export const getProductByStore = async (req: any, res: any) => {
  const { storeId } = req.params;
  const { userId, roles } = req.user;
  const { limit, startAfter } = req.query;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  try {
    const products = await getProductsByStoreId(
      storeId,
      userId,
      parseInt(limit as string, 10),
      startAfter as string
    );
    return res
      .status(200)
      .json({ message: "products, fetchedSuccessfully", products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

// POST PRODUCTS
export const createProductByStore = async (req: any, res: any) => {
  const { storeId } = req.params;
  const { userId, roles } = req.user;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });
  const {
    title,
    description,
    productType,
    images,
    price,
    discountPrice,
    stock,
    category,
    tags,
    dimensions,
    certifications,
    metadata,
    sub_category
  } = req.body;
  const requiredFields = {
    title,
    description,
    productType,
    images,
    price,
    discountPrice,
    stock,
    category,
    tags,
    dimensions,
    certifications,
    metadata,
    sub_category
  } as Product;

  for (const [key, value] of Object.entries(requiredFields)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return res.status(400).json({ message: `${key} is required` });
    }
  }
  const keywords = await keywordGenerator(
    title,
    description,
    category.category,
    tags
  );
  const productData = {
    storeId,
    userId,
    title,
    description,
    productType,
    images,
    price,
    discountPrice,
    stock,
    category,
    tags,
    dimensions,
    certifications,
    metadata,
    keywords,
    sub_category,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  try {
    const productId = await createProductByStoreId(productData);

    return res.status(200).json({ message: "success", productId });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getSingleStoreProduct = async (req: any, res: any) => {
  const { storeId, productId } = req.params;
  const { userId, roles } = req.user;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  if (!productId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  try {
    const data = await getSingleStoreProductById(storeId, productId);
    return res.status(200).json({ message: "success", data });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const updateProduct = async (req: any, res: any) => {
  const { storeId, productId } = req.params;
  const { userId, roles } = req.user;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  if (!productId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  const {
    title,
    description,
    productType,
    images,
    price,
    discountPrice,
    stock,
    category,
    tags,
    dimensions,
    certifications,
    metadata,
    sub_category,
  } = req.body as Product;

  const keywords = await keywordGenerator(
    title,
    description,
    category.category,
    tags
  );

  const updatedKeywords = [...keywords, productId.toLowerCase()];

  const data = {
    productId,
    storeId,
    userId,
    title,
    description,
    productType,
    images,
    price,
    discountPrice,
    stock,
    category,
    tags,
    dimensions,
    certifications,
    metadata,
    sub_category,
    keywords: updatedKeywords,
    updatedAt: firestore.FieldValue.serverTimestamp(),
  };

  try {
    const response = await updateProductById(data, storeId, productId);
    return res
      .status(200)
      .json({ message: "product updated Successfully", response });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};

export const uploadBulkProduct = async (req: any, res: any) => {
  const { storeId } = req.params;
  const { userId, roles } = req.user;
  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  const data = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  let successCount = 0;
  let failureCount = 0;
  const failureDetails: Array<{ id?: string; errors: string[] }> = [];

  try {
    const promises = data.map(async (item: any) => {
      const errors: string[] = [];
      if (!item.title) errors.push("Missing title");
      if (!item.price) errors.push("Missing price");
      if (!item.stock) errors.push("Missing stock");

      if (errors.length > 0) {
        failureCount++;
        failureDetails.push({
          id: item._id,
          errors,
        });
        return null;
      }

      try {
        const keywords = await keywordGenerator(
          item.title,
          item.description,
          item.category.category,
          item.tags
        );
        const id = await uploadBulk({
          ...item,
          storeId,
          userId,
          keywords,
        });
        successCount++;
        return { id };
      } catch (error: any) {
        failureCount++;
        failureDetails.push({
          id: item.id,
          errors: [error.message],
        });
        return null;
      }
    });

    await Promise.all(promises);

    return res.json({
      message: "Upload process completed",
      successCount,
      failureCount,
      failures: failureDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error adding data",
      error,
    });
  }
};

export const deleteProduct = async (req: any, res: any) => {
  const { userId, roles } = req.user;
  const { storeId, productId } = req.params;

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  if (!productId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  try {
    await deleteProductById(productId, storeId);
    return res.status(200).json({ message: "Product deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
