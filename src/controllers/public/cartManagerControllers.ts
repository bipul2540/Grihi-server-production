import {
  getCartItemsDataModal,
  postCartItemsDataModal,
} from "../../models/public/cartManagerModal";

export const postCartItemsControlleres = async (req: any, res: any) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  const data = req.body;

  try {
    const response = await postCartItemsDataModal(data, userId);

    return res.status(200).json({ message: "success" });
  } catch (error) {
    res.status(500).json({ message: "INternal sever error" });
  }
};

export const getCartItemscontrolleres = async (req: any, res: any) => {
  const { userId } = req.user;

  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }

  try {
    const cartItems = await getCartItemsDataModal(userId);

    return res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ message: "INternal sever error" });
  }
};
