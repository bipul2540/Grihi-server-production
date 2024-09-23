import {
  addRatingsModal,
  getAllRatingsByProductId,
  getRatingsForProductAndUser,
} from "../../models/public/RatingsModal";

export const addRatingsController = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  const { data, productId } = req.body;

  try {
    await addRatingsModal(data, productId, userId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};

export const getAllRatingsControllers = async (req: any, res: any) => {
  const { productId } = req.params;

  try {
    const data = await getAllRatingsByProductId(productId);

    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};

export const getRatingsForProductsByUser = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  const { productId } = req.params;

  try {
    const data = await getRatingsForProductAndUser(productId, userId);
    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server errors" });
  }
};
