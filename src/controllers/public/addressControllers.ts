import {
  addAddressByUserId,
  getAddressByuserId,
  updateAddress,
} from "../../models/public/addressModal";
import { validateAddressData } from "../../services/addressValidationSchema";
import { ValidationError } from "joi";
import { AddresssDataType } from "../../types/types-db";
export const getAddressByUserIdControllers = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }

  try {
    const response = await getAddressByuserId(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: "internal server errorr" });
  }
};

export const addAddressByUserIdControllers = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  try {
    const validatedData = validateAddressData(req.body);
    const data = await addAddressByUserId(validatedData, userId);
    return res.status(200).json({ message: "success" });
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

function isJoiError(error: any): error is any {
  return error && typeof error === "object" && "isJoi" in error;
}

export const updateAddressControllers = async (req: any, res: any) => {
  const { userId } = req.user;
  if (!userId) {
    return res.status(400).json({ message: "Unauthorized error" });
  }
  try {
    const validatedData: AddresssDataType = validateAddressData(req.body);

    await updateAddress(validatedData, userId);
    return res.status(200).json({ message: "success" });
  } catch (error) {
    if (isJoiError(error)) {
      return res.status(400).json({ message: error.details[0].message });
    }
    res.status(500).json({ message: "Internal server error", error });
  }
};
