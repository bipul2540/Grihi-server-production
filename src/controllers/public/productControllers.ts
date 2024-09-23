import {
  getProductByCategory,
  getProductById,
} from "../../models/public/productModal";

export const getProductByCategoryControllers = async (req: any, res: any) => {
  const { categoryName, page, limit } = req.query;
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 40;
  console.log(req.query);
  try {
    const data = await getProductByCategory(
      categoryName,
      pageNumber,
      limitNumber
    );
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: "internal server Error" });
  }
};

export const getProductByIdControllers = async (req: any, res: any) => {
  try {
    const { productId } = req.params;

    // Fetch the product data
    const product = await getProductById(productId);

    if (product) {
      // Send the product data as the response
      res.status(200).json(product);
    } else {
      // If the product is not found
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    // Handle any errors that occur
    res.status(500).json({ message: "Internal Server Error" });
  }
};
