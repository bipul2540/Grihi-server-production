import Joi from "joi";
import { AddresssDataType } from "../types/types-db";

export const validateAddressData = (data: AddresssDataType) => {
  // Define the schema for address validation
  const schema = Joi.object({
    id: Joi.string(),
    address_type: Joi.string().valid("home", "work", "other").required(),
    city: Joi.string().min(2).max(100).required(),
    country: Joi.string().min(2).max(100),
    isDefault: Joi.boolean().required(),
    landmark: Joi.string().max(255).optional(),
    local_address: Joi.string().min(5).max(255).required(),
    mobile: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required(),
    name: Joi.string().min(2).max(100).required(),
    pincode: Joi.string()
      .pattern(/^[0-9]{6}$/)
      .required(),
    state: Joi.string().min(2).max(100).required(),
    alternate_mobile: Joi.string().pattern(/^[0-9]{10}$/),
  });

  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    throw error; // Joi.ValidationError will be thrown
  }

  return value as AddresssDataType;
};
