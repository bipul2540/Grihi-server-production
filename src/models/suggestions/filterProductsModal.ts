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
type StatsField = "viewCount" | "wishlistCount" | "orderCount" | "cartCount";
export const fetchProductsByStatsAndCategory = async (
  category: string,
  statsField: StatsField
) => {
  const ref = db.collection("products");

  const data = ref
    .where("category.category", "==", category)
    .orderBy(`metadata.stats.${statsField}`, "desc")
    .limit(20)
    .select(...requiredField);
};
