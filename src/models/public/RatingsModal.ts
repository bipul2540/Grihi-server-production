import db from "../../config/firebase";

type RatingsDataType = {
  id: string;
  rating: number;
  title?: string;
  description?: string;
  userId: string;
  images?: string[];
  likes: number;
  dislike: number;
  createdAt: Date;
  updatedAt: Date;
};

export const addRatingsModal = async (
  data: RatingsDataType,
  productId: string,
  userId: string
) => {
  try {
    // Get a reference to the 'ratings' subcollection for the specified product
    const ratingsRef = db
      .collection("products")
      .doc(productId)
      .collection("ratings")
      .doc(userId);

    // Add the rating to the Firestore collection
    await ratingsRef.set(
      {
        ...data,
        userId: userId, // Ensure the userId is included
        createdAt: new Date(), // Set the creation timestamp
        updatedAt: new Date(), // Set the updated timestamp
      },
      { merge: true }
    );

    console.log("Rating added successfully");
  } catch (error) {
    console.error("Error adding rating: ", error);
  }
  const ref = db.collection("products").doc(productId).collection("ratings");
};

export const updateRatingsModal = async (
  data: RatingsDataType,
  productId: string,
  userId: string
) => {
  const ratingRef = db
    .collection("products")
    .doc(productId)
    .collection("ratings")
    .doc(userId);

  await ratingRef.set(data, { merge: true });
  return data;
};

export const getAllRatingsByProductId = async (productId: string) => {
  try {
    const ratingsSnapshot = await db
      .collection("products")
      .doc(productId)
      .collection("ratings")
      .get();

    // Check if there are any ratings
    if (ratingsSnapshot.empty) {
      return [];
    }

    // Map through the snapshot to get all ratings
    const ratings = ratingsSnapshot.docs.map((doc:any) => ({
      id: doc.id, // document ID
      ...doc.data(), // document data
    }));

    return ratings;
  } catch (error) {
    console.error("Error fetching ratings: ", error);
    throw new Error("Failed to retrieve ratings.");
  }
};

export const getRatingsForProductAndUser = async (
  productId: string,
  userId: string
) => {
  try {
    const ratingsSnapshot = await db
      .collection("products")
      .doc(productId)
      .collection("ratings")
      .where("userId", "==", userId)
      .limit(1) // Limit to 1 to optimize query
      .get();

    if (!ratingsSnapshot.empty) {
      // Return the first document found (assuming only one rating per user per product)
      const ratingDoc = ratingsSnapshot.docs[0];
      return {
        hasRatings: true,
        ratingsData: ratingDoc.data(),
      };
    } else {
      return { hasRatings: false };
    }
  } catch (error) {
    console.error("Error checking ratings:", error);
    throw error;
  }
};
