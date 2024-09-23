import {
  getSearchHistory,
  postSearchQuery,
} from "../models/publicSearchModals"; // Adjust import based on your file structure

export const postSearchQueryData = async (req: any, res: any) => {
  const { query } = req.body;
  const { sessionId, userId } = req.user;

  const identifier = userId || sessionId;
  if (!identifier) {
    return res.status(400).json({ error: "No valid user identifier found" });
  }
  try {
    const response = await postSearchQuery(identifier, query);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to post search query" });
  }
};

export const getSearchHistorySuggestion = async (req: any, res: any) => {
  const { searchQuery } = req.query;
  try {
    const response = await getSearchHistory(searchQuery);
    res.status(200).json({ data: response });
  } catch (error) {
    res.status(500).json({ error: "error is caused" });
  }
};
