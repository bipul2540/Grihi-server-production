import { productSearch } from "../models/storeProductSearchModal";
import _ from "lodash";

const debounceDelay = 300;

// In-memory cache object
const cache: Record<string, any> = {};
const debouncedSearch = _.debounce(async (searchQuery: string, res: any) => {
  try {
    const cacheKey = `searchQuery:${searchQuery}`;

    // Check if the result is already in the cache
    if (cache[cacheKey]) {
      return res.status(200).json({ products: cache[cacheKey] });
    }

    const products = await productSearch(searchQuery);

    if (!res.headersSent) {
      if (products.length > 0) {
        cache[cacheKey] = products;
        res.status(200).json({ products });
      } else {
        return res.status(200).json({ products: [] });
      }
    }
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}, debounceDelay);

export const storeProductSearch = async (req: any, res: any) => {
  const { userId, roles } = req.user;
  const { storeId } = req.params;

  const searchQuery = req.query.searchQuery as string;
  if (!searchQuery || typeof searchQuery !== "string")
    return res.status(400).json({ message: "Invalid search query" });

  if (!userId) return res.status(400).json({ message: "un-authorized" });
  if (!roles || roles[0] !== "admin")
    return res.status(403).json({ message: "Only admin allowed" });

  if (!storeId)
    return res
      .status(400)
      .json({ message: "Invalid request, storeId not found" });

  debouncedSearch(searchQuery, res);
};
