import { collection } from "firebase/firestore";
import db from "../../config/firebase";

const requiredField = [
  "id",
  "title",
  "price",
  "discountPrice",
  "metadata.delivery_time",
  "certifications",
  "images",
  "tags",
  "category",
  "sub_category",
];
export const getSuggestionProductByKeywordsModal = async (
  keywords: string[]
) => {
  const productRef = await db.collection("products");

  const titleQuery = productRef
    .where("title", "in", keywords.slice(0, 10))
    .select(...requiredField)
    .limit(5);

  const categoryQuery = productRef
    .where("category.category", "in", keywords.slice(0, 10))
    .select(...requiredField)
    .limit(5);

  const keywordQuery = productRef
    .where("keywords", "array-contains-any", keywords.slice(0, 10))
    .select(...requiredField)
    .limit(5);

  try {
    const [titleSnapshot, categorySnapshot, keywordSnapshot] =
      await Promise.all([
        titleQuery.get(),
        categoryQuery.get(),
        keywordQuery.get(),
      ]);

    // Use a Set to avoid duplicate products
    const productMap = new Map<
      string,
      {
        id: string;
        title: string;
        price: number;
        discountPrice: number;
        tags: string[];
        category: any;
        delivery_time: string;
        images: any;
        subcategory: any;
      }
    >();

    // Collect product data from title query
    titleSnapshot.forEach((doc: any) => {
      productMap.set(doc.id, {
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        discountPrice: doc.data().discountPrice,
        images: doc.data().images,
        category: doc.data().category,
        subcategory: doc.data().sub_category,
        tags: doc.data().tags,
        delivery_time: doc.data().metadata.delivery_time,
      });
    });

    // Collect product data from category query
    categorySnapshot.forEach((doc: any) => {
      productMap.set(doc.id, {
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        discountPrice: doc.data().discountPrice,
        images: doc.data().images,
        category: doc.data().category,
        subcategory: doc.data().sub_category,
        tags: doc.data().tags,
        delivery_time: doc.data().metadata.delivery_time,
      });
    });

    // Collect product data from keyword query
    keywordSnapshot.forEach((doc: any) => {
      productMap.set(doc.id, {
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        discountPrice: doc.data().discountPrice,
        images: doc.data().images,
        category: doc.data().category,
        subcategory: doc.data().sub_category,
        tags: doc.data().tags,
        delivery_time: doc.data().metadata.delivery_time,
      });
    });

    // Convert the Map to an array of unique products
    const uniqueProducts = Array.from(productMap.values());

    // console.log(uniqueProducts);

    return uniqueProducts; // Return only id and title
  } catch (error) {
    console.error("Error fetching suggested products:", error);
    return [];
  }
};

export const getDataByCertainFields = async (
  data: { field: string; val: string }[]
) => {
  try {
    const ref = db.collection("products");

    // Initialize objects to store results separately
    const resultsByField: Record<string, any[]> = {};

    // Iterate over the field-value pairs
    for (const { field, val } of data) {
      // Create a query for each field-value pair
      const querySnapshot = await ref
        .where(field, "==", val)
        .select(...requiredField.map((field) => field as any)) // Only include specified fields
        .limit(20)
        .get();

      // Process and store the results separately
      resultsByField[`${field}:${val}`] = querySnapshot.docs.map(
        (doc: any) => ({
          ...doc.data(), // This will include only the selected fields
        })
      );
    }

    return resultsByField; // Return the results grouped by field-value pairs
  } catch (error) {
    console.error("Error fetching data by certain fields:", error);
    throw new Error("Error fetching data by certain fields");
  }
};
