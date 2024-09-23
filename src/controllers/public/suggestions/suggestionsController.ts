import { Request, Response } from "express";
// import qs, { ParsedQs } from "qs";
import {
  getDataByCertainFields,
  getSuggestionProductByKeywordsModal,
} from "../../../models/suggestions/productSuggestionsModal";

export const getSuggestionProductController = async (req: any, res: any) => {
  const { keywords } = req.body;
  console.log(keywords);
  try {
    const data = await getSuggestionProductByKeywordsModal(keywords);

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }
};

export const getDataByCertainFieldsController = async (
  req: Request,
  res: Response
) => {
  // Extract and validate data
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({
      error: "Missing data parameter in query string.",
    });
  }

  // Handle string or array of strings case
  let parsedData: { field: string; val: string }[] = [];

  if (typeof data === "string") {
    try {
      // Parse data if it's a string
      parsedData = JSON.parse(data);
    } catch (error) {
      return res.status(400).json({
        error: "Invalid data format. Data must be a valid JSON string.",
      });
    }
  } else if (Array.isArray(data)) {
    // Convert each item in the array to the correct format
    parsedData = data.map((item) => {
      // Ensure item is an object and extract the field and value
      if (typeof item === "object" && item !== null) {
        return {
          field: typeof item.field === "string" ? item.field : "",
          val: typeof item.val === "string" ? item.val : "",
        };
      }
      return { field: "", val: "" };
    });
  } else {
    return res.status(400).json({
      error:
        "Invalid data format. Data must be a string or an array of objects.",
    });
  }

  // Validate parsedData
  if (
    !Array.isArray(parsedData) ||
    !parsedData.every(
      (item) => typeof item.field === "string" && typeof item.val === "string"
    )
  ) {
    return res.status(400).json({
      error:
        "Invalid data format. Expected an array of objects with 'field' and 'val' properties.",
    });
  }

  try {
    const results = await getDataByCertainFields(parsedData);

    // Respond with the results
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching data by certain fields:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
